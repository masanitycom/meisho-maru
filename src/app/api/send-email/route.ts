import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { to, subject, reservationData } = await request.json();
    
    // 予約データからメール本文を作成
    const emailContent = createReservationEmailContent(reservationData);
    
    // 実際のメール送信はここで行います
    // 現在は仮実装（コンソールログのみ）
    console.log('📧 予約確認メール送信:', {
      to,
      subject,
      content: emailContent
    });
    
    // 実装例：
    // const response = await sendEmailWithService(to, subject, emailContent);
    
    return NextResponse.json({ 
      success: true, 
      message: 'メールを送信しました',
      // 開発環境では実際の送信内容を返す
      emailPreview: process.env.NODE_ENV === 'development' ? emailContent : undefined
    });
    
  } catch (error) {
    console.error('メール送信エラー:', error);
    return NextResponse.json({ 
      error: 'メール送信に失敗しました' 
    }, { status: 500 });
  }
}

interface ReservationEmailData {
  name: string;
  date: string;
  trip_number: number;
  people_count: number;
  phone: string;
  email?: string;
  rod_rental: boolean;
  notes?: string;
}

function createReservationEmailContent(reservationData: ReservationEmailData) {
  const {
    name,
    date,
    trip_number,
    people_count,
    phone,
    email,
    rod_rental,
    notes
  } = reservationData;
  
  const tripTime = trip_number === 1 ? '17:30過ぎ〜23:30頃' : '24:00頃〜5:30頃';
  const basePrice = 11000 * people_count;
  const rodPrice = rod_rental ? 2000 * people_count : 0;
  const totalPrice = basePrice + rodPrice;
  
  return `
明勝丸をご利用いただき、ありがとうございます。
ご予約を確認いたしましたのでお知らせいたします。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【予約確認書】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

■お客様情報
お名前：${name} 様
電話番号：${phone}
メールアドレス：${email || 'なし'}

■ご予約内容
乗船日：${date}
便：${trip_number}便（${tripTime}）
人数：${people_count}名
竿レンタル：${rod_rental ? 'あり' : 'なし'}

■料金
乗船料：¥${basePrice.toLocaleString()} (¥11,000 × ${people_count}名)
${rod_rental ? `竿レンタル：¥${rodPrice.toLocaleString()} (¥2,000 × ${people_count}名)` : ''}
合計金額：¥${totalPrice.toLocaleString()}

${notes ? `■備考\n${notes}\n` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【出港場所・アクセス】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

鳥取県東伯郡琴浦町大字別所１１２８番地（赤碕港）

■お車でお越しの場合
山陰自動車道「琴浦船上山IC」から約15分

■電車でお越しの場合
JR山陰本線「赤碕駅」から徒歩約10分

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【重要事項・注意点】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

・天候により欠航となる場合があります
・前日の夕方に運航可否をご連絡いたします
・キャンセルは3日前までにご連絡ください
・当日の集合時間は出港時間の30分前です
・安全のため、救命胴衣の着用をお願いします

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【お問い合わせ】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

明勝丸
電話：${phone}（お客様の番号で折り返します）
※営業時間：9:00〜17:00

当日のご質問や緊急連絡は上記番号までお電話ください。

それでは、当日お会いできることを楽しみにしております。
良い釣果をお祈りしています！

明勝丸 船長・スタッフ一同
  `.trim();
}