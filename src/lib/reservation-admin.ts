import { supabase } from './supabase';

// 手動予約の作成（電話・LINE予約用）
export const createManualReservation = async (
  date: string,
  tripNumber: number,
  peopleCount: number
) => {
  const { data, error } = await supabase
    .from('reservations')
    .insert([{
      date,
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
    
  if (error) throw error;
  return data;
};

// 手動予約の削除（最後に追加した予約から削除）
export const deleteLastManualReservation = async (
  date: string,
  tripNumber: number
) => {
  // 最新の手動予約を1件取得
  const { data: reservation, error: fetchError } = await supabase
    .from('reservations')
    .select('id')
    .eq('date', date)
    .eq('trip_number', tripNumber)
    .eq('source', 'manual')
    .eq('status', 'confirmed')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
    
  if (fetchError || !reservation) {
    console.log('削除する手動予約がありません');
    return null;
  }
  
  // 該当予約を削除
  const { error: deleteError } = await supabase
    .from('reservations')
    .delete()
    .eq('id', reservation.id);
    
  if (deleteError) throw deleteError;
  return reservation.id;
};

// 予約人数の取得
export const getReservationCount = async (
  date: string,
  tripNumber: number
): Promise<number> => {
  const { data, error } = await supabase
    .from('reservations')
    .select('people_count')
    .eq('date', date)
    .eq('trip_number', tripNumber)
    .eq('status', 'confirmed');
    
  if (error) {
    console.error('予約人数取得エラー:', error);
    return 0;
  }
  
  return data?.reduce((sum, r) => sum + r.people_count, 0) || 0;
};