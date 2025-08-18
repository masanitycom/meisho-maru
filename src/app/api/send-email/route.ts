import { NextRequest, NextResponse } from 'next/server';
import { sendReservationEmail, sendAdminNotificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      email,
      name,
      nameKana,
      date,
      tripNumber,
      peopleCount,
      rodRental,
      phone,
      notes,
    } = body;

    // 料金計算
    const basePrice = 11000;
    const rodRentalPrice = rodRental ? 2000 : 0;
    const totalAmount = (basePrice + rodRentalPrice) * peopleCount;

    // 日付をフォーマット
    const dateObj = new Date(date);
    const formattedDate = `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月${dateObj.getDate()}日`;

    const emailData = {
      name,
      nameKana,
      date: formattedDate,
      tripNumber,
      peopleCount,
      rodRental,
      totalAmount,
      phone,
      email,
      notes,
    };

    console.log('メール送信開始:', { email, name, date: formattedDate });

    // 並列でメール送信
    const [customerResult, adminResult] = await Promise.all([
      // お客様への確認メール（メールアドレスがある場合のみ）
      email ? sendReservationEmail(email, emailData) : Promise.resolve({ success: true, skipped: 'no email' }),
      // 管理者への通知メール
      sendAdminNotificationEmail(emailData),
    ]);

    console.log('メール送信結果:', { 
      customer: customerResult, 
      admin: adminResult,
      emailProvided: !!email 
    });

    if (!customerResult.success || !adminResult.success) {
      console.error('メール送信に一部失敗:', { customerResult, adminResult });
      return NextResponse.json(
        { 
          success: false, 
          message: 'メール送信に一部失敗しました',
          details: { customerResult, adminResult }
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'メール送信成功',
      details: { customerResult, adminResult, emailProvided: !!email }
    });
    
  } catch (error) {
    console.error('メール送信エラー:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'メール送信に失敗しました',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
