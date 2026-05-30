"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast, Toaster } from 'react-hot-toast';

export default function AddOrderPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const fields = Object.fromEntries(formData.entries());

    // 1. معالجة رفع الملفات (اختياري)
    const file = (fields.file as File);
    let filePath = '';
    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop();
      filePath = `${Math.random()}.${fileExt}`;
      await supabase.storage.from('client-files').upload(filePath, file);
    }

    // 2. إرسال البيانات (الترقيم والربط سيتمان تلقائياً عبر SQL Trigger)
    const { error } = await supabase.from('clients').insert([{
      owner_name: fields.owner_name,
      phone: fields.phone,
      whatsapp: fields.whatsapp,
      business_name: fields.business_name,
      activity_type: fields.activity_type,
      location: fields.location,
      maps_url: fields.maps_url,
      instagram: fields.instagram,
      site_type: fields.site_type,
      description: fields.description,
      budget: fields.budget,
      deadline: fields.deadline,
      lead_status: fields.lead_status,
      file_url: filePath
    }]);

    if (error) toast.error("خطأ: " + error.message);
    else {
      toast.success("تم تسجيل الطلب وربطه بك تلقائياً!");
      e.currentTarget.reset();
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Toaster />
      <h1 className="text-2xl font-bold mb-6 text-yellow-500">إضافة عميل / طلب جديد</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-900 p-8 rounded-2xl border border-gray-800">
        
        {/* معلومات العميل */}
        <div className="space-y-4">
          <h3 className="font-bold border-b border-gray-700 pb-2">معلومات العميل الأساسية</h3>
          <input name="owner_name" placeholder="اسم صاحب المشروع" className="w-full p-3 bg-gray-800 rounded" required />
          <input name="phone" placeholder="رقم الهاتف" className="w-full p-3 bg-gray-800 rounded" required />
          <input name="whatsapp" placeholder="رابط الواتساب" className="w-full p-3 bg-gray-800 rounded" />
          <input name="business_name" placeholder="اسم المشروع / المحل" className="w-full p-3 bg-gray-800 rounded" required />
          <input name="location" placeholder="المدينة والمنطقة" className="w-full p-3 bg-gray-800 rounded" />
          <input name="maps_url" placeholder="رابط Google Maps" className="w-full p-3 bg-gray-800 rounded" type="url" />
        </div>

        {/* تفاصيل الطلب */}
        <div className="space-y-4">
          <h3 className="font-bold border-b border-gray-700 pb-2">تفاصيل طلب المشروع</h3>
          <select name="site_type" className="w-full p-3 bg-gray-800 rounded">
            <option>صفحة تعريفية</option>
            <option>موقع مطعم</option>
            <option>متجر إلكتروني</option>
            <option>موقع حجوزات</option>
            <option>تصميم مخصص</option>
          </select>
          <textarea name="description" placeholder="وصف الطلب والمميزات بدقة" className="w-full p-3 bg-gray-800 rounded h-24" required />
          <div className="grid grid-cols-2 gap-2">
            <input name="budget" placeholder="الميزانية" className="p-3 bg-gray-800 rounded" />
            <input name="deadline" type="date" className="p-3 bg-gray-800 rounded" />
          </div>
          <select name="lead_status" className="w-full p-3 bg-gray-800 rounded border-2 border-yellow-900">
            <option value="محتمل">الجدية: محتمل</option>
            <option value="جاد وقّع العقد">الجدية: جاد وقّع العقد</option>
            <option value="دفع الدفعة الأولى">الجدية: دفع الدفعة الأولى</option>
          </select>
          <input type="file" name="file" className="w-full text-sm" accept=".pdf,.png,.jpg" />
        </div>

        <button disabled={loading} className="md:col-span-2 py-4 bg-yellow-600 rounded-xl font-bold hover:bg-yellow-500">
          {loading ? "جاري الإرسال..." : "إنشاء الطلب والربط التلقائي"}
        </button>
      </form>
    </div>
  );
}