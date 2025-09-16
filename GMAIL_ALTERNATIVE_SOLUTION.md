# Gmail認証問題の代替解決策

## 問題
Googleアプリパスワードを設定してもGmail SMTPで535認証エラーが継続的に発生

## 原因の可能性
1. Googleアカウントのセキュリティ設定変更
2. アプリパスワードの不正な形式
3. 2段階認証の設定問題
4. Vercel環境での環境変数の読み込み問題

## 推奨される解決策

### オプション1: Googleアカウントの完全再設定
1. https://myaccount.google.com/security
2. 「2段階認証プロセス」を一度無効化→再度有効化
3. すべての既存アプリパスワードを削除
4. 新しいアプリパスワードを生成
5. パスワードをコピー時にスペースを含めない

### オプション2: SendGrid（無料プラン）への移行
1. https://sendgrid.com/ でアカウント作成
2. APIキーを生成
3. 環境変数に追加：
   ```
   SENDGRID_API_KEY=SG.xxxxx
   ```

### オプション3: Resend（推奨）
1. https://resend.com/ でアカウント作成（簡単）
2. APIキーを生成
3. 環境変数に追加：
   ```
   RESEND_API_KEY=re_xxxxx
   ```

### オプション4: EmailJS（フロントエンドから直接送信）
1. https://www.emailjs.com/ でアカウント作成
2. サービスIDとテンプレートIDを取得
3. クライアントサイドから直接送信

## 現在の設定確認事項
- GMAIL_USER: ikameishomaru@gmail.com
- GMAIL_APP_PASSWORD: 設定済み（16文字）
- Vercel環境変数: 設定済み

## デバッグ手順
1. ローカルでテスト：
   ```bash
   curl http://localhost:3000/api/test-email
   ```

2. 本番でテスト：
   ```bash
   curl https://kotourameishomaru.com/api/test-email
   ```

## 緊急対応
予約データは正常に保存されているため、メール送信は後回しにして、管理画面から予約確認を行うことも可能です。