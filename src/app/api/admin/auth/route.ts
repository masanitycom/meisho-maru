import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    // 環境変数からパスワードを取得
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      console.error('ADMIN_PASSWORD環境変数が設定されていません');
      return NextResponse.json({ error: 'サーバー設定エラー' }, { status: 500 });
    }
    
    // パスワード確認
    if (password === adminPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'パスワードが間違っています' }, { status: 401 });
    }
  } catch (error) {
    console.error('認証エラー:', error);
    return NextResponse.json({ error: '認証に失敗しました' }, { status: 500 });
  }
}