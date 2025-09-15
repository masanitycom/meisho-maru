import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase-client';

export async function GET() {
  try {
    console.log('=== Supabaseテスト ===');

    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: 'Supabase client not initialized'
      }, { status: 500 });
    }

    // schedules テーブルアクセステスト
    const { data: schedules, error: schedulesError } = await supabase
      .from('schedules')
      .select('*')
      .limit(1);

    if (schedulesError) {
      console.error('Schedules error:', schedulesError);
      return NextResponse.json({
        success: false,
        error: 'Schedules access failed',
        details: schedulesError
      }, { status: 500 });
    }

    // reservations テーブルアクセステスト
    const { data: reservations, error: reservationsError } = await supabase
      .from('reservations')
      .select('*')
      .limit(1);

    if (reservationsError) {
      console.error('Reservations error:', reservationsError);
      return NextResponse.json({
        success: false,
        error: 'Reservations access failed',
        details: reservationsError
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase接続成功',
      data: {
        schedulesCount: schedules?.length || 0,
        reservationsCount: reservations?.length || 0
      }
    });

  } catch (error) {
    console.error('Supabase test error:', error);
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 });
  }
}