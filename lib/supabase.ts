import { createClient } from '@supabase/supabase-js';

// تأكدي أن هذه القيم في ملف .env.local لا تحتوي على أي شرطة مائلة (/) في نهايتها
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);