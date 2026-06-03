"use client";
import React, { useState } from 'react';
import { Mail, Lock, User, Briefcase } from 'lucide-react'; // استيراد الأيقونات

export default function LoginForm() {
  const [role, setRole] = useState<'admin' | 'rep'>('rep');

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0a]">
      <div className="bg-[#121212] p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl w-full max-w-lg">
        
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">تسجيل الدخول</h2>
        <p className="text-gray-400 mb-10 text-lg">مرحباً بك مجدداً في TRSY</p>

        {/* اختيار نوع الحساب */}
        <div className="flex gap-4 mb-10 bg-[#0a0a0a] p-2 rounded-2xl border border-white/5">
          <button 
            onClick={() => setRole('rep')}
            className={`flex-1 py-3 rounded-xl transition-all duration-300 font-medium flex items-center justify-center gap-2 ${role === 'rep' ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <User size={18} /> مندوب
          </button>
          <button 
            onClick={() => setRole('admin')}
            className={`flex-1 py-3 rounded-xl transition-all duration-300 font-bold flex items-center justify-center gap-2 ${role === 'admin' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Briefcase size={18} /> مدير
          </button>
        </div>

        <form className="space-y-6">
          {/* حقل البريد مع أيقونة */}
          <div className="relative">
            <Mail className="absolute right-4 top-4 text-gray-600" size={20} />
            <input 
              type="text" 
              placeholder="البريد الإلكتروني" 
              className="w-full p-4 pr-12 bg-[#0a0a0a] border border-white/10 rounded-xl focus:border-yellow-500 outline-none transition text-white placeholder:text-gray-600"
            />
          </div>

          {/* حقل كلمة المرور مع أيقونة */}
          <div className="relative">
            <Lock className="absolute right-4 top-4 text-gray-600" size={20} />
            <input 
              type="password" 
              placeholder="كلمة المرور" 
              className="w-full p-4 pr-12 bg-[#0a0a0a] border border-white/10 rounded-xl focus:border-yellow-500 outline-none transition text-white placeholder:text-gray-600"
            />
          </div>

          <button className="w-full py-4 bg-yellow-500 text-black font-bold text-lg rounded-xl hover:bg-yellow-400 transition-all duration-300 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
            دخول
          </button>
        </form>

        <div className="mt-8 text-center">
          <a href="#" className="text-sm text-gray-500 hover:text-yellow-500 transition">نسيت كلمة المرور؟</a>
        </div>
      </div>
    </div>
  );
}