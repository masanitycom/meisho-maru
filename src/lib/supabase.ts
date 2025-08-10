import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// 予約を作成
export const createReservation = async (reservationData: {
  date: string;
  trip_number: number;
  people_count: number;
  name: string;
  name_kana: string;
  phone: string;
  email?: string;
  rod_rental: boolean;
  notes?: string;
  source?: string;
}) => {
  const { data, error } = await supabase
    .from('reservations')
    .insert([reservationData])
    .select()
    
  if (error) throw error
  return data
}

// 顧客を作成または取得
export const upsertCustomer = async (customerData: {
  name: string;
  name_kana: string;
  phone: string;
  email?: string;
}) => {
  const { data, error } = await supabase
    .from('customers')
    .upsert([customerData], { onConflict: 'phone' })
    .select()
    
  if (error) throw error
  return data
}

// 予約一覧取得
export const getReservations = async () => {
  const { data, error } = await supabase
    .from('reservations')
    .select(`
      *,
      customers (name, phone, email)
    `)
    .order('date', { ascending: true })
    
  if (error) throw error
  return data
}

// 顧客一覧取得
export const getCustomers = async () => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })
    
  if (error) throw error
  return data
}

// スケジュール取得
export const getSchedules = async (startDate?: string, endDate?: string) => {
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

// 予約可能席数を計算
export const getAvailableSeats = async (date: string, tripNumber: number) => {
  try {
    console.log(`🔍 空席確認開始: ${date}, 便${tripNumber}`);
    
    // スケジュールから定員と運航状態を取得
    const { data: schedule, error: scheduleError } = await supabase
      .from('schedules')
      .select('max_capacity, is_available')
      .eq('date', date)
      .eq('trip_number', tripNumber)
      .single()
      
    if (scheduleError) {
      console.log(`⚠️ スケジュールエラー ${date}-${tripNumber}:`, scheduleError.message);
      // スケジュールが存在しない場合はデフォルト値
      return 10
    }
    
    console.log(`📅 スケジュール取得 ${date}-${tripNumber}:`, schedule);
    
    // 運航停止の場合は-1を返す（休漁日として識別）
    if (!schedule.is_available) {
      console.log(`🚫 休漁日 ${date}-${tripNumber}`);
      return -1
    }
    
    // 既存予約数を取得
    const { data: reservations, error: reservationError } = await supabase
      .from('reservations')
      .select('people_count')
      .eq('date', date)
      .eq('trip_number', tripNumber)
      .eq('status', 'confirmed')
      
    if (reservationError) {
      console.error(`❌ 予約取得エラー ${date}-${tripNumber}:`, reservationError);
      throw reservationError
    }
    
    const bookedSeats = reservations?.reduce((sum, r) => sum + r.people_count, 0) || 0
    const availableSeats = schedule.max_capacity - bookedSeats
    
    console.log(`✅ 空席計算完了 ${date}-${tripNumber}: 定員${schedule.max_capacity} - 予約${bookedSeats} = 空席${availableSeats}`);
    
    return Math.max(0, availableSeats)
  } catch (error) {
    console.error(`💥 getAvailableSeats エラー ${date}-${tripNumber}:`, error);
    return 10; // エラーの場合はデフォルト値
  }
}

// スケジュール更新（残席調整・休業設定）
export const updateSchedule = async (date: string, tripNumber: number, updates: {
  max_capacity?: number;
  is_available?: boolean;
}) => {
  const { data, error } = await supabase
    .from('schedules')
    .upsert([
      {
        date,
        trip_number: tripNumber,
        ...updates
      }
    ], { onConflict: 'date,trip_number' })
    .select()
    
  if (error) throw error
  return data
}

// 複数日の一括休業設定
export const setBulkHoliday = async (startDate: string, endDate: string, tripNumbers: number[]) => {
  const updates = []
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0]
    for (const tripNumber of tripNumbers) {
      updates.push({
        date: dateStr,
        trip_number: tripNumber,
        max_capacity: 10,
        is_available: false
      })
    }
  }
  
  const { data, error } = await supabase
    .from('schedules')
    .upsert(updates, { onConflict: 'date,trip_number' })
    .select()
    
  if (error) throw error
  return data
}

// 予約を削除
export const deleteReservation = async (reservationId: string) => {
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
  notes?: string;
  status?: string;
}) => {
  const { data, error } = await supabase
    .from('reservations')
    .update(updates)
    .eq('id', reservationId)
    .select()
    
  if (error) throw error
  return data
}