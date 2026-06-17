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
    password: 'Password123!' // كلمة مرور افتراضية يمكن تغييرها
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // 1. إنشاء المستخدم في نظام التوثيق
    const { data, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.full_name,
          role: 'representative'
        }
      }
    });

    if (authError) {
      toast.error("خطأ في التوثيق: " + authError.message);
      setLoading(false);
      return;
    }

    // 2. إدخال البيانات الإضافية في جدول profiles
    const { error: profileError } = await supabase.from('profiles').insert([
      { 
        id: data.user?.id, // الربط بنفس الـ ID الخاص بـ Auth
        full_name: formData.full_name, 
        phone: formData.phone,
        role: 'representative' 
      }
    ]);

    if (profileError) {
      toast.error("خطأ في حفظ البيانات: " + profileError.message);
    } else {
      toast.success("تم إنشاء حساب المندوب بنجاح!");
      router.push('/admin/reps');
    }
    setLoading(false);
  }

  return (
    <div className="p-4 md:p-12 min-h-screen bg-[#0a0a0a] text-white">
      <Toaster position="top-right" />
      
      <div className="max-w-xl mx-auto">
        <button onClick={() => router.back()} className="mb-8 text-gray-500 hover:text-white flex items-center gap-2 transition">
          <ArrowRight size={20} /> العودة للقائمة
        </button>

        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <UserPlus className="text-yellow-500" /> إضافة مندوب (حساب دخول)
        </h1>

        <form onSubmit={handleSubmit} className="bg-[#121212] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-5">
          
          {/* الاسم */}
          <div className="relative group">
            <User className="absolute right-4 top-4 text-gray-600 group-focus-within:text-yellow-500 transition-colors" size={20} />
            <input type="text" required placeholder="الاسم الكامل" className="w-full p-4 pr-12 bg-[#0a0a0a] border border-white/10 rounded-2xl text-white outline-none focus:border-yellow-500"
              onChange={(e) => setFormData({...formData, full_name: e.target.value})} />
          </div>

          {/* الإيميل */}
          <div className="relative group">
            <Mail className="absolute right-4 top-4 text-gray-600 group-focus-within:text-yellow-500 transition-colors" size={20} />
            <input type="email" required placeholder="البريد الإلكتروني (للدخول)" className="w-full p-4 pr-12 bg-[#0a0a0a] border border-white/10 rounded-2xl text-white outline-none focus:border-yellow-500"
              onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>

          {/* الهاتف */}
          <div className="relative group">
            <Phone className="absolute right-4 top-4 text-gray-600 group-focus-within:text-yellow-500 transition-colors" size={20} />
            <input type="tel" required placeholder="رقم الهاتف" className="w-full p-4 pr-12 bg-[#0a0a0a] border border-white/10 rounded-2xl text-white outline-none focus:border-yellow-500"
              onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : "إنشاء حساب المندوب"}
          </button>
        </form>
      </div>
    </div>
  );
}