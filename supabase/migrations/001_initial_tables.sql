-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin users table
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'staff')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  total_visits INTEGER DEFAULT 0,
  last_visit_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(phone)
);

-- Schedules table
CREATE TABLE schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  trip_number INTEGER NOT NULL CHECK (trip_number IN (1, 2)),
  available_seats INTEGER NOT NULL DEFAULT 8,
  max_seats INTEGER NOT NULL DEFAULT 8,
  is_confirmed BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'full', 'cancelled')),
  weather_note TEXT,
  special_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date, trip_number)
);

-- Reservations table
CREATE TABLE reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  schedule_date DATE NOT NULL,
  trip_number INTEGER NOT NULL CHECK (trip_number IN (1, 2)),
  people_count INTEGER NOT NULL DEFAULT 1,
  rod_rental BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no_show')),
  special_requests TEXT,
  total_amount INTEGER,
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (schedule_date, trip_number) REFERENCES schedules(date, trip_number)
);

-- Fishing results table
CREATE TABLE fishing_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  schedule_date DATE NOT NULL,
  trip_number INTEGER NOT NULL,
  customer_id UUID REFERENCES customers(id),
  fish_count INTEGER DEFAULT 0,
  total_weight DECIMAL(5,2),
  fish_types TEXT[],
  photo_urls TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (schedule_date, trip_number) REFERENCES schedules(date, trip_number)
);

-- Create indexes for better performance
CREATE INDEX idx_schedules_date ON schedules(date);
CREATE INDEX idx_reservations_date_trip ON reservations(schedule_date, trip_number);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_fishing_results_date_trip ON fishing_results(schedule_date, trip_number);