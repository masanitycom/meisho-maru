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
    const GMAIL_USER = process.env.GMAIL_USER || 'ikameishomaru@gmail.com';
    const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD || 'h8nAktkV';

    // 管理者にResendで通知
    if (RESEND_KEY) {
      try {
        console.log('📧 Resend APIで管理者にメール送信...');

        // 管理者への予約通知メール（シンプルな通知のみ）
        const combinedHtml = createAdminEmailHtml(emailData);

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
        } else {
          throw new Error(result.message || 'Resend送信失敗');
        }
      } catch (error) {
        console.error('Resend失敗:', error);
      }
    }

    // お客様への確実なメール送信（Nodemailer SMTP直接送信）
    if (email) {
      try {
        console.log('📧 SMTPでお客様にメール送信...');

        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const nodemailer = require('nodemailer');

        const transporter = nodemailer.createTransporter({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: GMAIL_USER,
            pass: GMAIL_PASSWORD
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        // SMTP接続テスト
        try {
          await transporter.verify();
          console.log('✅ SMTP接続確認成功');
        } catch (verifyError) {
          console.log('⚠️ SMTP検証スキップ:', verifyError);
        }

        const customerResult = await transporter.sendMail({
          from: {
            name: '明勝丸',
            address: GMAIL_USER
          },
          to: email,
          subject: `【明勝丸】予約確認 - ${formattedDate} ${tripTime}`,
          html: createCustomerEmailHtml(emailData)
        });

        console.log('✅ お客様メール送信成功（SMTP）');
        results.customer = { success: true, messageId: customerResult.messageId };

      } catch (smtpError) {
        console.error('❌ SMTP送信失敗:', smtpError);
        results.customer = {
          success: false,
          error: 'メール送信失敗: ' + (smtpError instanceof Error ? smtpError.message : String(smtpError))
        };
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