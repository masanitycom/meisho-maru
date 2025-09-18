import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // イベント情報を取得
    const events = body.events || [];

    for (const event of events) {
      if (event.type === 'message') {
        const userId = event.source.userId;
        const messageText = event.message.text;

        // User IDをレスポンスで返す（ブラウザで確認可能）
        return NextResponse.json({
          success: true,
          userId: userId,
          message: messageText,
          note: 'このUser IDをコピーしてください'
        });
      }
    }

    return NextResponse.json({ success: true, message: 'No message events' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed: ' + String(error) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'LINE Webhook endpoint is ready' });
}