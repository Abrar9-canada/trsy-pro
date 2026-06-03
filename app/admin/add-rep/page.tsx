"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast, Toaster } from 'react-hot-toast';
import { UserPlus, Loader2, Phone, User } from 'lucide-react';

export default function AddRepPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: ''
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // إضافة المندوب في جدول profiles
    const { error } = await supabase.from('profiles').insert([
      { 
        full_name: formData.full_name, 
        phone: formData.phone,
        role: 'representative' // نحدد الدور هنا
      }
    ]);

    if (error) {
      toast.error("خطأ: " + error.message);
    } else {
      toast.success("تم إضافة المندوب بنجاح!");
      router.push('/admin/reps'); // العودة لصفحة إدارة المناديب
    }
    setLoading(false);
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <UserPlus className="text-yellow-500" /> إضافة مندوب جديد
      </h1>

      <form onSubmit={handleSubmit} className="bg-[#121212] p-8 rounded-3xl border border-white/5 space-y-6">
        {/* الاسم */}
        <div>
          <label className="block mb-2 text-sm text-gray-400">اسم المندوب</label>
          <div className="relative">
            <User className="absolute right-3 top-4 text-gray-600" size={18} />
            <input 
              type="text" required
              className="w-full p-4 pr-10 bg-[#0a0a0a] border border-white/10 rounded-xl text-white focus:border-yellow-500 outline-none"
              placeholder="أدخل الاسم الكامل"
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            />
          </div>
        </div>

        {/* الهاتف */}
        <div>
          <label className="block mb-2 text-sm text-gray-400">رقم الهاتف</label>
          <div className="relative">
            <Phone className="absolute right-3 top-4 text-gray-600" size={18} />
            <input 
              type="tel" required
              className="w-full p-4 pr-10 bg-[#0a0a0a] border border-white/10 rounded-xl text-white focus:border-yellow-500 outline-none"
              placeholder="أدخل رقم الهاتف"
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 rounded-xl transition flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : "حفظ المندوب"}
        </button>
      </form>
    </div>
  );
}