import { NextRequest, NextResponse } from 'next/server';
import { createCustomerEmailHtml, createAdminEmailHtml } from '@/lib/email-simple';

// Vercel Edge Runtime用の設定
export const runtime = 'nodejs';

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

    console.log('=== 完全自動メール送信開始 ===');

    const results = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      customer: null as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      admin: null as any
    };

    const RESEND_KEY = process.env.RESEND_API_KEY || 're_e8pNZT3b_5jSHSEzY4VDxW6Wu5BPXTRYZ';

    // 管理者通知（Resend - 確実に動作）
    try {
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
          html: createAdminEmailHtml(emailData)
        })
      });

      const adminResult = await adminResponse.json();
      results.admin = adminResponse.ok
        ? { success: true, messageId: adminResult.id }
        : { success: false, error: adminResult.message };

      console.log(adminResponse.ok ? '✅ 管理者通知成功' : '❌ 管理者通知失敗');
    } catch (adminError) {
      results.admin = { success: false, error: String(adminError) };
    }

    // お客様自動返信（Vercel Functions + nodemailer）
    if (email) {
      try {
        console.log('🚀 お客様自動返信開始（Zoho SMTP + nodemailer）...');

        // Vercel Functions環境でnodemailerを使用
        const { default: nodemailer } = await import('nodemailer');

        // Zoho SMTP設定（正式な設定）
        const transporter = nodemailer.createTransport({
          host: 'smtp.zoho.jp',
          port: 465,
          secure: true, // SSL使用
          auth: {
            user: 'meishomaru@zohomail.jp',
            pass: 'yS0JCTeWrFtp' // Zohoアプリパスワード
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        // SMTP接続確認
        await transporter.verify();
        console.log('✅ Zoho SMTP接続成功');

        // お客様にメール送信
        const customerResult = await transporter.sendMail({
          from: {
            name: '明勝丸',
            address: 'meishomaru@zohomail.jp'
          },
          to: email,
          subject: `【明勝丸】予約確認 - ${formattedDate} ${tripTime}`,
          html: createCustomerEmailHtml(emailData),
          replyTo: 'ikameishomaru@gmail.com'
        });

        console.log('✅ お客様自動返信成功（Zoho SMTP）');
        results.customer = {
          success: true,
          messageId: customerResult.messageId,
          service: 'Zoho SMTP via nodemailer'
        };

      } catch (zohoError) {
        console.error('❌ Zoho SMTP失敗:', zohoError);

        // フォールバック: Gmail SMTP
        try {
          console.log('🔄 Gmail SMTPにフォールバック...');

          const { default: nodemailer } = await import('nodemailer');

          const gmailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'ikameishomaru@gmail.com',
              pass: process.env.GMAIL_APP_PASSWORD || 'oithbciudceqtsdx'
            }
          });

          const gmailResult = await gmailTransporter.sendMail({
            from: {
              name: '明勝丸',
              address: 'ikameishomaru@gmail.com'
            },
            to: email,
            subject: `【明勝丸】予約確認 - ${formattedDate} ${tripTime}`,
            html: createCustomerEmailHtml(emailData)
          });

          console.log('✅ お客様自動返信成功（Gmail SMTP）');
          results.customer = {
            success: true,
            messageId: gmailResult.messageId,
            service: 'Gmail SMTP via nodemailer'
          };

        } catch (gmailError) {
          console.error('❌ 全てのSMTP送信が失敗:', gmailError);
          results.customer = {
            success: false,
            error: 'SMTP送信完全失敗: ' + String(gmailError)
          };
        }
      }
    }

    // 結果判定
    const customerSuccess = !email || results.customer?.success;
    const allSuccess = customerSuccess && results.admin?.success;

    return NextResponse.json({
      success: allSuccess,
      message: allSuccess
        ? '🎉 完全自動メール送信成功！'
        : customerSuccess
          ? '管理者通知失敗'
          : 'お客様自動返信失敗',
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ システムエラー:', error);
    return NextResponse.json({
      success: false,
      error: 'システムエラー: ' + String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}