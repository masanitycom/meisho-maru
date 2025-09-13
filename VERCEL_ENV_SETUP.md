# Vercel環境変数設定手順

## 重要：以下の環境変数をVercelに設定する必要があります

### 設定方法：

1. Vercelダッシュボード（https://vercel.com）にログイン
2. プロジェクト「meisho-maru」を選択
3. 「Settings」タブをクリック
4. 左メニューから「Environment Variables」を選択
5. 以下の環境変数を追加：

### 必要な環境変数：

```
NEXT_PUBLIC_SUPABASE_URL=https://hgwpervzpyouhllisnrw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhnd3BlcnZ6cHlvdWhsbGlzbnJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MzI5NTgsImV4cCI6MjA3MDMwODk1OH0.jI-VldaYS7dON0x1XwFj0IlxY96MRorjA9Ihs6wxaJY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhnd3BlcnZ6cHlvdWhsbGlzbnJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDczMjk1OCwiZXhwIjoyMDcwMzA4OTU4fQ.jaWAVIH9X9JktGv8qP5UQ4xxLQy7svAzRgEHYyRguKM
GMAIL_USER=ikameishomaru@gmail.com
GMAIL_APP_PASSWORD=sjvn tlgt aalm xmzr
ADMIN_EMAIL=ikameishomaru@gmail.com
```

### 設定時の注意：

- 各環境変数は「Production」「Preview」「Development」すべてにチェックを入れる
- 設定後、「Save」ボタンをクリック
- 保存後、次のデプロイから環境変数が有効になります

### 確認方法：

1. 環境変数を設定後、再デプロイを実行
2. ブラウザの開発者ツールでコンソールを確認
3. 「Supabase client initialized successfully」が表示されれば成功

### トラブルシューティング：

- 環境変数が反映されない場合は、Vercelで「Redeploy」を実行
- キャッシュをクリアしてからアクセス（Ctrl+Shift+R）