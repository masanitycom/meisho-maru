import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== メールテストAPI ===');
    console.log('環境変数チェック:');
    console.log('GMAIL_USER:', process.env.GMAIL_USER ? '設定済み' : '未設定');
    console.log('GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? '設定済み' : '未設定');
    console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL ? '設定済み' : '未設定');

    // nodemailerのテスト
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const nodemailer = require('nodemailer');
      console.log('✅ nodemailer モジュール読み込み成功');

      // テストトランスポーター作成
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, ''),
        },
      });

      // 設定の検証
      await transporter.verify();
      console.log('✅ Gmail SMTP接続成功');

      // テストメール送信
      const testResult = await transporter.sendMail({
        from: {
          name: '明勝丸テスト',
          address: process.env.GMAIL_USER || 'ikameishomaru@gmail.com',
        },
        to: process.env.ADMIN_EMAIL || 'ikameishomaru@gmail.com',
        subject: '【テスト】メール送信機能確認',
        html: `
          <h2>メール送信テスト</h2>
          <p>このメールは明勝丸予約システムのテストメールです。</p>
          <p>送信日時: ${new Date().toLocaleString('ja-JP')}</p>
          <hr>
          <p>環境情報:</p>
          <ul>
            <li>送信元: ${process.env.GMAIL_USER}</li>
            <li>送信先: ${process.env.ADMIN_EMAIL}</li>
            <li>Node環境: ${process.env.NODE_ENV || 'production'}</li>
          </ul>
        `,
      });

      console.log('✅ テストメール送信成功:', testResult.messageId);

      return NextResponse.json({
        success: true,
        message: 'メール送信テスト成功',
        details: {
          messageId: testResult.messageId,
          from: process.env.GMAIL_USER,
          to: process.env.ADMIN_EMAIL,
          timestamp: new Date().toISOString()
        }
      });

    } catch (emailError) {
      console.error('❌ メール送信エラー:', emailError);
      return NextResponse.json({
        success: false,
        message: 'メール送信失敗',
        error: String(emailError),
        details: {
          errorMessage: emailError instanceof Error ? emailError.message : 'Unknown error',
          errorStack: emailError instanceof Error ? emailError.stack : undefined
        }
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ APIエラー:', error);
    return NextResponse.json({
      success: false,
      message: 'APIエラー',
      error: String(error)
    }, { status: 500 });
  }
}