# 明勝丸 (Meisho-maru) 釣り船ウェブサイト

## プロジェクト概要
鳥取県琴浦町赤碕港を拠点とする白いか釣り専門の遊漁船「明勝丸」のウェブサイト。

## 技術スタック
- **フレームワーク**: Next.js 15.4.6 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v3.4.17
- **バックエンド**: Supabase (PostgreSQL, RLS, Authentication)
- **バリデーション**: React Hook Form + Zod
- **デプロイ**: Vercel
- **バージョン管理**: Git/GitHub

## 主要機能
1. **レスポンシブデザイン**: モバイル・デスクトップ対応
2. **予約管理システム**: Supabaseベースの予約・顧客管理
3. **運航スケジュール**: カレンダー表示（月間・週間ビュー切り替え）
4. **残席表示**: リアルタイム座席状況（色分け表示）
5. **Google Maps統合**: アクセス情報の地図表示
6. **和風デザイン**: 日本語フォント・グラデーション

## 運航情報
- **出港地**: 鳥取県東伯郡琴浦町大字別所１１２８番地（赤碕港）
- **料金**: ¥11,000/人、竿レンタル¥2,000/人
- **運航時間**:
  - 1便: 17:30過ぎ～23:30頃
  - 2便: 24:00頃～5:30頃

## データベース構造
### 主要テーブル
- `admin_users`: 管理者情報
- `customers`: 顧客情報
- `schedules`: 運航スケジュール
- `reservations`: 予約情報
- `fishing_results`: 釣果記録

### RLS (Row Level Security)
- スケジュール: 公開読み取り可能
- その他: 管理者のみアクセス可能

## 開発コマンド
```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 型チェック
npm run type-check

# リント
npm run lint
```

## 環境変数
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## デザイン特徴
- **ロゴ**: 大型表示（最大448x448px）、白いドロップシャドウ
- **カラーパレット**: 青・赤・オレンジ・黄色のグラデーション
- **フォント**: Noto Sans JP（通常）、Noto Serif JP（キャッチコピー）
- **レスポンシブ**: モバイルファーストアプローチ

## 最近の更新
1. **Supabase完全統合**: 予約システム・顧客管理・カレンダーデータ連携
2. **リアルタイム予約管理**: 管理画面での電話予約登録機能
3. **データベース型安全性**: TypeScript型定義による完全なタイプセーフティ
4. **カレンダー実席数表示**: Supabaseからの実際の空席データ取得
5. **フォーム統合**: 予約フォーム・管理画面フォーム共にSupabase連携完了

## 管理者機能
- 予約管理・確認
- 顧客情報管理  
- 運航スケジュール管理
- 釣果記録・更新

## SEO・パフォーマンス
- 静的ページ生成（SSG）
- 画像最適化
- メタデータ設定
- Core Web Vitals対応

## 今後の改善点
- Next.js Image コンポーネント使用（現在img要素）
- 実際のSupabaseデータ連携
- 予約フォームの完全実装
- 管理画面UI実装