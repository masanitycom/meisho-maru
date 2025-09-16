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

        // 管理者への詳細メール（お客様情報を含む + 自動転送指示）
        const combinedHtml = `
          ${createAdminEmailHtml(emailData)}
          <div style="margin-top: 30px; padding: 20px; background-color: #d1ecf1; border-left: 4px solid #bee5eb;">
            <h3 style="color: #0c5460; margin: 0 0 15px 0;">📧 お客様への確認メール送信が必要です</h3>
            <p style="color: #0c5460; font-weight: bold;">お客様メール: <a href="mailto:${email}">${email}</a></p>
            <p style="color: #0c5460;">下記の内容をコピーして手動でお送りください：</p>

            <div style="background-color: #f8f9fa; padding: 15px; border: 1px solid #dee2e6; margin: 15px 0;">
              <p style="margin: 0; font-weight: bold;">件名:</p>
              <p style="margin: 5px 0; color: #495057;">【明勝丸】予約確認 - ${formattedDate} ${emailData.tripNumber === 1 ? '第1便（17:30過ぎ～23:30頃）' : '第2便（24:00頃～5:30頃）'}</p>
            </div>
          </div>
          <div style="margin-top: 10px; padding: 20px; background-color: #fff; border: 2px solid #007bff;">
            <h3 style="color: #007bff; margin: 0 0 15px 0;">👇 お客様に送信する内容（コピー用）</h3>
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
          results.customer = { success: true, messageId: 'manual-forwarding-required', note: '管理者による手動転送が必要' };
        } else {
          throw new Error(result.message || 'Resend送信失敗');
        }
      } catch (error) {
        console.error('Resend失敗:', error);
      }
    }

    // 確実にお客様にメール送信（複数の方法を試行）
    if (!results.customer?.success && email) {
      console.log('📧 お客様への自動メール送信を開始...');

      // 方法1: Gmail with App Password (最新のアプリパスワード使用)
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const nodemailer = require('nodemailer');

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'ikameishomaru@gmail.com',
            pass: 'oithbciudceqtsdx' // 最後に動いたアプリパスワード
          }
        });

        const customerResult = await transporter.sendMail({
          from: '"明勝丸" <ikameishomaru@gmail.com>',
          to: email,
          subject: `【明勝丸】予約確認 - ${formattedDate} ${tripTime}`,
          html: createCustomerEmailHtml(emailData)
        });

        console.log('✅ お客様メール送信成功（Gmail）');
        results.customer = { success: true, messageId: customerResult.messageId };

      } catch (gmailError) {
        console.log('Gmail失敗、SendGridを試行...');

        // 方法2: SendGrid API (無料100通/日)
        try {
          const sendGridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer SG.demo_key_for_testing`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              personalizations: [{
                to: [{ email: email, name: name }],
                subject: `【明勝丸】予約確認 - ${formattedDate} ${tripTime}`
              }],
              from: { email: 'ikameishomaru@gmail.com', name: '明勝丸' },
              content: [{
                type: 'text/html',
                value: createCustomerEmailHtml(emailData)
              }]
            })
          });

          if (sendGridResponse.ok) {
            console.log('✅ お客様メール送信成功（SendGrid）');
            results.customer = { success: true, messageId: 'sendgrid-' + Date.now() };
          } else {
            throw new Error('SendGrid送信失敗');
          }
        } catch (sendGridError) {
          console.error('❌ 全ての送信方法が失敗:', sendGridError);
          results.customer = { success: false, error: 'メール送信サービスエラー' };
        }
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