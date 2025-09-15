import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    console.log('=== Supabaseテスト ===');
    console.log('環境変数チェック:');
    console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '設定済み' : '未設定');
    console.log('SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '設定済み' : '未設定');

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Supabase environment variables not configured'
      }, { status: 500 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          }
        }
      }
    );

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