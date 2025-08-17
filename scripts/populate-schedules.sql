-- 今日から30日分のスケジュールデータを作成
-- これをSupabaseのSQL Editorで実行してください

INSERT INTO schedules (date, trip_number, max_capacity, is_available)
SELECT 
  (CURRENT_DATE + INTERVAL '1 day' * generate_series(0, 29)) as date,
  trip_number,
  8 as max_capacity,
  true as is_available
FROM (VALUES (1), (2)) AS t(trip_number)
ON CONFLICT (date, trip_number) DO NOTHING;

-- 確認用クエリ
SELECT 
  date,
  trip_number,
  max_capacity,
  is_available,
  created_at
FROM schedules 
ORDER BY date, trip_number
LIMIT 20;