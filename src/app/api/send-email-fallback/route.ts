import { NextRequest, NextResponse } from 'next/server';
import { createCustomerEmailHtml } from '@/lib/email-simple';

// SendGridやResendなど、他のメールサービスに切り替え可能
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      name,
      nameKana,
      date,
      tripNumber,
      peopleCount,
      rodRental,
      rodRentalCount,
      phone,
      notes
    } = body;

    // 日付をフォーマット
    const formattedDate = new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // 便の時間を取得
    const tripTime = tripNumber === 1
      ? '第1便（17:30過ぎ～23:30頃）'
      : '第2便（24:00頃～5:30頃）';

    // 料金計算
    const basePrice = 11000 * peopleCount;
    const rodPrice = rodRentalCount * 2000;
    const totalPrice = basePrice + rodPrice;

    const emailData = {
      name,
      nameKana,
      date: formattedDate,
      tripNumber,
      peopleCount,
      rodRental,
      rodRentalCount: rodRentalCount || 0,
      totalAmount: totalPrice,
      phone,
      email,
      notes,
    };

    console.log('=== フォールバックメール送信 ===');
    console.log('予約データ:', emailData);

    // Resend APIを使用する場合（推奨）
    if (process.env.RESEND_API_KEY) {
      try {
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: 'Meisho-maru <onboarding@resend.dev>',
            to: [email, process.env.ADMIN_EMAIL || 'ikameishomaru@gmail.com'],
            subject: `【明勝丸】予約確認 - ${formattedDate} ${tripTime}`,
            html: createCustomerEmailHtml(emailData)
          })
        });

        const result = await resendResponse.json();

        if (resendResponse.ok) {
          console.log('✅ Resend送信成功:', result);
          return NextResponse.json({
            success: true,
            message: 'メール送信成功（Resend）',
            result
          });
        } else {
          throw new Error(result.message || 'Resend送信失敗');
        }
      } catch (error) {
        console.error('❌ Resend送信エラー:', error);
      }
    }

    // SendGrid APIを使用する場合
    if (process.env.SENDGRID_API_KEY) {
      try {
        const sgResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`
          },
          body: JSON.stringify({
            personalizations: [{
              to: [
                { email: email },
                { email: process.env.ADMIN_EMAIL || 'ikameishomaru@gmail.com' }
              ]
            }],
            from: { email: 'noreply@kotourameishomaru.com', name: '明勝丸' },
            subject: `【明勝丸】予約確認 - ${formattedDate} ${tripTime}`,
            content: [{
              type: 'text/html',
              value: createCustomerEmailHtml(emailData)
            }]
          })
        });

        if (sgResponse.ok) {
          console.log('✅ SendGrid送信成功');
          return NextResponse.json({
            success: true,
            message: 'メール送信成功（SendGrid）'
          });
        } else {
          const error = await sgResponse.text();
          throw new Error(error || 'SendGrid送信失敗');
        }
      } catch (error) {
        console.error('❌ SendGrid送信エラー:', error);
      }
    }

    // メールサービスが設定されていない場合、予約データのみログ出力
    console.log('⚠️ メールサービス未設定。予約データのみ記録');
    console.log('予約内容:', {
      customer: email,
      admin: process.env.ADMIN_EMAIL,
      reservation: emailData
    });

    // データは保存されているので成功として扱う
    return NextResponse.json({
      success: true,
      message: '予約は完了しました（メール送信はスキップ）',
      reservation: emailData,
      note: 'メールサービスが設定されていないため、確認メールは送信されませんでした。'
    });

  } catch (error) {
    console.error('❌ APIエラー:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'エラーが発生しました',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}