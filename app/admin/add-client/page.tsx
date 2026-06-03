"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast, Toaster } from 'react-hot-toast';
import { UserPlus, Loader2, DollarSign, Briefcase } from 'lucide-react';

export default function AddClientPage() {
  const router = useRouter();
  const [reps, setReps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // بيانات العميل المحدثة
  const [formData, setFormData] = useState({
    owner_name: '',
    phone: '',
    address: '',
    service_type: '', // نوع الخدمة
    amount: '',       // المبلغ المالي
    user_id: ''       // مندوب الطلب
  });

  useEffect(() => {
    async function fetchReps() {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'representative');
      
      if (data) setReps(data);
    }
    fetchReps();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // ملاحظة: تأكدي أن هذه الأعمدة موجودة في جدول clients
    const { error } = await supabase.from('clients').insert([formData]);

    if (error) {
      toast.error("خطأ: " + error.message);
    } else {
      toast.success("تم إضافة العميل والطلب بنجاح!");
      router.push('/admin/orders');
    }
    setLoading(false);
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <UserPlus className="text-yellow-500" /> إضافة عميل وطلب جديد
      </h1>

      <form onSubmit={handleSubmit} className="bg-[#121212] p-8 rounded-3xl border border-white/5 space-y-6">
        
        {/* بيانات العميل الشخصية */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm text-gray-400">اسم العميل</label>
            <input type="text" required className="w-full p-4 bg-[#0a0a0a] border border-white/10 rounded-xl text-white outline-none focus:border-yellow-500"
              onChange={(e) => setFormData({...formData, owner_name: e.target.value})} />
          </div>
          <div>
            <label className="block mb-2 text-sm text-gray-400">رقم الهاتف</label>
            <input type="tel" required className="w-full p-4 bg-[#0a0a0a] border border-white/10 rounded-xl text-white outline-none focus:border-yellow-500"
              onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm text-gray-400">العنوان</label>
          <input type="text" required className="w-full p-4 bg-[#0a0a0a] border border-white/10 rounded-xl text-white outline-none focus:border-yellow-500"
            onChange={(e) => setFormData({...formData, address: e.target.value})} />
        </div>

        {/* تفاصيل الطلب المالية والخدمية */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm text-gray-400 flex items-center gap-2"><Briefcase size={16}/> نوع الخدمة</label>
            <input type="text" required className="w-full p-4 bg-[#0a0a0a] border border-white/10 rounded-xl text-white outline-none focus:border-yellow-500"
              onChange={(e) => setFormData({...formData, service_type: e.target.value})} />
          </div>
          <div>
            <label className="block mb-2 text-sm text-gray-400 flex items-center gap-2"><DollarSign size={16}/> المبلغ المالي</label>
            <input type="number" required className="w-full p-4 bg-[#0a0a0a] border border-white/10 rounded-xl text-white outline-none focus:border-yellow-500"
              onChange={(e) => setFormData({...formData, amount: e.target.value})} />
          </div>
        </div>

        {/* اختيار المندوب */}
        <div>
          <label className="block mb-2 text-sm text-gray-400">تعيين المندوب المسؤول</label>
          <select required className="w-full p-4 bg-[#0a0a0a] border border-white/10 rounded-xl text-white outline-none focus:border-yellow-500"
            onChange={(e) => setFormData({...formData, user_id: e.target.value})}>
            <option value="">-- اختر مندوباً --</option>
            {reps.map((rep) => (
              <option key={rep.id} value={rep.id}>{rep.full_name}</option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 rounded-xl transition flex items-center justify-center gap-2">
          {loading ? <Loader2 className="animate-spin" /> : "إضافة الطلب للنظام"}
        </button>
      </form>
    </div>
  );
}