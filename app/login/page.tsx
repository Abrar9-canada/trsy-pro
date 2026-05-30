/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. تسجيل الدخول
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. التحقق من الدور (Role)
      // نتأكد أن المستخدم سجل دخوله فعلياً قبل جلب بيانات البروفايل
      const userId = authData.user?.id;
      if (!userId) throw new Error("فشل الحصول على بيانات المستخدم");

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        throw new Error("لم يتم العثور على بيانات الصلاحيات لهذا الحساب.");
      }

      // 3. التوجيه بناءً على الدور
      // نستخدم replace بدلاً من push لمنع العودة لصفحة الدخول عبر زر 'الرجوع'
      if (profile.role === 'admin') {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/rep/dashboard');
      }
      
      // لا نحتاج لـ router.refresh() لأن replace ستقوم بتحديث الحالة
    } catch (err: any) {
      setErrorMsg(err.message || "حدث خطأ أثناء تسجيل الدخول");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
      <form onSubmit={handleLogin} className="p-8 bg-gray-900 rounded-xl border border-gray-800 w-full max-w-sm shadow-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-yellow-500">TRSY - تسجيل الدخول</h1>
        
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-200 text-sm rounded">
            {errorMsg}
          </div>
        )}

        <input 
          type="email" 
          placeholder="البريد الإلكتروني" 
          required
          className="w-full p-3 mb-4 bg-gray-800 rounded border border-gray-700 outline-none focus:border-yellow-500"
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <input 
          type="password" 
          placeholder="كلمة المرور" 
          required
          className="w-full p-3 mb-6 bg-gray-800 rounded border border-gray-700 outline-none focus:border-yellow-500"
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <button 
          disabled={loading}
          className={`w-full py-3 font-bold rounded transition ${loading ? 'bg-gray-600' : 'bg-yellow-600 hover:bg-yellow-500'}`}
        >
          {loading ? "جاري الدخول..." : "دخول"}
        </button>
      </form>
    </div>
  );
}