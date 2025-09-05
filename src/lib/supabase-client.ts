import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { supabaseConfig, isSupabaseConfigured } from './supabase-config'

// クライアントサイド用のSupabaseクライアント（遅延初期化）
let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseClient() {
  if (!supabaseClient && typeof window !== 'undefined') {
    console.log('Initializing Supabase client:', {
      hasUrl: !!supabaseConfig.url,
      hasKey: !!supabaseConfig.anonKey,
      url: supabaseConfig.url?.substring(0, 30) + '...',
      isConfigured: isSupabaseConfigured()
    });
    
    if (isSupabaseConfigured()) {
      try {
        supabaseClient = createClient<Database>(supabaseConfig.url, supabaseConfig.anonKey)
        console.log('Supabase client initialized successfully');
      } catch (error) {
        console.error('Failed to create Supabase client:', error);
      }
    } else {
      console.error('Missing Supabase environment variables', {
        url: supabaseConfig.url,
        hasKey: !!supabaseConfig.anonKey
      });
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

// 予約可能席数を計算（クライアントサイド用、schedulesテーブルを使わない）
export const getAvailableSeats = async (date: string, tripNumber: number) => {
  const supabase = getSupabaseClient()
  if (!supabase) {
    console.error('Supabase client not initialized')
    return 8 // デフォルト値
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
      return 8; // エラーの場合はデフォルト値
    }
    
    const bookedSeats = reservations?.reduce((sum, r) => sum + r.people_count, 0) || 0
    console.log(`${date} ${tripNumber}便: 予約済み ${bookedSeats}席`);
    
    // 定員は常に8名固定
    const availableSeats = 8 - bookedSeats
    
    return Math.max(0, availableSeats)
  } catch (error) {
    console.error(`空席確認エラー ${date}-${tripNumber}:`, error);
    return 8; // エラーの場合はデフォルト値
  }
}