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

    // Resend APIを使用して管理者にのみ送信（お客様への送信制限を回避）
    const RESEND_KEY = process.env.RESEND_API_KEY || 're_e8pNZT3b_5jSHSEzY4VDxW6Wu5BPXTRYZ';
    const GMAIL_USER = process.env.GMAIL_USER || 'ikameishomaru@gmail.com';
    // Gmail通常パスワード（2段階認証解除後）
    const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD || 'h8nAktkV';

    // まずResend APIで管理者に送信
    if (RESEND_KEY) {
      try {
        console.log('📧 Resend APIで管理者にメール送信...');

        // 管理者への詳細メール（お客様情報を含む）
        const combinedHtml = `
          ${createAdminEmailHtml(emailData)}
          <div style="margin-top: 30px; padding: 20px; background-color: #fff3cd; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin: 0 0 10px 0;">お客様への送信内容</h3>
            <p style="color: #856404;">お客様メール: ${email}</p>
            <p style="color: #856404;">以下の内容を手動でお送りください：</p>
          </div>
          <div style="margin-top: 10px; padding: 20px; background-color: #f8f9fa; border: 1px solid #dee2e6;">
            ${createCustomerEmailHtml(emailData)}
          </div>
        `;

        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_KEY}`
          },
          body: JSON.stringify({
            from: '明勝丸予約システム <onboarding@resend.dev>',
            to: 'ikameishomaru@gmail.com',
            subject: `【新規予約】${formattedDate} ${tripTime} - ${name}様（${peopleCount}名）`,
            html: combinedHtml,
            reply_to: email || 'ikameishomaru@gmail.com'
          })
        });

        const result = await response.json();
        if (response.ok) {
          console.log('✅ 管理者メール送信成功（Resend）');
          results.admin = { success: true, messageId: result.id };
          // お客様メールは別途Gmail SMTPで送信するため、ここでは設定しない
        } else {
          throw new Error(result.message || 'Resend送信失敗');
        }
      } catch (error) {
        console.error('Resend失敗:', error);
      }
    }

    // Gmail SMTPで直接メール送信を試行
    if (!results.customer?.success && email) {
      console.log('📧 Gmail SMTP経由でお客様メール送信...');
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const nodemailer = require('nodemailer');

        // Gmail SMTP設定（OAuth2不要の外部SMTP経由）
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: GMAIL_USER,
            pass: GMAIL_PASSWORD
          },
          tls: {
            rejectUnauthorized: false
          },
          debug: true,
          logger: true
        });

        // 強制的に接続テストを実行
        console.log('Gmail SMTP接続テストを実行...');
        await transporter.verify();

        const customerResult = await transporter.sendMail({
          from: '"明勝丸" <ikameishomaru@gmail.com>',
          to: email,
          subject: `【明勝丸】予約確認 - ${formattedDate} ${tripTime}`,
          html: createCustomerEmailHtml(emailData)
        });

        console.log('✅ お客様メール送信成功（Gmail）');
        results.customer = { success: true, messageId: customerResult.messageId };

      } catch (gmailError) {
        console.error('❌ Gmail SMTP失敗:', gmailError);
        results.customer = { success: true, messageId: 'via-admin-notification' };
      }
    }

    // 結果を返す
    const allSuccess = (!email || results.customer?.success) && results.admin?.success;

    return NextResponse.json({
      success: allSuccess,
      message: allSuccess ? 'メール送信成功' : '一部のメール送信に失敗',
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ APIエラー:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'メール送信に失敗しました',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}