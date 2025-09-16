# Vercel環境変数設定トラブルシューティング

## 現在の状況
- ✅ ローカル環境: RESEND_API_KEY設定済み
- ❌ Vercel本番環境: RESEND_API_KEY未設定（`hasResendKey: false`）

## 詳細な設定手順

### 1. Vercelダッシュボードでの設定
1. **https://vercel.com/dashboard** にログイン
2. **meisho-maru** プロジェクトをクリック
3. 上部の **「Settings」** タブをクリック
4. 左メニューから **「Environment Variables」** を選択

### 2. 環境変数の追加
1. **「Add New」** ボタンをクリック
2. 以下を正確に入力：
   ```
   Name: RESEND_API_KEY
   Value: re_TxS9fd2C_GQj3hsJzvJzsjdKa6ZkyTirn
   ```
3. **Environments**:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
   **すべてにチェックを入れる**
4. **「Save」** をクリック

### 3. 手動再デプロイ（重要）
環境変数追加後、手動で再デプロイが必要な場合があります：

1. **「Deployments」** タブをクリック
2. 最新のデプロイメントの **「...」** メニューをクリック
3. **「Redeploy」** を選択
4. **「Redeploy」** ボタンをクリックして確認

### 4. 設定確認
デプロイ完了後（2-3分）、以下でテスト：
```bash
curl https://kotourameishomaru.com/api/debug-env
```

**成功例：**
```json
{
  "hasResendKey": true,
  "resendKeyPrefix": "re_TxS9f...",
  "hasGmailUser": true,
  "hasGmailPassword": true
}
```

### 5. メール送信テスト
環境変数設定後：
```bash
curl https://kotourameishomaru.com/api/test-email
```

**成功例：**
```json
{
  "success": true,
  "message": "Resendメール送信テスト成功"
}
```

## よくある問題
- **環境変数名の誤り**: `RESEND_API_KEY`（アンダースコア注意）
- **値の誤り**: `re_TxS9fd2C_GQj3hsJzvJzsjdKa6ZkyTirn`（スペースなし）
- **Environments選択漏れ**: Production, Preview, Development全てにチェック
- **再デプロイ未実行**: 環境変数追加後の手動再デプロイが必要

## 緊急対応
もし設定がうまくいかない場合、一時的にGmailを無効化することも可能です。その場合は予約データは正常に保存され、メール送信のみスキップされます。