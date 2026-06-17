import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, password, full_name, phone } = await req.json();
  
  // استخدمي Service Role Key هنا (موجود في إعدادات Supabase تحت API)
  const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  // 1. إنشاء المستخدم في Auth
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, phone, role: 'representative' }
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // 2. إضافة البيانات لجدول profiles
  await supabaseAdmin.from('profiles').insert({
    id: data.user.id,
    full_name,
    phone,
    role: 'representative'
  });

  return NextResponse.json({ success: true });
}