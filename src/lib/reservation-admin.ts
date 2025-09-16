import { getSupabaseClient } from './supabase-client';
import { normalizeDate } from './date-utils';

// 手動予約の作成（電話・LINE予約用）
export const createManualReservation = async (
  date: string,
  tripNumber: number,
  peopleCount: number
) => {
  console.log('Creating manual reservation:', { date, tripNumber, peopleCount });
  
  const normalizedDate = normalizeDate(date);
  console.log('Normalized date:', normalizedDate);
  
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.error('Failed to get Supabase client');
    throw new Error('Supabase client not initialized');
  }
  
  console.log('Supabase client ready, inserting reservation...');
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('reservations')
    .insert([{
      date: normalizedDate,
      trip_number: tripNumber,
      people_count: peopleCount,
      name: '電話・LINE予約',
      name_kana: 'デンワラインヨヤク',
      phone: '000-0000-0000',
      email: null,
      rod_rental: false,
      status: 'confirmed',
      source: 'manual',
      notes: '管理画面から手動登録'
    }])
    .select()
    .single();
    
  if (error) {
    console.error('Manual reservation creation error:', error);
    throw error;
  }
  
  console.log('Manual reservation created:', data);
  return data;
};

// 手動予約の削除（最後に追加した予約から削除）
export const deleteLastManualReservation = async (
  date: string,
  tripNumber: number
) => {
  console.log('Deleting manual reservation:', { date, tripNumber });
  
  const normalizedDate = normalizeDate(date);
  console.log('Normalized date for deletion:', normalizedDate);
  
  // 最新の手動予約を1件取得
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase client not initialized');
  
  const { data: reservation, error: fetchError } = await supabase
    .from('reservations')
    .select('id')
    .eq('date', normalizedDate)
    .eq('trip_number', tripNumber)
    .eq('source', 'manual')
    .eq('status', 'confirmed')
    .order('created_at', { ascending: false })
    .limit(1)
    .single() as { data: { id: string } | null, error: any };
    
  if (fetchError || !reservation) {
    console.log('削除する手動予約がありません:', fetchError);
    return null;
  }
  
  // 該当予約を削除
  const { error: deleteError } = await supabase
    .from('reservations')
    .delete()
    .eq('id', reservation.id);
    
  if (deleteError) {
    console.error('Manual reservation deletion error:', deleteError);
    throw deleteError;
  }
  
  console.log('Manual reservation deleted:', reservation.id);
  return reservation.id;
};

// 予約人数の取得
export const getReservationCount = async (
  date: string,
  tripNumber: number
): Promise<number> => {
  const normalizedDate = normalizeDate(date);
  
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase client not initialized');
  
  const { data, error } = await supabase
    .from('reservations')
    .select('people_count')
    .eq('date', normalizedDate)
    .eq('trip_number', tripNumber)
    .eq('status', 'confirmed');
    
  if (error) {
    console.error('予約人数取得エラー:', error);
    return 0;
  }
  
  return data?.reduce((sum, r) => sum + r.people_count, 0) || 0;
};