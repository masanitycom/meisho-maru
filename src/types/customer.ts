export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  total_visits: number;
  last_visit_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerFormData {
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}

export interface FishingResult {
  id: string;
  schedule_date: string;
  trip_number: 1 | 2;
  customer_id: string | null;
  fish_count: number;
  total_weight: number | null;
  fish_types: string[] | null;
  photo_urls: string[] | null;
  notes: string | null;
  created_at: string;
}