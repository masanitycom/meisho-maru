-- 管理者ユーザーを追加
-- 注意: your_admin_email@example.com を実際のメールアドレスに変更してください
INSERT INTO admin_users (email, role, is_active) 
VALUES ('your_admin_email@example.com', 'admin', true)
ON CONFLICT (email) DO NOTHING;