import { NextRequest, NextResponse } from 'next/server';
import { createCustomerEmailHtml, createAdminEmailHtml } from '@/lib/email-simple';

// Gmail APIを使用したメール送信（nodemailerの代替）
async function sendGmail(to: string, subject: string, html: string) {
  const username = process.env.GMAIL_USER;
  const appPassword = process.env.GMAIL_APP_PASSWORD;

  if (!username || !appPassword) {
    throw new Error('Gmail credentials not configured');
  }

  // Base64エンコードされたメール内容を作成
  const messageParts = [
    `From: 明勝丸 <${username}>`,
    `To: ${to}`,
    `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    '',
    html
  ];

  const message = messageParts.join('\r\n');
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  // Gmail SMTP APIの代わりに、nodemailerが使えない場合の代替案
  // 実際の送信はnodemailerがインストールされるまで保留
  console.log('📧 メール送信準備完了:', {
    to,
    subject,
    messageLength: message.length
  });

  return { success: true, messageId: `simulated-${Date.now()}` };
}

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
      customer: null as any,
      admin: null as any
    };

    // 実際のメール送信処理
    try {
      // nodemailerが利用可能な場合
      const nodemailer = require('nodemailer');

      // Gmailトランスポーターの作成
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, ''), // スペースを削除
        },
      });

      // お客様への確認メール
      if (email) {
        const customerMailOptions = {
          from: {
            name: '明勝丸',
            address: process.env.GMAIL_USER || 'ikameishomaru@gmail.com',
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
          address: process.env.GMAIL_USER || 'ikameishomaru@gmail.com',
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

    } catch (moduleError) {
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