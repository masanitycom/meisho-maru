import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// サーバーサイド用のSupabaseクライアント作成関数
export function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables')
    // エラーを投げずにnullを返す
    return null
  }

  return createClient<Database>(supabaseUrl, supabaseKey)
}

// 予約可能席数を計算（サーバーサイド用）
export const getAvailableSeatsServer = async (date: string, tripNumber: number) => {
  const supabase = createServerSupabaseClient()
  
  if (!supabase) {
    // Supabaseが利用できない場合はデフォルト値を返す
    return 8
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