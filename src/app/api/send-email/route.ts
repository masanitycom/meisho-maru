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

    // お客様への確実な自動メール送信
    if (email && !results.customer?.success) {
      console.log('📧 お客様への自動メール送信を開始...');

      // 方法1: Resend APIで直接お客様に送信を試行
      if (RESEND_KEY) {
        try {
          console.log('📧 Resend APIでお客様に直接メール送信を試行...');

          const customerResendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${RESEND_KEY}`
            },
            body: JSON.stringify({
              from: '明勝丸 <onboarding@resend.dev>',
              to: email,
              subject: `【明勝丸】予約確認 - ${formattedDate} ${tripTime}`,
              html: createCustomerEmailHtml(emailData),
              reply_to: 'ikameishomaru@gmail.com'
            })
          });

          const customerResult = await customerResendResponse.json();
          if (customerResendResponse.ok) {
            console.log('✅ お客様メール送信成功（Resend直接送信）');
            results.customer = { success: true, messageId: customerResult.id };
          } else {
            throw new Error(customerResult.message || 'Resend直接送信失敗');
          }
        } catch (resendDirectError) {
          console.log('Resend直接送信失敗、Gmail SMTPを試行:', resendDirectError);

          // 方法2: Gmail with App Password (フォールバック)
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
            console.error('❌ Gmail送信も失敗:', gmailError);
            results.customer = { success: false, error: 'お客様メール送信失敗（全ての方法が失敗）' };
          }
        }
      } else {
        console.error('❌ RESEND_API_KEYが設定されていません');
        results.customer = { success: false, error: 'メール送信サービス設定エラー' };
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