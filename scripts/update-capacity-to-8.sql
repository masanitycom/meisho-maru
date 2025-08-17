-- 既存のスケジュールの定員を10名から8名に更新
UPDATE schedules 
SET max_capacity = 8 
WHERE max_capacity = 10;

-- デフォルト値も8名に設定（もしデフォルト制約がある場合）
-- ALTER TABLE schedules ALTER COLUMN max_capacity SET DEFAULT 8;