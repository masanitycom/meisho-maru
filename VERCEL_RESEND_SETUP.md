# Vercel環境変数設定（Resend）

## 手順
1. **Vercelダッシュボード**にアクセス
   - https://vercel.com/dashboard

2. **プロジェクト選択**
   - 「meisho-maru」プロジェクトをクリック

3. **設定画面**
   - 「Settings」タブをクリック
   - 左メニューから「Environment Variables」を選択

4. **新しい環境変数を追加**
   - 「Add New」ボタンをクリック
   - 以下を入力：
     ```
     Name: RESEND_API_KEY
     Value: re_TxS9fd2C_GQj3hsJzvJzsjdKa6ZkyTirn
     ```
   - Environments: 「Production」「Preview」「Development」すべてにチェック
   - 「Save」をクリック

5. **再デプロイ（自動）**
   - 環境変数追加後、自動的に再デプロイが開始されます
   - または「Deployments」→最新デプロイの「...」→「Redeploy」

## テスト方法
設定完了後、以下でテスト：
```bash
curl https://kotourameishomaru.com/api/test-email
```

成功すれば：
```json
{
  "success": true,
  "message": "メール送信テスト成功",
  "details": {
    "messageId": "xxxxx",
    "from": "ikameishomaru@gmail.com",
    "to": "ikameishomaru@gmail.com"
  }
}
```

## 予約フォームテスト
https://kotourameishomaru.com/ から実際に予約して、メールが届くか確認してください。

## 注意
- APIキーは公開しないよう注意
- ローカル環境（.env.local）は既に設定済み
- Vercel環境変数設定が完了すれば、メール送信が動作開始