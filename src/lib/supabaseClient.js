import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabaseUrl = rawUrl.replace(/^["']|["']$/g, '').trim();
const supabaseAnonKey = rawKey.replace(/^["']|["']$/g, '').trim();

// Supabase URL ve Anon Key girilmiş mi kontrol et
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseUrl.startsWith('https://')
);

if (!isSupabaseConfigured) {
  console.info(
    '%c[NovaQ Supabase]%c Supabase ortam değişkenleri (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) henüz tanımlanmadı. Sistem yerel demo verileriyle (Mock Mode) güvenle çalışıyor.',
    'color: #00d2ff; font-weight: bold;',
    'color: #94a3b8;'
  );
}

// Supabase istemcisini oluştur (varsa gerçek client, yoksa null)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
