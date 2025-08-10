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
          name_kana: string;
          phone: string;
          email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          name_kana: string;
          phone: string;
          email?: string | null;
        };
        Update: {
          name?: string;
          name_kana?: string;
          phone?: string;
          email?: string | null;
        };
      };
      schedules: {
        Row: {
          id: string;
          date: string;
          trip_number: number;
          max_capacity: number;
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          date: string;
          trip_number: number;
          max_capacity?: number;
          is_available?: boolean;
        };
        Update: {
          date?: string;
          trip_number?: number;
          max_capacity?: number;
          is_available?: boolean;
        };
      };
      reservations: {
        Row: {
          id: string;
          customer_id: string | null;
          date: string;
          trip_number: number;
          people_count: number;
          name: string;
          name_kana: string;
          phone: string;
          email: string | null;
          rod_rental: boolean;
          notes: string | null;
          source: string | null;
          status: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          customer_id?: string | null;
          date: string;
          trip_number: number;
          people_count: number;
          name: string;
          name_kana: string;
          phone: string;
          email?: string | null;
          rod_rental?: boolean;
          notes?: string | null;
          source?: string | null;
          status?: string | null;
        };
        Update: {
          customer_id?: string | null;
          date?: string;
          trip_number?: number;
          people_count?: number;
          name?: string;
          name_kana?: string;
          phone?: string;
          email?: string | null;
          rod_rental?: boolean;
          notes?: string | null;
          source?: string | null;
          status?: string | null;
        };
      };
      fishing_results: {
        Row: {
          id: string;
          date: string;
          trip_number: number;
          total_catch: number | null;
          species_caught: string[] | null;
          weather_conditions: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          date: string;
          trip_number: number;
          total_catch?: number | null;
          species_caught?: string[] | null;
          weather_conditions?: string | null;
          notes?: string | null;
        };
        Update: {
          date?: string;
          trip_number?: number;
          total_catch?: number | null;
          species_caught?: string[] | null;
          weather_conditions?: string | null;
          notes?: string | null;
        };
      };
    };
  };
}