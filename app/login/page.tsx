/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.replace('/admin/dashboard');
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      setVerifying(true);
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user?.id)
        .single();

      await new Promise(resolve => setTimeout(resolve, 1200));

      if (profile?.role === 'admin') router.replace('/admin/dashboard');
      else router.replace('/rep/dashboard');
      
    } catch (err: any) {
      setErrorMsg(err.message === "Invalid login credentials" ? "البريد الإلكتروني أو كلمة المرور غير صحيحة" : err.message);
      setLoading(false);
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#050505] relative overflow-hidden">
      {/* زر العودة للرئيسية */}
      <Link href="/" className="fixed top-6 right-6 z-50 flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm">
        <ArrowRight size={16} /> العودة للرئيسية
      </Link>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a1606_0%,#050505_100%)]"></div>
      
      <AnimatePresence mode="wait">
        {verifying ? (
          <motion.div key="splash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center z-10">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-20 h-20 border-4 border-yellow-500 border-t-transparent rounded-full mb-6" />
            <h2 className="text-yellow-500 font-bold text-xl tracking-widest">جاري التحقق من الهوية...</h2>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0f0f0f]/80 backdrop-blur-2xl p-8 md:p-12 rounded-[2rem] border border-white/5 shadow-[0_0_80px_-20px_rgba(234,179,8,0.2)] w-full max-w-md z-10">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-black font-black text-2xl shadow-lg shadow-yellow-500/20">TR</div>
              <h1 className="text-3xl font-bold text-white mb-2">مرحباً بعودتك</h1>
              <p className="text-gray-500">أدخل بياناتك للوصول إلى لوحة التحكم</p>
            </div>

            {errorMsg && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center">{errorMsg}</motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="relative group">
                <Mail className="absolute right-4 top-4 text-gray-600 group-focus-within:text-yellow-500 transition-colors" size={20} />
                <input type="email" placeholder="البريد الإلكتروني" required onChange={(e) => setEmail(e.target.value)} className="w-full p-4 pr-12 bg-[#050505] border border-white/5 rounded-xl focus:border-yellow-500 outline-none text-white transition-all focus:ring-2 focus:ring-yellow-500/20" />
              </div>

              <div className="relative group">
                <Lock className="absolute right-4 top-4 text-gray-600 group-focus-within:text-yellow-500 transition-colors" size={20} />
                <input type={showPassword ? "text" : "password"} placeholder="كلمة المرور" required onChange={(e) => setPassword(e.target.value)} className="w-full p-4 pr-12 pl-12 bg-[#050505] border border-white/5 rounded-xl focus:border-yellow-500 outline-none text-white transition-all focus:ring-2 focus:ring-yellow-500/20" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-4 text-gray-600 hover:text-white">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* رابط نسيت كلمة المرور */}
              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-yellow-500 transition-colors">
                  نسيت كلمة المرور؟
                </Link>
              </div>

              <button disabled={loading} className="w-full py-4 bg-yellow-500 text-black font-bold text-lg rounded-xl hover:bg-yellow-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20">
                {loading ? <Loader2 className="animate-spin" /> : "تسجيل الدخول"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}