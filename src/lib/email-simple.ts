// シンプルなメール送信実装（nodemailerなし）

interface EmailData {
  name: string;
  nameKana: string;
  date: string;
  tripNumber: number;
  peopleCount: number;
  rodRental: boolean;
  rodRentalCount: number;
  totalAmount: number;
  phone: string;
  email?: string;
  notes?: string;
}

// 予約確認メール（お客様向け）のHTML生成
export const createCustomerEmailHtml = (data: EmailData) => {
  const tripTime = data.tripNumber === 1
    ? '第1便（17:30過ぎ〜23:30頃）'
    : '第2便（24:00頃〜5:30頃）';

  const rodRentalText = data.rodRentalCount > 0
    ? `${data.rodRentalCount}本（¥2,000/本）`
    : 'なし';

  return `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>予約確認メール</title>
</head>
<body style="font-family: 'Noto Sans JP', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7;">
  <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #1e3a8a; margin: 0;">明勝丸</h1>
      <p style="color: #666; margin: 10px 0 0 0;">予約確認メール</p>
    </div>

    <div style="border-top: 2px solid #e5e5e5; padding-top: 20px;">
      <h2 style="color: #1e3a8a; font-size: 20px; margin-bottom: 20px;">ご予約ありがとうございます</h2>

      <p style="color: #333; line-height: 1.6;">
        ${data.name} 様<br><br>
        この度は明勝丸をご予約いただき、誠にありがとうございます。<br>
        下記の内容でご予約を承りました。
      </p>

      <div style="background-color: #f0f9ff; border-left: 4px solid #1e3a8a; padding: 20px; margin: 20px 0;">
        <h3 style="color: #1e3a8a; margin: 0 0 15px 0; font-size: 18px;">予約内容</h3>
        <table style="width: 100%; color: #333;">
          <tr>
            <td style="padding: 8px 0; width: 120px;"><strong>予約日：</strong></td>
            <td style="padding: 8px 0;">${data.date}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>便：</strong></td>
            <td style="padding: 8px 0;">${tripTime}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>人数：</strong></td>
            <td style="padding: 8px 0;">${data.peopleCount}名</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>竿レンタル：</strong></td>
            <td style="padding: 8px 0;">${rodRentalText}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-top: 1px solid #ddd; padding-top: 15px;"><strong>合計金額：</strong></td>
            <td style="padding: 8px 0; border-top: 1px solid #ddd; padding-top: 15px; font-size: 20px; color: #1e3a8a;"><strong>¥${data.totalAmount.toLocaleString()}</strong></td>
          </tr>
        </table>
      </div>

      <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0;">
        <h3 style="color: #dc2626; margin: 0 0 15px 0; font-size: 18px;">重要なお知らせ</h3>
        <ul style="color: #333; line-height: 1.8; margin: 0; padding-left: 20px;">
          <li>出港時間の15分前までにお越しください</li>
          <li>天候により欠航の場合は前日夕方までにご連絡いたします</li>
          <li>キャンセルは3日前までにご連絡ください</li>
          <li>船にトイレはございません</li>
          <li>氷とゴミ袋はご持参ください</li>
        </ul>
      </div>

      <div style="background-color: #f7f7f7; padding: 20px; margin: 20px 0; border-radius: 5px;">
        <h3 style="color: #1e3a8a; margin: 0 0 15px 0; font-size: 18px;">集合場所</h3>
        <p style="color: #333; line-height: 1.6; margin: 0;">
          鳥取県東伯郡琴浦町大字別所１１２８番地<br>
          赤碕港（鳥取林養魚場の建物裏手）
        </p>
      </div>

      <div style="background-color: #e8f5e8; border-left: 4px solid #28a745; padding: 20px; margin: 20px 0; border-radius: 5px;">
        <h3 style="color: #28a745; margin: 0 0 15px 0; font-size: 18px;">📱 LINE公式アカウントにご登録ください！</h3>
        <p style="color: #333; line-height: 1.8; margin: 0;">
          <strong>重要な連絡をお届けします：</strong><br>
          ・当日の出航判断等<br><br>

          <strong>👇 今すぐLINE登録！</strong><br>
          <a href="https://lin.ee/mMWHmB0" style="display: inline-block; background-color: #00c300; color: white; padding: 12px 20px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 10px 0;">
            明勝丸 LINE公式アカウント
          </a><br>
          <span style="color: #666; font-size: 14px;">または「@707ejlid」で検索</span>
        </p>
      </div>

      <div style="background-color: #fce4ec; border-left: 4px solid #e91e63; padding: 20px; margin: 20px 0; border-radius: 5px;">
        <h3 style="color: #e91e63; margin: 0 0 15px 0; font-size: 18px;">📸 インスタグラムもフォロー！</h3>
        <p style="color: #333; line-height: 1.8; margin: 0;">
          最新の釣果写真や海の様子をチェック！<br><br>
          <a href="https://www.instagram.com/meisho_maru/" style="display: inline-block; background-color: #e91e63; color: white; padding: 12px 20px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 10px 0;">
            📷 明勝丸インスタグラム
          </a>
        </p>
      </div>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e5e5;">
        <h3 style="color: #1e3a8a; margin: 0 0 15px 0; font-size: 18px;">お問い合わせ</h3>
        <p style="color: #333; line-height: 1.8; margin: 0;">
          ご不明な点がございましたら、お気軽にお問い合わせください。<br><br>
          <strong>電話：</strong> 090-4695-3087<br>
          <strong>メール：</strong> ikameishomaru@gmail.com<br>
          <strong>LINE：</strong> @707ejlid（推奨）<br>
          <strong>Instagram：</strong> @meisho_maru
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

// 管理者通知メールのHTML生成
export const createAdminEmailHtml = (data: EmailData) => {
  const tripTime = data.tripNumber === 1
    ? '第1便（17:30〜23:30）'
    : '第2便（24:00〜5:30）';

  return `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
</head>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #fff3cd; border: 2px solid #ffc107; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
    <h2 style="margin: 0; color: #856404;">【新規予約】Webサイトから予約が入りました</h2>
  </div>

  <div style="background-color: white; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr style="background-color: #f8f9fa;">
        <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>予約日時</strong></td>
        <td style="padding: 10px; border: 1px solid #dee2e6;">${data.date} ${tripTime}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>お名前</strong></td>
        <td style="padding: 10px; border: 1px solid #dee2e6;">${data.name}（${data.nameKana}）</td>
      </tr>
      <tr style="background-color: #f8f9fa;">
        <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>人数</strong></td>
        <td style="padding: 10px; border: 1px solid #dee2e6;">${data.peopleCount}名</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>電話番号</strong></td>
        <td style="padding: 10px; border: 1px solid #dee2e6;">${data.phone}</td>
      </tr>
      <tr style="background-color: #f8f9fa;">
        <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>メール</strong></td>
        <td style="padding: 10px; border: 1px solid #dee2e6;">${data.email || '未登録'}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>竿レンタル</strong></td>
        <td style="padding: 10px; border: 1px solid #dee2e6;">${data.rodRentalCount > 0 ? `${data.rodRentalCount}本` : 'なし'}</td>
      </tr>
      <tr style="background-color: #f8f9fa;">
        <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>合計金額</strong></td>
        <td style="padding: 10px; border: 1px solid #dee2e6; font-size: 18px; color: #dc3545;">
          <strong>¥${data.totalAmount.toLocaleString()}</strong>
        </td>
      </tr>
      ${data.notes ? `
      <tr>
        <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>備考</strong></td>
        <td style="padding: 10px; border: 1px solid #dee2e6;">${data.notes}</td>
      </tr>
      ` : ''}
    </table>
  </div>

  <div style="margin-top: 20px; padding: 15px; background-color: #e7f3ff; border-left: 4px solid #0066cc;">
    <p style="margin: 0; color: #333;">
      予約システムから自動送信されたメールです。<br>
      お客様には確認メールが自動送信されています。
    </p>
  </div>
</body>
</html>
  `;
};