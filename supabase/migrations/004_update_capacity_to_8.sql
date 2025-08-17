-- 既存のスケジュールの定員を10名から8名に更新
UPDATE schedules 
SET available_seats = 8, max_seats = 8 
WHERE available_seats = 10 OR max_seats = 10;

-- テーブルのデフォルト値を変更
ALTER TABLE schedules ALTER COLUMN available_seats SET DEFAULT 8;
ALTER TABLE schedules ALTER COLUMN max_seats SET DEFAULT 8;