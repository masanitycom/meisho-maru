import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('=== LINE Webhook受信 ===');
    console.log('Full body:', JSON.stringify(body, null, 2));

    // イベント情報を取得
    const events = body.events || [];

    for (const event of events) {
      if (event.type === 'message') {
        console.log('=== ユーザー情報 ===');
        console.log('User ID:', event.source.userId);
        console.log('Message:', event.message.text);
        console.log('Timestamp:', new Date(event.timestamp));
        console.log('====================');
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'LINE Webhook endpoint is ready' });
}