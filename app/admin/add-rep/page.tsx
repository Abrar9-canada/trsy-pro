/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast, Toaster } from 'react-hot-toast';
import { UserPlus, Loader2, Phone, User, ArrowRight, Mail, Lock } from 'lucide-react';

export default function AddRepPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    password: ''
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // 1. إنشاء المستخدم في نظام التوثيق (Auth)
    const { data, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { full_name: formData.full_name, role: 'representative' }
      }
    });

    if (authError) {
      toast.error(authError.message);
      setLoading(false);
      return;
    }

    // 2. إدخال البيانات في جدول profiles
    const { error: profileError } = await supabase.from('profiles').insert([
      { 
        id: data.user?.id,
        full_name: formData.full_name, 
        phone: formData.phone,
        role: 'representative' 
      }
    ]);

    if (profileError) {
      toast.error("خطأ في حفظ بيانات الملف الشخصي.");
    } else {
      toast.success("تم إنشاء حساب المندوب بنجاح!");
      router.push('/admin/reps');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      <Toaster position="top-right" />
      
      <div className="max-w-lg mx-auto mt-10">
        <button onClick={() => router.back()} className="mb-6 text-gray-400 hover:text-white flex items-center gap-2 transition">
          <ArrowRight size={20} /> العودة للقائمة
        </button>

        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <UserPlus className="text-yellow-500" /> إضافة مندوب جديد
        </h1>

        <form onSubmit={handleSubmit} className="bg-[#121212] p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-5">
          <InputField label="الاسم الكامل" icon={<User size={18} />} placeholder="أحمد محمد" onChange={(v: string) => setFormData({...formData, full_name: v})} />
          <InputField label="البريد الإلكتروني" icon={<Mail size={18} />} type="email" placeholder="rep@company.com" onChange={(v: string) => setFormData({...formData, email: v})} />
          <InputField label="كلمة المرور" icon={<Lock size={18} />} type="password" placeholder="••••••••" onChange={(v: string) => setFormData({...formData, password: v})} />
          <InputField label="رقم الهاتف" icon={<Phone size={18} />} type="tel" placeholder="05xxxxxxxx" onChange={(v: string) => setFormData({...formData, phone: v})} />

          <button type="submit" disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 mt-6">
            {loading ? <Loader2 className="animate-spin" /> : "إنشاء حساب المندوب"}
          </button>
        </form>
      </div>
    </div>
  );
}

// مكون فرعي للحقول (Reusable Component)
function InputField({ label, icon, type = "text", placeholder, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">{label}</label>
      <div className="relative group">
        <div className="absolute right-4 top-4 text-gray-600 group-focus-within:text-yellow-500 transition-colors">{icon}</div>
        <input 
          type={type} 
          required 
          placeholder={placeholder} 
          className="w-full p-4 pr-12 bg-[#0a0a0a] border border-white/10 rounded-2xl text-white outline-none focus:border-yellow-500 transition"
          onChange={(e) => onChange(e.target.value)} 
        />
      </div>
    </div>
  );
}