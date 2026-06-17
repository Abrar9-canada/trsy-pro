/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Mail, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#050505] relative overflow-hidden">
      <Link href="/login" className="fixed top-6 right-6 z-50 flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm">
        <ArrowRight size={16} /> العودة لتسجيل الدخول
      </Link>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a1606_0%,#050505_100%)]"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0f0f0f]/80 backdrop-blur-2xl p-8 md:p-12 rounded-[2rem] border border-white/5 shadow-2xl w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-3">استعادة كلمة المرور</h1>
          <p className="text-gray-500">أدخل بريدك الإلكتروني لإرسال رابط إعادة التعيين</p>
        </div>

        {success ? (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center p-6 bg-green-500/10 border border-green-500/20 rounded-2xl">
            <CheckCircle2 className="mx-auto text-green-500 mb-4" size={48} />
            <p className="text-green-400">تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني بنجاح.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleReset} className="space-y-5">
            {errorMsg && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center">{errorMsg}</div>}
            
            <div className="relative group">
              <Mail className="absolute right-4 top-4 text-gray-600 group-focus-within:text-yellow-500 transition-colors" size={20} />
              <input 
                type="email" 
                placeholder="البريد الإلكتروني" 
                required 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full p-4 pr-12 bg-[#050505] border border-white/5 rounded-xl focus:border-yellow-500 outline-none text-white transition-all" 
              />
            </div>

            <button disabled={loading} className="w-full py-4 bg-yellow-500 text-black font-bold text-lg rounded-xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : "إرسال رابط الاستعادة"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}