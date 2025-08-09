export interface Reservation {
  id: string;
  customer_id: string;
  schedule_date: string;
  trip_number: 1 | 2;
  people_count: number;
  rod_rental: boolean;
  status: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  special_requests: string | null;
  total_amount: number | null;
  payment_status: 'pending' | 'paid' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface ReservationFormData {
  name: string;
  phone: string;
  email?: string;
  schedule_date: string;
  trip_number: 1 | 2;
  people_count: number;
  rod_rental: boolean;
  special_requests?: string;
}

export interface Schedule {
  id: string;
  date: string;
  trip_number: 1 | 2;
  available_seats: number;
  max_seats: number;
  is_confirmed: boolean;
  status: 'available' | 'full' | 'cancelled';
  weather_note: string | null;
  special_note: string | null;
}