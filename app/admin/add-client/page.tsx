"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';

export default function AddClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const { error } = await supabase.from('clients').insert([{
      ...data,
      status: 'تحت المراجعة' // الحالة الأولية التلقائية
    }]);

    if (error) {
      toast.error("خطأ: " + error.message);
    } else {
      toast.success("تم تسجيل العميل والطلب بنجاح!");
      setTimeout(() => router.push('/admin/dashboard'), 1500);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto text-white bg-gray-950 min-h-screen">
      <Toaster />
      <button onClick={() => router.back()} className="mb-6 text-yellow-500">← عودة</button>
      
      <h1 className="text-3xl font-bold mb-8 text-center text-yellow-500">إضافة عميل وطلب جديد</h1>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* قسم 1: معلومات العميل */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h2 className="text-xl font-bold mb-4 text-yellow-500">معلومات العميل</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="owner_name" placeholder="اسم صاحب المشروع" className="w-full p-3 bg-gray-800 rounded" required />
            <input name="phone" placeholder="رقم الهاتف" className="w-full p-3 bg-gray-800 rounded" required />
            <input name="whatsapp" placeholder="رابط الواتساب" className="w-full p-3 bg-gray-800 rounded" />
            <input name="business_name" placeholder="اسم المشروع / المحل" className="w-full p-3 bg-gray-800 rounded" required />
            <input name="activity_type" placeholder="نوع النشاط" className="w-full p-3 bg-gray-800 rounded" />
            <input name="location" placeholder="المدينة والمنطقة" className="w-full p-3 bg-gray-800 rounded" />
            <input name="maps_url" placeholder="رابط Google Maps" className="w-full p-3 bg-gray-800 rounded" />
            <input name="instagram" placeholder="حساب إنستغرام (اختياري)" className="w-full p-3 bg-gray-800 rounded" />
          </div>
        </div>

        {/* قسم 2: تفاصيل الطلب */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h2 className="text-xl font-bold mb-4 text-yellow-500">تفاصيل الطلب</h2>
          <div className="space-y-4">
            <select name="site_type" className="w-full p-3 bg-gray-800 rounded">
              <option value="صفحة تعريفية">صفحة تعريفية</option>
              <option value="موقع مطعم">موقع مطعم</option>
              <option value="متجر إلكتروني">متجر إلكتروني</option>
              <option value="موقع حجوزات">موقع حجوزات</option>
              <option value="تصميم مخصص">تصميم مخصص</option>
            </select>
            <textarea name="description" placeholder="وصف الطلب" className="w-full p-3 bg-gray-800 rounded h-24" />
            <textarea name="features" placeholder="المميزات المطلوبة" className="w-full p-3 bg-gray-800 rounded h-20" />
            <div className="grid grid-cols-2 gap-4">
              <input name="budget" placeholder="الميزانية المتوقعة" className="w-full p-3 bg-gray-800 rounded" />
              <input name="deadline" type="date" className="w-full p-3 bg-gray-800 rounded" />
            </div>
            <input type="file" className="w-full p-3 bg-gray-800 rounded" />
          </div>
        </div>

        <button disabled={loading} className="w-full py-4 bg-yellow-600 rounded-xl font-bold hover:bg-yellow-500">
          {loading ? "جاري الإنشاء..." : "حفظ العميل والطلب"}
        </button>
      </form>
    </div>
  );
}