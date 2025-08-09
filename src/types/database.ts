export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string;
          email: string;
          role: 'admin' | 'staff';
          is_active: boolean;
          last_login: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          email: string;
          role?: 'admin' | 'staff';
          is_active?: boolean;
        };
        Update: {
          email?: string;
          role?: 'admin' | 'staff';
          is_active?: boolean;
          last_login?: string | null;
        };
      };
      customers: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string | null;
          total_visits: number;
          last_visit_date: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          phone: string;
          email?: string | null;
          notes?: string | null;
        };
        Update: {
          name?: string;
          phone?: string;
          email?: string | null;
          notes?: string | null;
        };
      };
      schedules: {
        Row: {
          id: string;
          date: string;
          trip_number: 1 | 2;
          available_seats: number;
          max_seats: number;
          is_confirmed: boolean;
          status: 'available' | 'full' | 'cancelled';
          weather_note: string | null;
          special_note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          date: string;
          trip_number: 1 | 2;
          available_seats?: number;
          max_seats?: number;
          is_confirmed?: boolean;
          status?: 'available' | 'full' | 'cancelled';
          weather_note?: string | null;
          special_note?: string | null;
        };
        Update: {
          available_seats?: number;
          max_seats?: number;
          is_confirmed?: boolean;
          status?: 'available' | 'full' | 'cancelled';
          weather_note?: string | null;
          special_note?: string | null;
        };
      };
      reservations: {
        Row: {
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
        };
        Insert: {
          customer_id: string;
          schedule_date: string;
          trip_number: 1 | 2;
          people_count?: number;
          rod_rental?: boolean;
          status?: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
          special_requests?: string | null;
          total_amount?: number | null;
          payment_status?: 'pending' | 'paid' | 'cancelled';
        };
        Update: {
          status?: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
          special_requests?: string | null;
          total_amount?: number | null;
          payment_status?: 'pending' | 'paid' | 'cancelled';
        };
      };
      fishing_results: {
        Row: {
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
        };
        Insert: {
          schedule_date: string;
          trip_number: 1 | 2;
          customer_id?: string | null;
          fish_count?: number;
          total_weight?: number | null;
          fish_types?: string[] | null;
          photo_urls?: string[] | null;
          notes?: string | null;
        };
        Update: {
          fish_count?: number;
          total_weight?: number | null;
          fish_types?: string[] | null;
          photo_urls?: string[] | null;
          notes?: string | null;
        };
      };
    };
  };
}