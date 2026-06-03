"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Lock, Loader2, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push('/login');
      } else {
        setChecking(false);
      }
    };
    checkSession();
  }, [router]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password: password });

    if (error) {
      alert("خطأ: " + error.message);
    } else {
      alert("تم تحديث كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول.");
      router.push('/login');
    }
    setLoading(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="animate-spin text-yellow-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-6">
      <div className="bg-[#121212] p-10 rounded-3xl border border-white/5 w-full max-w-md shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-4 bg-yellow-500/10 rounded-full mb-4">
            <ShieldCheck className="text-yellow-500" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white">تعيين كلمة مرور جديدة</h2>
          <p className="text-gray-400 mt-2 text-sm">يرجى اختيار كلمة مرور قوية وآمنة</p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-6">
          <div className="relative">
            <Lock className="absolute right-4 top-4 text-gray-600" size={20} />
            <input 
              type="password" 
              placeholder="كلمة المرور الجديدة"
              required
              className="w-full p-4 pr-12 bg-[#0a0a0a] border border-white/10 rounded-xl text-white outline-none focus:border-yellow-500 transition"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            disabled={loading} 
            className="w-full py-4 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "حفظ كلمة المرور"}
          </button>
        </form>
      </div>
    </div>
  );
}