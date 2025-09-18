import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// 最後に受信したUser IDを保存する簡易的な方法
let lastUserId: string | null = null;
let lastMessage: string | null = null;
let lastTimestamp: Date | null = null;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const events = body.events || [];

    for (const event of events) {
      if (event.type === 'message') {
        // User ID情報を保存
        lastUserId = event.source.userId;
        lastMessage = event.message.text;
        lastTimestamp = new Date();

        console.log('User ID received:', lastUserId);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function GET() {
  if (lastUserId) {
    return NextResponse.json({
      success: true,
      userId: lastUserId,
      lastMessage: lastMessage,
      receivedAt: lastTimestamp,
      instruction: 'このUser IDをコピーして使用してください'
    });
  } else {
    return NextResponse.json({
      success: false,
      message: 'まだUser IDを受信していません。LINEから公式アカウントにメッセージを送信してください。'
    });
  }
}