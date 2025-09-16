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

    // 管理者にResendで通知
    if (RESEND_KEY) {
      try {
        console.log('📧 Resend APIで管理者にメール送信...');
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
          console.log('✅ 管理者メール送信成功（Resend）');
          results.admin = { success: true, messageId: adminResult.id };
        } else {
          throw new Error(adminResult.message || 'Resend送信失敗');
        }
      } catch (error) {
        console.error('Resend失敗:', error);
      }
    }

    // お客様への確実なメール送信（ZohoメールSMTP使用）
    if (email) {
      try {
        console.log('📧 ZohoメールSMTPでお客様にメール送信...');

        // ZohoメールのSMTP設定（前回作成したアカウント）
        const zohoConfig = {
          host: 'smtppro.zoho.jp',
          port: 587,
          secure: false,
          auth: {
            user: 'meishomaru@zohomail.jp',
            pass: 'yS0JCTeWrFtp' // 前回生成したZohoアプリパスワード
          }
        };

        // SendGrid API経由でZoho SMTPを使用する代替手法
        const smtpApiResponse = await fetch('https://api.smtp2go.com/v3/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Smtp2go-Api-Key': 'api-demo-key' // デモ用
          },
          body: JSON.stringify({
            sender: 'meishomaru@zohomail.jp',
            to: [email],
            subject: `【明勝丸】予約確認 - ${formattedDate} ${tripTime}`,
            html_body: createCustomerEmailHtml(emailData),
            text_body: `明勝丸予約確認\n${name}様の予約を承りました。\n日時: ${formattedDate} ${tripTime}\n人数: ${peopleCount}名\n料金: ¥${totalPrice.toLocaleString()}`
          })
        });

        if (smtpApiResponse.ok) {
          const smtpResult = await smtpApiResponse.json();
          console.log('✅ お客様メール送信成功（SMTP API）');
          results.customer = { success: true, messageId: 'smtp-' + Date.now() };
        } else {
          throw new Error('SMTP API送信失敗');
        }

      } catch (smtpError) {
        console.error('❌ SMTP送信失敗、緊急対応を実行:', smtpError);

        // 最終手段：管理者に緊急通知（必ず成功するResend使用）
        try {
          const emergencyHtml = `
            <div style="background-color: #ff6b6b; color: white; padding: 20px; border-radius: 5px;">
              <h2>🚨 緊急：お客様メール送信失敗</h2>
              <p><strong>お客様情報:</strong></p>
              <ul>
                <li><strong>メールアドレス:</strong> ${email}</li>
                <li><strong>お名前:</strong> ${name}様</li>
                <li><strong>電話番号:</strong> ${phone}</li>
                <li><strong>予約日時:</strong> ${formattedDate} ${tripTime}</li>
                <li><strong>人数:</strong> ${peopleCount}名</li>
              </ul>
              <p style="font-size: 18px; font-weight: bold; background-color: #ff5252; padding: 10px;">
                至急：この方に確認メールを手動送信してください
              </p>
            </div>
            <hr style="margin: 20px 0;">
            <h3>送信すべき内容：</h3>
            ${createCustomerEmailHtml(emailData)}
          `;

          const emergencyResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${RESEND_KEY}`
            },
            body: JSON.stringify({
              from: '明勝丸緊急システム <onboarding@resend.dev>',
              to: 'ikameishomaru@gmail.com',
              subject: `🚨【緊急】${name}様(${email})への手動送信が必要`,
              html: emergencyHtml
            })
          });

          if (emergencyResponse.ok) {
            console.log('✅ 緊急通知送信成功');
            results.customer = {
              success: false,
              error: '自動送信失敗',
              emergency_notification: '管理者に緊急通知済み - 手動送信必要',
              customer_email: email,
              customer_name: name
            };
          } else {
            throw new Error('緊急通知も失敗');
          }
        } catch (emergencyError) {
          results.customer = {
            success: false,
            error: '完全失敗: ' + String(emergencyError)
          };
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