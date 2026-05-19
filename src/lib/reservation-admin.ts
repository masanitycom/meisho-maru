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

// 予約の削除（手動予約を優先、無ければウェブ予約等を含む最新の確定予約を削除）
export const deleteLastManualReservation = async (
  date: string,
  tripNumber: number
) => {
  console.log('Deleting reservation:', { date, tripNumber });

  const normalizedDate = normalizeDate(date);
  console.log('Normalized date for deletion:', normalizedDate);

  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase client not initialized');

  // 手動予約を優先（実顧客データを保全するため）、無ければ任意のsource
  const findLatest = async (manualOnly: boolean) => {
    let query = supabase
      .from('reservations')
      .select('id, source')
      .eq('date', normalizedDate)
      .eq('trip_number', tripNumber)
      .eq('status', 'confirmed');

    if (manualOnly) query = query.eq('source', 'manual');

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle() as { data: { id: string; source: string } | null, error: unknown };

    return { data, error };
  };

  const manualResult = await findLatest(true);
  if (manualResult.error) {
    console.error('予約取得エラー:', manualResult.error);
    throw manualResult.error;
  }

  const fallbackResult = manualResult.data ? null : await findLatest(false);
  if (fallbackResult?.error) {
    console.error('予約取得エラー:', fallbackResult.error);
    throw fallbackResult.error;
  }

  const reservation = manualResult.data ?? fallbackResult?.data ?? null;

  if (!reservation) {
    throw new Error(`${normalizedDate} ${tripNumber}便: 削除可能な予約がありません`);
  }

  // manualソースのダミー予約のみ物理削除。実顧客の予約はキャンセル扱い（論理削除）
  if (reservation.source === 'manual') {
    const { error: deleteError } = await supabase
      .from('reservations')
      .delete()
      .eq('id', reservation.id);

    if (deleteError) {
      console.error('Reservation deletion error:', deleteError);
      throw deleteError;
    }

    console.log('Manual reservation deleted:', reservation.id);
  } else {
    const { error: cancelError } = await supabase
      .from('reservations')
      // @ts-expect-error - Supabase型定義の制限を回避
      .update({ status: 'cancelled' })
      .eq('id', reservation.id)
      .eq('status', 'confirmed'); // 二重キャンセル防止＆対象保証

    if (cancelError) {
      console.error('Reservation cancellation error:', cancelError);
      throw cancelError;
    }

    console.log('Reservation cancelled (soft delete):', reservation.id, 'source:', reservation.source);
  }

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
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data?.reduce((sum, r: any) => sum + r.people_count, 0) || 0;
};