import { NextRequest, NextResponse } from 'next/server';
import { createCustomerEmailHtml, createAdminEmailHtml } from '@/lib/email-simple';

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

    console.log('=== メール送信開始 ===');
    console.log('送信データ:', emailData);

    const results = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      customer: null as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      admin: null as any
    };

    // 環境変数取得
    const RESEND_KEY = process.env.RESEND_API_KEY || 're_e8pNZT3b_5jSHSEzY4VDxW6Wu5BPXTRYZ';

    // 1. 管理者に予約通知（Resend - 確実に動作）
    if (RESEND_KEY) {
      try {
        console.log('📧 管理者への予約通知送信...');
        const adminHtml = createAdminEmailHtml(emailData);

        const adminResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_KEY}`
          },
          body: JSON.stringify({
            from: '明勝丸予約システム <onboarding@resend.dev>',
            to: 'ikameishomaru@gmail.com',
            subject: `【新規予約】${formattedDate} ${tripTime} - ${name}様（${peopleCount}名）`,
            html: adminHtml,
            reply_to: email || 'ikameishomaru@gmail.com'
          })
        });

        const adminResult = await adminResponse.json();
        if (adminResponse.ok) {
          console.log('✅ 管理者メール送信成功');
          results.admin = { success: true, messageId: adminResult.id };
        } else {
          throw new Error(adminResult.message || 'Resend送信失敗');
        }
      } catch (error) {
        console.error('管理者メール送信失敗:', error);
        results.admin = { success: false, error: String(error) };
      }
    }

    // 2. お客様に確認メール（Resend経由で ikameishomaru@gmail.com に送信し、そこから転送）
    if (email) {
      try {
        console.log('📧 お客様メール準備中...');

        // お客様宛のメール内容を管理者のGmailに送信し、そこから自動転送
        const customerEmailContent = createCustomerEmailHtml(emailData);

        const forwardingHtml = `
          <div style="background-color: #e3f2fd; padding: 20px; border-left: 5px solid #2196f3; margin-bottom: 20px;">
            <h2 style="color: #1976d2; margin: 0 0 15px 0;">📧 自動転送: お客様への確認メール</h2>
            <p style="color: #1976d2; font-weight: bold; margin: 5px 0;">転送先: ${email}</p>
            <p style="color: #1976d2; margin: 5px 0;">お客様: ${name}様</p>
            <p style="color: #0d47a1; background-color: #bbdefb; padding: 10px; border-radius: 5px;">
              <strong>このメールを ${email} に転送してください</strong>
            </p>
          </div>
          <div style="border: 2px solid #4caf50; padding: 20px; background-color: #f1f8e9;">
            <h3 style="color: #388e3c; margin: 0 0 15px 0;">👇 転送する内容</h3>
            ${customerEmailContent}
          </div>
        `;

        const forwardResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_KEY}`
          },
          body: JSON.stringify({
            from: '明勝丸自動転送 <onboarding@resend.dev>',
            to: 'ikameishomaru@gmail.com',
            subject: `【転送依頼】${email}様への確認メール - ${formattedDate} ${tripTime}`,
            html: forwardingHtml
          })
        });

        const forwardResult = await forwardResponse.json();
        if (forwardResponse.ok) {
          console.log('✅ 転送依頼メール送信成功');
          results.customer = {
            success: true,
            messageId: forwardResult.id,
            method: 'gmail_forwarding',
            note: '管理者Gmail経由で転送予定'
          };
        } else {
          throw new Error(forwardResult.message || '転送依頼失敗');
        }

      } catch (forwardError) {
        console.error('❌ 転送依頼失敗:', forwardError);
        results.customer = {
          success: false,
          error: '転送システム失敗: ' + String(forwardError),
          customer_email: email,
          customer_name: name
        };
      }
    }

    // 結果を返す
    const allSuccess = (!email || results.customer?.success) && results.admin?.success;

    return NextResponse.json({
      success: allSuccess,
      message: allSuccess ? '予約完了 - メール準備中' : '予約完了 - メール送信に問題',
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ APIエラー:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'システムエラーが発生しました',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}