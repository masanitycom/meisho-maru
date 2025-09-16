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