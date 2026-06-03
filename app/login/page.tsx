"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

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

      // تأخير بسيط لإظهار شعار الشركة وتأثيرات التحقق
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (profile?.role === 'admin') router.replace('/admin/dashboard');
      else router.replace('/rep/dashboard');
      
    } catch (err: any) {
      setErrorMsg(err.message || "حدث خطأ أثناء الدخول");
      setLoading(false);
      setVerifying(false);
    }
  };

  return (
    // إضافة bg-[length:400%_400%] ضروري لتفعيل حركة الخلفية
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gradient-to-br from-[#0a0a0a] via-[#1a1606] to-[#0a0a0a] bg-[length:400%_400%] animate-gradient-x relative overflow-hidden">
      
      {/* تأثير إضاءة خلفي إضافي */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-yellow-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-yellow-900/10 rounded-full blur-[120px]" />
      </div>

      <AnimatePresence mode="wait">
        {verifying ? (
          <motion.div 
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center z-10"
          >
            <motion.div 
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-24 h-24 bg-gradient-to-tr from-yellow-400 to-yellow-600 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_50px_-10px_rgba(234,179,8,0.5)]"
            >
              <span className="text-black font-bold text-3xl">TRSY</span>
            </motion.div>
            <h2 className="text-white text-2xl font-bold mb-2">جاري تجهيز النظام...</h2>
          </motion.div>
        ) : (
          <motion.div 
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#121212]/80 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl w-full max-w-lg z-10"
          >
            <h1 className="text-3xl font-bold text-white mb-3">تسجيل الدخول</h1>
            <p className="text-gray-400 mb-10 text-lg">مرحباً بك مجدداً في TRSY</p>

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-950/30 border border-red-500/50 text-red-200 rounded-xl">{errorMsg}</div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <Mail className="absolute right-4 top-4 text-gray-600" size={20} />
                <input type="email" placeholder="البريد الإلكتروني" required onChange={(e) => setEmail(e.target.value)} className="w-full p-4 pr-12 bg-[#0a0a0a]/50 border border-white/10 rounded-xl focus:border-yellow-500 outline-none text-white transition" />
              </div>

              <div className="relative">
                <Lock className="absolute right-4 top-4 text-gray-600" size={20} />
                <input type="password" placeholder="كلمة المرور" required onChange={(e) => setPassword(e.target.value)} className="w-full p-4 pr-12 bg-[#0a0a0a]/50 border border-white/10 rounded-xl focus:border-yellow-500 outline-none text-white transition" />
              </div>

              <button disabled={loading} className="w-full py-4 bg-yellow-500 text-black font-bold text-lg rounded-xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : "دخول"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}