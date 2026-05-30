"use client";
import React, { useState } from 'react';

export default function LoginForm() {
  const [role, setRole] = useState<'admin' | 'rep'>('rep');

  return (
    <div className="bg-dark-light p-8 md:p-10 rounded-3xl border border-gold/30 shadow-2xl w-full max-w-md">
      <h2 className="text-3xl font-bold text-white mb-2">تسجيل الدخول</h2>
      <p className="text-gray-400 mb-8">مرحباً بك مجدداً في TRSY</p>

      {/* اختيار نوع الحساب */}
      <div className="flex gap-4 mb-8 bg-black p-2 rounded-2xl">
        <button 
          onClick={() => setRole('rep')}
          className={`flex-1 py-2 rounded-xl transition ${role === 'rep' ? 'bg-violet text-white' : 'text-gray-500'}`}
        >
          مندوب
        </button>
        <button 
          onClick={() => setRole('admin')}
          className={`flex-1 py-2 rounded-xl transition ${role === 'admin' ? 'bg-gold text-black font-bold' : 'text-gray-500'}`}
        >
          مدير
        </button>
      </div>

      <form className="space-y-5">
        <input 
          type="text" 
          placeholder="البريد الإلكتروني أو رقم الهاتف" 
          className="w-full p-4 bg-black border border-gray-800 rounded-xl focus:border-gold outline-none transition"
        />
        <input 
          type="password" 
          placeholder="كلمة المرور" 
          className="w-full p-4 bg-black border border-gray-800 rounded-xl focus:border-gold outline-none transition"
        />
        <button className="w-full py-4 bg-gold text-black font-bold rounded-xl hover:bg-gold-light transition mt-2">
          دخول
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        <a href="#" className="hover:text-gold transition">نسيت كلمة المرور؟</a>
      </div>
    </div>
  );
}