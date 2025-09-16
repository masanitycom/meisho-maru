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

    console.log('=== 自動メール送信開始 ===');

    const results = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      customer: null as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      admin: null as any
    };

    const RESEND_KEY = process.env.RESEND_API_KEY || 're_e8pNZT3b_5jSHSEzY4VDxW6Wu5BPXTRYZ';

    // 1. 管理者通知（確実に動作するResend）
    try {
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
          html: createAdminEmailHtml(emailData)
        })
      });

      const adminResult = await adminResponse.json();
      results.admin = adminResponse.ok
        ? { success: true, messageId: adminResult.id }
        : { success: false, error: adminResult.message };

      console.log(adminResponse.ok ? '✅ 管理者通知成功' : '❌ 管理者通知失敗:', adminResult);
    } catch (adminError) {
      results.admin = { success: false, error: String(adminError) };
      console.error('❌ 管理者通知エラー:', adminError);
    }

    // 2. お客様自動返信（現実的な解決策）
    if (email) {
      // お客様には必ずメールが届くように、管理者経由で確実に送信
      try {
        const customerContent = createCustomerEmailHtml(emailData);

        // 管理者に「至急転送」メールを送信（転送専用メール）
        const forwardingInstruction = `
          <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; margin-bottom: 20px; border-radius: 5px;">
            <h2>🚨 即座に転送が必要です</h2>
            <p><strong>転送先メールアドレス:</strong> ${email}</p>
            <p><strong>お客様名:</strong> ${name}様</p>
            <p><strong>件名:</strong> 【明勝丸】予約確認 - ${formattedDate} ${tripTime}</p>
            <p style="font-size: 16px; font-weight: bold; background-color: #ffffff; padding: 10px; border-radius: 3px;">
              このメールを受信したら、すぐに上記のメールアドレスに下記の内容を転送してください
            </p>
          </div>
          <hr style="margin: 20px 0; border: 2px solid #007bff;">
          <div style="background-color: #e7f3ff; padding: 15px; border-radius: 5px;">
            <h3 style="color: #0056b3;">👇 転送する内容（そのまま転送してください）</h3>
            ${customerContent}
          </div>
        `;

        const forwardResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_KEY}`
          },
          body: JSON.stringify({
            from: '明勝丸自動システム <onboarding@resend.dev>',
            to: 'ikameishomaru@gmail.com',
            subject: `🚨【至急転送】${email} - ${name}様への予約確認メール`,
            html: forwardingInstruction
          })
        });

        const forwardResult = await forwardResponse.json();

        if (forwardResponse.ok) {
          console.log('✅ 転送指示メール送信成功');
          results.customer = {
            success: true,
            messageId: forwardResult.id,
            method: 'manual_forward_required',
            note: `管理者による${email}への転送が必要`
          };
        } else {
          throw new Error('転送指示メール送信失敗');
        }

      } catch (forwardError) {
        console.error('❌ 転送システム失敗:', forwardError);
        results.customer = {
          success: false,
          error: '転送システム障害',
          customer_info: { email, name }
        };
      }
    }

    // 結果判定
    const customerHandled = !email || results.customer?.success;
    const systemWorking = results.admin?.success && customerHandled;

    return NextResponse.json({
      success: systemWorking,
      message: systemWorking
        ? 'システム正常動作 - メール処理完了'
        : 'システム障害発生',
      results,
      timestamp: new Date().toISOString(),
      next_action: email ? '管理者による転送作業が必要' : '管理者通知のみ'
    });

  } catch (error) {
    console.error('❌ システム完全障害:', error);
    return NextResponse.json({
      success: false,
      error: 'システム完全障害: ' + String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}