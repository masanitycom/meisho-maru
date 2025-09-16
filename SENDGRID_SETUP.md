# SendGrid セットアップ手順

## 1. SendGridアカウント作成
1. https://sendgrid.com/ にアクセス
2. 「Start for Free」をクリック
3. メールアドレス、パスワードを入力（ikameishomaru@gmail.comを使用可能）
4. アカウント認証を完了

## 2. Sender Authentication（重要）
SendGridから`ikameishomaru@gmail.com`で送信するには認証が必要：

### オプション1: Single Sender Verification（簡単・推奨）
1. SendGrid管理画面 → Settings → Sender Authentication
2. 「Single Sender Verification」
3. 送信者情報を入力：
   - From Name: 明勝丸
   - From Email: ikameishomaru@gmail.com
   - Reply To: ikameishomaru@gmail.com
   - Address: 鳥取県東伯郡琴浦町大字別所１１２８番地
4. ikameishomaru@gmail.comに届く認証メールをクリック

### オプション2: Domain Authentication（本格運用向け）
1. SendGrid管理画面 → Settings → Sender Authentication
2. 「Domain Authentication」
3. kotourameishomaru.comのDNS設定が必要

## 3. APIキーの生成
1. SendGrid管理画面 → Settings → API Keys
2. 「Create API Key」
3. Name: 「明勝丸予約システム」
4. Permissions: 「Full Access」（または「Mail Send」のみ）
5. 生成されたAPIキーをコピー（SG.xxxxx形式）

## 4. 環境変数設定

### ローカル (.env.local)
```
SENDGRID_API_KEY=SG.実際のAPIキー
```

### Vercel
1. https://vercel.com/dashboard
2. meisho-maruプロジェクト → Settings → Environment Variables
3. 新規追加：
   - Name: `SENDGRID_API_KEY`
   - Value: `SG.実際のAPIキー`
   - Environments: Production, Preview, Development

## 5. テスト
```bash
curl https://kotourameishomaru.com/api/test-email
```

## 特徴
- ✅ Gmailアドレス（ikameishomaru@gmail.com）から送信可能
- ✅ 月100通まで無料
- ✅ 高い配信率（迷惑メールに入りにくい）
- ✅ 認証なしでも動作（Single Sender Verification後）

## 注意事項
- Single Sender Verificationを必ず完了すること
- APIキーは秘密情報として管理
- 無料プランは月100通制限（通常の運用には十分）