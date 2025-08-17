-- 既存のスケジュールの定員を10名から8名に更新
UPDATE schedules 
SET max_capacity = 8 
WHERE max_capacity = 10 OR max_capacity IS NULL;

-- 今後の新しいレコードのデフォルト値も8に設定
-- (テーブル定義でカラムが存在する場合のみ)
-- ALTER TABLE schedules ALTER COLUMN max_capacity SET DEFAULT 8;