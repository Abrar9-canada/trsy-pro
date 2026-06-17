/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { Mail, Lock, User, Briefcase, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function LoginForm() {
  const [role, setRole] = useState<'admin' | 'rep'>('rep');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // هنا سيتم استبدال هذا الجزء بمنطق Supabase الفعلي لاحقاً
      await new Promise((resolve, reject) => 
        setTimeout(() => reject(new Error("بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى.")), 1500)
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#050505] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a1606_0%,#050505_100%)]"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0f0f0f]/80 backdrop-blur-2xl p-8 md:p-12 rounded-[2rem] border border-white/5 shadow-[0_0_80px_-20px_rgba(234,179,8,0.15)] w-full max-w-lg z-10"
      >
        <div className="mb-10">
          <h2 className="text-4xl font-extrabold text-white mb-3">تسجيل الدخول</h2>
          <p className="text-gray-400 text-lg">أهلاً بك في نظام <span className="text-yellow-500 font-bold">TRSY</span></p>
        </div>

        {/* منطقة عرض الخطأ */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-3 text-sm"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-4 mb-10 bg-[#0a0a0a] p-2 rounded-2xl border border-white/5">
          <button 
            onClick={() => setRole('rep')}
            className={`flex-1 py-3.5 rounded-xl transition-all duration-300 font-medium flex items-center justify-center gap-2 ${role === 'rep' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <User size={18} /> مندوب
          </button>
          <button 
            onClick={() => setRole('admin')}
            className={`flex-1 py-3.5 rounded-xl transition-all duration-300 font-bold flex items-center justify-center gap-2 ${role === 'admin' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Briefcase size={18} /> مدير
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <Mail className="absolute right-4 top-4 text-gray-600 group-focus-within:text-yellow-500 transition-colors" size={20} />
            <input 
              type="email" 
              placeholder="البريد الإلكتروني" 
              required
              className="w-full p-4 pr-12 bg-[#050505] border border-white/5 rounded-xl focus:border-yellow-500 outline-none transition-all text-white placeholder:text-gray-700 focus:ring-2 focus:ring-yellow-500/10"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute right-4 top-4 text-gray-600 group-focus-within:text-yellow-500 transition-colors" size={20} />
            <input 
              type="password" 
              placeholder="كلمة المرور" 
              required
              className="w-full p-4 pr-12 bg-[#050505] border border-white/5 rounded-xl focus:border-yellow-500 outline-none transition-all text-white placeholder:text-gray-700 focus:ring-2 focus:ring-yellow-500/10"
            />
          </div>

          <button 
            disabled={loading}
            className="w-full py-4 bg-yellow-500 text-black font-bold text-lg rounded-xl hover:bg-yellow-400 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "دخول إلى النظام"}
          </button>
        </form>

        <div className="mt-8 flex justify-between items-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-white flex items-center gap-1 transition">
            <ArrowRight size={14} /> العودة للرئيسية
          </Link>
          <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-yellow-500 transition">
            نسيت كلمة المرور؟
          </Link>
        </div>
      </motion.div>
    </div>
  );
}