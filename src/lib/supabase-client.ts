import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// クライアントサイド用のSupabaseクライアント（遅延初期化）
let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseClient() {
  if (!supabaseClient && typeof window !== 'undefined') {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    console.log('Initializing Supabase client:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      url: supabaseUrl?.substring(0, 30) + '...'
    });
    
    if (supabaseUrl && supabaseAnonKey) {
      supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey)
      console.log('Supabase client initialized successfully');
    } else {
      console.error('Missing Supabase environment variables');
    }
  }
  
  return supabaseClient
}

// 予約を作成（クライアントサイド用）
export const createReservation = async (reservationData: {
  date: string;
  trip_number: number;
  people_count: number;
  name: string;
  name_kana: string;
  phone: string;
  email?: string;
  rod_rental: boolean;
  rod_rental_count?: number;
  notes?: string;
  source?: string;
}) => {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error('Supabase client not initialized')
  
  const { data, error } = await supabase
    .from('reservations')
    .insert([reservationData])
    .select()
    
  if (error) throw error
  return data
}

// 顧客を作成または取得（クライアントサイド用）
export const upsertCustomer = async (customerData: {
  name: string;
  name_kana: string;
  phone: string;
  email?: string;
}) => {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error('Supabase client not initialized')
  
  const { data, error } = await supabase
    .from('customers')
    .upsert([customerData], { onConflict: 'phone' })
    .select()
    
  if (error) throw error
  return data
}

// 予約可能席数を計算（クライアントサイド用）
export const getAvailableSeats = async (date: string, tripNumber: number) => {
  const supabase = getSupabaseClient()
  if (!supabase) {
    console.error('Supabase client not initialized')
    return 8 // デフォルト値
  }

  try {
    // スケジュールから定員と運航状態を取得
    const { data: schedule, error: scheduleError } = await supabase
      .from('schedules')
      .select('max_capacity, is_available')
      .eq('date', date)
      .eq('trip_number', tripNumber)
      .single()
      
    if (scheduleError) {
      // スケジュールが存在しない場合はデフォルト値（定員8名固定）
      return 8
    }
    
    // 運航停止の場合は-1を返す（休漁日として識別）
    if (!schedule.is_available) {
      return -1
    }
    
    // 既存予約数を取得（リアルタイム）
    const { data: reservations, error: reservationError } = await supabase
      .from('reservations')
      .select('people_count')
      .eq('date', date)
      .eq('trip_number', tripNumber)
      .eq('status', 'confirmed')
      
    if (reservationError) {
      console.error(`予約取得エラー ${date}-${tripNumber}:`, reservationError);
      throw reservationError
    }
    
    const bookedSeats = reservations?.reduce((sum, r) => sum + r.people_count, 0) || 0
    // 定員は常に8名固定
    const availableSeats = 8 - bookedSeats
    
    return Math.max(0, availableSeats)
  } catch (error) {
    console.error(`空席確認エラー ${date}-${tripNumber}:`, error);
    return 8; // エラーの場合はデフォルト値
  }
}