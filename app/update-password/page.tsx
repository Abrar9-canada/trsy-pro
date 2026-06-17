/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Lock, Loader2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) router.replace('/login');
      else setChecking(false);
    };
    checkSession();
  }, [router]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("كلمات المرور غير متطابقة");
      return;
    }

    if (password.length < 6) {
      toast.error("كلمة المرور يجب أن تتكون من 6 رموز على الأقل");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error("خطأ: " + error.message);
    } else {
      toast.success("تم تحديث كلمة المرور بنجاح!");
      router.push('/login');
    }
    setLoading(false);
  };

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <Loader2 className="animate-spin text-yellow-500" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6">
      <Toaster position="top-center" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0f0f0f]/80 backdrop-blur-2xl p-10 rounded-[2rem] border border-white/5 w-full max-w-md shadow-2xl"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-4 bg-yellow-500/10 rounded-full mb-4">
            <ShieldCheck className="text-yellow-500" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white">تعيين كلمة مرور جديدة</h2>
          <p className="text-gray-500 mt-2 text-sm">يجب أن تكون كلمة المرور قوية لحماية حسابك</p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-5">
          {/* حقل كلمة المرور */}
          <div className="relative group">
            <Lock className="absolute right-4 top-4 text-gray-600 group-focus-within:text-yellow-500" size={20} />
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="كلمة المرور الجديدة"
              required
              className="w-full p-4 pr-12 bg-[#050505] border border-white/5 rounded-xl text-white outline-none focus:border-yellow-500 transition"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {/* حقل تأكيد كلمة المرور */}
          <div className="relative group">
            <Lock className="absolute right-4 top-4 text-gray-600 group-focus-within:text-yellow-500" size={20} />
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="تأكيد كلمة المرور"
              required
              className="w-full p-4 pr-12 bg-[#050505] border border-white/5 rounded-xl text-white outline-none focus:border-yellow-500 transition"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-4 text-gray-600 hover:text-white">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          <button 
            disabled={loading} 
            className="w-full py-4 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "حفظ التغييرات"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}