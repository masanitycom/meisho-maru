// 管理画面用のSupabase関数（クライアントサイド）
import { getSupabaseClient } from './supabase-client'
import { createClient } from '@supabase/supabase-js'

// フォールバック用Supabaseクライアント作成
function createSupabaseClientDirect() {
  if (typeof window === 'undefined') return null; // サーバーサイドでは使用しない

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error('Supabase environment variables missing');
    return null;
  }

  return createClient(url, key, {
    global: {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    }
  });
}

// Supabaseクライアント取得（フォールバック付き）
function getSupabaseClientWithFallback() {
  const client = getSupabaseClient();
  if (client) return client;

  console.warn('Primary Supabase client failed, using fallback');
  return createSupabaseClientDirect();
}

// 予約一覧取得
export const getReservations = async () => {
  const supabase = getSupabaseClientWithFallback()
  if (!supabase) throw new Error('Supabase client not initialized')

  const { data, error } = await supabase
    .from('reservations')
    .select(`
      *,
      customers (name, phone, email)
    `)
    .order('date', { ascending: false })
    .order('trip_number', { ascending: false })
    
  if (error) throw error
  return data
}

// 顧客一覧取得
export const getCustomers = async () => {
  const supabase = getSupabaseClientWithFallback()
  if (!supabase) throw new Error('Supabase client not initialized')
  
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })
    
  if (error) throw error
  return data
}

// スケジュール取得
export const getSchedules = async (startDate?: string, endDate?: string) => {
  const supabase = getSupabaseClientWithFallback()
  if (!supabase) throw new Error('Supabase client not initialized')
  
  let query = supabase
    .from('schedules')
    .select('*')
    .order('date', { ascending: true })
    
  if (startDate) query = query.gte('date', startDate)
  if (endDate) query = query.lte('date', endDate)
    
  const { data, error } = await query
    
  if (error) throw error
  return data
}

// 予約可能席数を計算（schedulesテーブルを使わずreservationsのみで計算）
export const getAvailableSeats = async (date: string, tripNumber: number) => {
  const supabase = getSupabaseClientWithFallback()
  if (!supabase) {
    console.error('Supabase client not initialized')
    return 8
  }

  try {
    // 既存予約数を取得（リアルタイム）
    const { data: reservations, error: reservationError } = await supabase
      .from('reservations')
      .select('people_count')
      .eq('date', date)
      .eq('trip_number', tripNumber)
      .eq('status', 'confirmed')
      
    if (reservationError) {
      console.error(`予約取得エラー ${date}-${tripNumber}:`, reservationError);
      // エラーが発生した場合はデフォルト値を返す
      return 8;
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bookedSeats = reservations?.reduce((sum, r: any) => sum + r.people_count, 0) || 0
    console.log(`${date} ${tripNumber}便: 予約済み ${bookedSeats}席`);
    
    // 定員は常に8名固定
    const availableSeats = 8 - bookedSeats
    
    return Math.max(0, availableSeats)
  } catch (error) {
    console.error(`空席確認エラー ${date}-${tripNumber}:`, error);
    return 8; // エラーの場合はデフォルト値
  }
}

// スケジュール更新（残席調整・休業設定）
export const updateSchedule = async (date: string, tripNumber: number, updates: {
  max_capacity?: number;
  is_available?: boolean;
}) => {
  const supabase = getSupabaseClientWithFallback()
  if (!supabase) throw new Error('Supabase client not initialized')
  
  const { data, error } = await supabase
    .from('schedules')
    .upsert([
      {
        date,
        trip_number: tripNumber,
        ...updates
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any, { onConflict: 'date,trip_number' })
    .select()
    
  if (error) throw error
  return data
}

// 複数日の一括休業設定
export const setBulkHoliday = async (startDate: string, endDate: string, tripNumbers: number[]) => {
  const supabase = getSupabaseClientWithFallback()
  if (!supabase) throw new Error('Supabase client not initialized')
  
  const updates = []
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0]
    for (const tripNumber of tripNumbers) {
      updates.push({
        date: dateStr,
        trip_number: tripNumber,
        max_capacity: 8,
        is_available: false
      })
    }
  }
  
  const { data, error } = await supabase
    .from('schedules')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .upsert(updates as any, { onConflict: 'date,trip_number' })
    .select()
    
  if (error) throw error
  return data
}

// 予約を削除
export const deleteReservation = async (reservationId: string) => {
  const supabase = getSupabaseClientWithFallback()
  if (!supabase) throw new Error('Supabase client not initialized')
  
  const { error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', reservationId)
    
  if (error) throw error
}

// 予約を更新
export const updateReservation = async (reservationId: string, updates: {
  date?: string;
  trip_number?: number;
  people_count?: number;
  name?: string;
  name_kana?: string;
  phone?: string;
  email?: string;
  rod_rental?: boolean;
  rod_rental_count?: number;
  notes?: string;
  status?: string;
}) => {
  const supabase = getSupabaseClientWithFallback()
  if (!supabase) throw new Error('Supabase client not initialized')
  
  const { data, error } = await supabase
    .from('reservations')
    .update(updates)
    .eq('id', reservationId)
    .select()
    
  if (error) throw error
  return data
}