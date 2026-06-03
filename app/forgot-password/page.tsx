"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Mail, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // المسار الجديد المباشر داخل app/
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`, 
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: "تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني." });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0a]">
      <div className="bg-[#121212] p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-white mb-3">استعادة الوصول</h2>
        <p className="text-gray-400 mb-8">أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.</p>

        {message && (
          <div className={`mb-6 p-4 rounded-xl text-sm border ${message.type === 'success' ? 'bg-green-950/30 border-green-500/50 text-green-200' : 'bg-red-950/30 border-red-500/50 text-red-200'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-6">
          <div className="relative">
            <Mail className="absolute right-4 top-4 text-gray-600" size={20} />
            <input 
              type="email" 
              placeholder="البريد الإلكتروني" 
              required
              className="w-full p-4 pr-12 bg-[#0a0a0a] border border-white/10 rounded-xl focus:border-yellow-500 outline-none transition text-white"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full py-4 bg-yellow-500 text-black font-bold text-lg rounded-xl hover:bg-yellow-400 transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "إرسال رابط الاستعادة"}
          </button>
        </form>

        <div className="mt-8">
          <Link href="/login" className="text-gray-500 hover:text-white transition flex items-center justify-center gap-2">
            <ArrowRight size={16} /> العودة إلى تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}