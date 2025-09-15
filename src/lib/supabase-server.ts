import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { supabaseConfig } from './supabase-config'

// サーバーサイド用のSupabaseクライアント作成関数
export function createServerSupabaseClient() {
  const supabaseUrl = supabaseConfig.url
  const supabaseKey = supabaseConfig.serviceRoleKey || supabaseConfig.anonKey

  console.log('Server Supabase config:', {
    hasUrl: !!supabaseUrl,
    hasServiceKey: !!supabaseConfig.serviceRoleKey,
    hasAnonKey: !!supabaseConfig.anonKey,
    usingServiceRole: !!supabaseConfig.serviceRoleKey
  });

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables for server')
    // エラーを投げずにnullを返す
    return null
  }

  return createClient<Database>(supabaseUrl, supabaseKey)
}

// 予約可能席数を計算（サーバーサイド用、schedulesテーブルの休業状況も考慮）
export const getAvailableSeatsServer = async (date: string, tripNumber: number) => {
  const supabase = createServerSupabaseClient()

  if (!supabase) {
    // Supabaseが利用できない場合はデフォルト値を返す
    return 8
  }

  try {
    // 並行して運航状況と予約数を取得
    const [scheduleResult, reservationResult] = await Promise.all([
      supabase
        .from('schedules')
        .select('is_available')
        .eq('date', date)
        .eq('trip_number', tripNumber)
        .single(),
      supabase
        .from('reservations')
        .select('people_count')
        .eq('date', date)
        .eq('trip_number', tripNumber)
        .eq('status', 'confirmed')
    ]);

    // 休業チェック
    if (scheduleResult.data && scheduleResult.data.is_available === false) {
      console.log(`サーバー: ${date} ${tripNumber}便: 休業日`);
      return -1; // 休業日は-1を返す
    }

    // 予約数計算
    if (reservationResult.error) {
      console.error(`予約取得エラー ${date}-${tripNumber}:`, reservationResult.error);
      return 8; // エラーの場合はデフォルト値
    }

    const bookedSeats = reservationResult.data?.reduce((sum, r) => sum + r.people_count, 0) || 0
    console.log(`サーバー: ${date} ${tripNumber}便: 予約済み ${bookedSeats}席`);

    // 定員は常に8名固定
    const availableSeats = 8 - bookedSeats

    return Math.max(0, availableSeats)
  } catch (error) {
    console.error(`空席確認エラー ${date}-${tripNumber}:`, error);
    return 8; // エラーの場合はデフォルト値
  }
}