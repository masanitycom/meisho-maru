-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE fishing_results ENABLE ROW LEVEL SECURITY;

-- Public read access for schedules
CREATE POLICY "Public schedules are viewable by everyone" ON schedules
  FOR SELECT USING (true);

-- Admin only access for other tables
CREATE POLICY "Admin only access to admin_users" ON admin_users
  FOR ALL USING (auth.email() IN (SELECT email FROM admin_users WHERE is_active = true));

CREATE POLICY "Admin only access to customers" ON customers
  FOR ALL USING (auth.email() IN (SELECT email FROM admin_users WHERE is_active = true));

CREATE POLICY "Admin only access to reservations" ON reservations
  FOR ALL USING (auth.email() IN (SELECT email FROM admin_users WHERE is_active = true));

CREATE POLICY "Admin only access to fishing_results" ON fishing_results
  FOR ALL USING (auth.email() IN (SELECT email FROM admin_users WHERE is_active = true));

-- Allow public insert for reservations (for customer reservations)
CREATE POLICY "Allow public reservation creation" ON reservations
  FOR INSERT WITH CHECK (true);