import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// グローバル変数でUser IDを保存
global.lastLineUserId = global.lastLineUserId || null;
global.lastLineMessage = global.lastLineMessage || null;
global.lastLineTimestamp = global.lastLineTimestamp || null;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // イベント情報を取得
    const events = body.events || [];

    for (const event of events) {
      if (event.type === 'message') {
        // グローバル変数に保存
        global.lastLineUserId = event.source.userId;
        global.lastLineMessage = event.message.text;
        global.lastLineTimestamp = new Date().toISOString();

        console.log('=== LINE User ID 受信 ===');
        console.log('User ID:', global.lastLineUserId);
        console.log('Message:', global.lastLineMessage);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed: ' + String(error) }, { status: 500 });
  }
}

export async function GET() {
  if (global.lastLineUserId) {
    return NextResponse.json({
      success: true,
      userId: global.lastLineUserId,
      lastMessage: global.lastLineMessage,
      receivedAt: global.lastLineTimestamp,
      instruction: '↑ このUser IDをコピーして使用してください'
    });
  } else {
    return NextResponse.json({
      message: 'User IDを取得するには：',
      step1: '1. LINEアプリから明勝丸公式アカウント（@707ejlid）にメッセージを送信',
      step2: '2. このページをリロード（F5キー）',
      step3: '3. User IDが表示されます'
    });
  }
}