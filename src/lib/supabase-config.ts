// Supabase設定を一元管理
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || ''
};

// 設定が有効かチェック
export const isSupabaseConfigured = () => {
  return !!(supabaseConfig.url && supabaseConfig.anonKey);
};