# Gmail認証エラー完全解決手順

## 現在の問題
- 535-5.7.8 認証エラーが発生
- アプリパスワード「dsuedopwrihyokrt」が無効
- 休業入力機能も動作しない

## 解決手順

### 1. 新しいGoogleアプリパスワード作成
1. https://myaccount.google.com/security にアクセス
2. 「2段階認証プロセス」を確認（有効になっている必要があります）
3. 「アプリパスワード」→「アプリを選択」→「その他（カスタム名）」
4. 名前: 「明勝丸予約システム2025」
5. 16文字のパスワードが表示される → **必ずスペースを削除してコピー**

### 2. 環境変数更新
#### ローカル (.env.local)
```
GMAIL_APP_PASSWORD=新しい16文字のパスワード（スペースなし）
```

#### Vercel
1. https://vercel.com/dashboard
2. meisho-maruプロジェクト → Settings → Environment Variables
3. GMAIL_APP_PASSWORD を更新
4. Production, Preview, Development すべてにチェック
5. Save

### 3. 古いアプリパスワード削除
Googleセキュリティページで古い「明勝丸」パスワードを削除

### 4. テスト
```bash
curl https://kotourameishomaru.com/api/test-email
```

## 休業入力問題の確認
Supabaseの406エラーも関連している可能性があります。
- RLSポリシーの確認
- HTTPヘッダーの確認