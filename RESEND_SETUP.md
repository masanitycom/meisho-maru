# Resend セットアップ手順（推奨）

## なぜResend？
- ✅ **個人・スタートアップ向け**（SendGridは法人のみ）
- ✅ **Gmailアドレス使用可能**
- ✅ **月3,000通まで無料**
- ✅ **簡単セットアップ**
- ✅ **reply-to設定**でikameishomaru@gmail.comに返信可能

## 1. Resendアカウント作成
1. https://resend.com/ にアクセス
2. 「Start Building」または「Sign Up」
3. メールアドレスとパスワードを入力（任意のアドレスでOK）
4. メール認証を完了

## 2. APIキーの生成
1. Resend管理画面 → API Keys
2. 「Create API Key」
3. Name: 「明勝丸予約システム」
4. Permission: 「Sending access」
5. 生成されたAPIキーをコピー（`re_xxxxx`形式）

## 3. 環境変数設定

### ローカル (.env.local)
```
RESEND_API_KEY=re_実際のAPIキー
```

### Vercel
1. https://vercel.com/dashboard
2. meisho-maruプロジェクト → Settings → Environment Variables
3. 新規追加：
   - Name: `RESEND_API_KEY`
   - Value: `re_実際のAPIキー`
   - Environments: Production, Preview, Development

## 4. 送信設定
- **From**: onboarding@resend.dev（Resendのデフォルトドメイン）
- **Reply-To**: ikameishomaru@gmail.com（返信先）
- **To（お客様）**: 予約フォームで入力されたメールアドレス
- **To（管理者）**: ikameishomaru@gmail.com

## 5. テスト
環境変数設定後：
```bash
curl https://kotourameishomaru.com/api/test-email
```

## 6. 必要に応じてドメイン設定（後日）
将来的にkotourameishomaru.comから送信したい場合：
1. Resend管理画面 → Domains
2. kotourameishomaru.comを追加
3. DNS設定を追加（MX、TXT、CNAMEレコード）

## 特徴
- **即座に使用開始可能**（ドメイン設定不要）
- **月3,000通無料**（日々の予約には十分）
- **返信先自動設定**（お客様からの返信がGmailに届く）
- **高い配信率**
- **ログ・分析機能**付き

## 注意
- APIキーは秘密情報として管理
- 送信者名は「明勝丸」として表示される
- 実際の送信ドメインはresend.devだが、reply-toでGmailに返信される