// SendGrid版のメール送信（Gmailアプリパスワードが使えない場合の代替案）

// 使用方法:
// 1. SendGridアカウント作成（無料プラン：月100通）
// 2. API Key取得
// 3. ドメイン認証（ikameishomaru@gmail.com のような独自ドメインが必要）
// 4. 環境変数にSENDGRID_API_KEYを設定

// npm install @sendgrid/mail

import sgMail from '@sendgrid/mail';

// SendGrid設定
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

// 予約確認メールの送信（SendGrid版）
export const sendReservationEmailSendGrid = async (
  to: string,
  data: {
    name: string;
    date: string;
    tripNumber: number;
    peopleCount: number;
    rodRental: boolean;
    totalAmount: number;
    phone: string;
  }
) => {
  const tripTime = data.tripNumber === 1 
    ? '第1便（17:30過ぎ〜23:30頃）' 
    : '第2便（24:00頃〜5:30頃）';
  
  const msg = {
    to,
    from: {
      email: 'noreply@yourdomain.com', // 認証済みドメインのメール
      name: '明勝丸'
    },
    replyTo: 'ikameishomaru@gmail.com', // 返信先をGmailに設定
    subject: `【明勝丸】予約確認 - ${data.date} ${data.tripNumber === 1 ? '第1便' : '第2便'}`,
    html: `
      <h1>明勝丸 予約確認</h1>
      <p>${data.name} 様</p>
      <p>ご予約ありがとうございます。</p>
      <ul>
        <li>予約日: ${data.date}</li>
        <li>便: ${tripTime}</li>
        <li>人数: ${data.peopleCount}名</li>
        <li>合計金額: ¥${data.totalAmount.toLocaleString()}</li>
      </ul>
      <p>お問い合わせ: ikameishomaru@gmail.com</p>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log('SendGrid メール送信成功');
    return { success: true };
  } catch (error) {
    console.error('SendGrid メール送信エラー:', error);
    return { success: false, error };
  }
};

// 注意事項:
// - SendGridは独自ドメインが必要（gmail.comは使用不可）
// - 無料プランは月100通まで
// - ドメイン認証が必要（DNS設定）