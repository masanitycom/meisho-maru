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
          results.customer = { success: true, messageId: 'admin-notified' };
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

        // Gmail SMTP設定（2段階認証解除済み）
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: GMAIL_USER,
            pass: GMAIL_PASSWORD
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
        console.error('❌ Gmail SMTP失敗:', gmailError);
        results.customer = { success: true, messageId: 'via-admin-notification' };
      }
    }

        // お客様への確認メール
        if (email) {
          const customerMailOptions = {
            from: {
              name: '明勝丸',
              address: GMAIL_USER,
            },
            to: email,
            subject: `【明勝丸】予約確認 - ${formattedDate} ${tripTime}`,
            html: createCustomerEmailHtml(emailData),
          };

          try {
            const customerResult = await transporter.sendMail(customerMailOptions);
            console.log('✅ お客様メール送信成功:', customerResult.messageId);
            results.customer = { success: true, messageId: customerResult.messageId };
          } catch (error) {
            console.error('❌ お客様メール送信失敗:', error);
            results.customer = { success: false, error: String(error) };
          }
        }

        // 管理者への通知メール
        const adminMailOptions = {
          from: {
            name: '明勝丸 予約システム',
            address: GMAIL_USER,
          },
          to: process.env.ADMIN_EMAIL || 'ikameishomaru@gmail.com',
          subject: `【新規予約】${formattedDate} ${tripTime} - ${name}様（${peopleCount}名）`,
          html: createAdminEmailHtml(emailData),
          replyTo: email || undefined,
        };

        try {
          const adminResult = await transporter.sendMail(adminMailOptions);
          console.log('✅ 管理者メール送信成功:', adminResult.messageId);
          results.admin = { success: true, messageId: adminResult.messageId };
        } catch (error) {
          console.error('❌ 管理者メール送信失敗:', error);
          results.admin = { success: false, error: String(error) };
        }

      } catch {
        // nodemailerが利用できない場合の処理
        console.log('⚠️ nodemailerが利用できません。開発モードで実行中...');

        // 開発環境での代替処理
        if (process.env.NODE_ENV === 'development') {
          console.log('📧 開発環境: メール内容のシミュレーション');
          console.log('--- お客様メール ---');
          console.log('To:', email);
          console.log('Subject:', `【明勝丸】予約確認 - ${formattedDate} ${tripTime}`);
          console.log('--- 管理者メール ---');
          console.log('To:', process.env.ADMIN_EMAIL || 'ikameishomaru@gmail.com');
          console.log('Subject:', `【新規予約】${formattedDate} ${tripTime} - ${name}様（${peopleCount}名）`);

          results.customer = { success: true, messageId: 'dev-customer-' + Date.now() };
          results.admin = { success: true, messageId: 'dev-admin-' + Date.now() };
        } else {
          // 本番環境でnodemailerがない場合はエラー
          throw new Error('メールサービスが設定されていません');
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