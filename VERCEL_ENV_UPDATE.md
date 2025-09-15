# Vercel環境変数更新手順

## 問題
Gmail 535認証エラーが発生しています。新しいアプリパスワードがVercelに反映されていません。

## 解決手順

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com/dashboard にアクセス
   - プロジェクト「meisho-maru」を選択

2. **環境変数の更新**
   - 「Settings」→「Environment Variables」
   - 以下の変数を更新：

   ```
   GMAIL_APP_PASSWORD = dsuedopwrihyokrt
   ```

3. **デプロイメントの再実行**
   - 環境変数更新後、自動再デプロイされない場合
   - 「Deployments」→最新デプロイの「...」→「Redeploy」

## 現在の設定値
- GMAIL_USER: ikameishomaru@gmail.com
- GMAIL_APP_PASSWORD: dsuedopwrihyokrt （スペースなし）
- ADMIN_EMAIL: ikameishomaru@gmail.com

## 確認方法
更新後、以下のURLでテスト：
https://kotourameishomaru.com/api/test-email

成功すれば以下のような応答が返されます：
```json
{
  "success": true,
  "message": "メール送信テスト成功",
  "details": {
    "messageId": "...",
    "from": "ikameishomaru@gmail.com",
    "to": "ikameishomaru@gmail.com"
  }
}
```