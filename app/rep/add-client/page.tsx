/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast, Toaster } from 'react-hot-toast';
import { Loader2, PlusCircle, Upload, Building2, User, Phone, MapPin } from 'lucide-react';

export default function AddOrderPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const fields = Object.fromEntries(formData.entries());

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("يجب تسجيل الدخول لإضافة عميل!");
        setLoading(false);
        return;
      }

      let filePath = '';
      const file = fields.file as File;
      if (file && file.size > 0) {
        const fileExt = file.name.split('.').pop();
        filePath = `${Date.now()}_${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('client-files').upload(filePath, file);
        if (uploadError) throw uploadError;
      }

      const { error } = await supabase.from('clients').insert({
        owner_name: fields.owner_name,
        phone: fields.phone,
        whatsapp: fields.whatsapp,
        business_name: fields.business_name,
        activity_type: fields.activity_type || 'غير محدد',
        location: fields.location,
        maps_url: fields.maps_url,
        instagram: fields.instagram,
        site_type: fields.site_type,
        description: fields.description,
        budget: Number(fields.budget) || 0,
        deadline: fields.deadline || null,
        lead_status: fields.lead_status,
        file_path: filePath || null,
        user_id: user.id
      });

      if (error) throw error;

      toast.success("تم تسجيل الطلب بنجاح!");
      form.reset(); 
    } catch (err: any) {
      toast.error("خطأ: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <PlusCircle className="text-yellow-500" size={32} />
          <h1 className="text-3xl font-bold text-white">إضافة طلب جديد</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#121212] p-6 md:p-10 rounded-3xl border border-white/5 shadow-2xl">
          
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-gold flex items-center gap-2 border-b border-white/5 pb-2">
              <User size={18} /> معلومات العميل
            </h3>
            <Input name="owner_name" placeholder="اسم صاحب المشروع" required />
            <Input name="phone" placeholder="رقم الهاتف" required />
            <Input name="whatsapp" placeholder="رابط الواتساب" />
            <Input name="business_name" placeholder="اسم المشروع" required />
            <Input name="location" placeholder="المدينة والمنطقة" icon={<MapPin size={16} />} />
            <Input name="maps_url" placeholder="رابط Google Maps" type="url" />
          </div>

          <div className="space-y-5">
            <h3 className="text-lg font-bold text-gold flex items-center gap-2 border-b border-white/5 pb-2">
              <Building2 size={18} /> تفاصيل المشروع
            </h3>
            <select name="site_type" className="w-full p-4 bg-[#0a0a0a] border border-white/10 rounded-xl text-white outline-none focus:border-yellow-500">
              <option>صفحة تعريفية</option>
              <option>موقع مطعم</option>
              <option>متجر إلكتروني</option>
              <option>موقع حجوزات</option>
            </select>
            <textarea name="description" placeholder="وصف الطلب والمميزات بدقة" className="w-full p-4 bg-[#0a0a0a] border border-white/10 rounded-xl text-white h-28 outline-none focus:border-yellow-500" required />
            <div className="grid grid-cols-2 gap-4">
              <Input name="budget" type="number" placeholder="الميزانية" />
              <Input name="deadline" type="date" />
            </div>
            <select name="lead_status" className="w-full p-4 bg-[#0a0a0a] border border-white/10 rounded-xl text-white outline-none focus:border-yellow-500">
              <option value="محتمل">الجدية: محتمل</option>
              <option value="جاد وقّع العقد">الجدية: جاد وقّع العقد</option>
              <option value="دفع الدفعة الأولى">الجدية: دفع الدفعة الأولى</option>
            </select>
            <label className="flex items-center gap-3 p-4 bg-[#0a0a0a] border border-dashed border-white/20 rounded-xl cursor-pointer hover:border-yellow-500 transition">
              <Upload className="text-gray-500" size={20} />
              <span className="text-gray-400 text-sm">رفع ملف (PDF, PNG, JPG)</span>
              <input type="file" name="file" className="hidden" accept=".pdf,.png,.jpg" />
            </label>
          </div>

          <button 
            disabled={loading} 
            className="md:col-span-2 py-4 bg-yellow-500 text-black font-bold text-lg rounded-xl hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "إنشاء الطلب والربط التلقائي"}
          </button>
        </form>
      </div>
    </div>
  );
}

// مكون Input مخصص لإعادة الاستخدام وتوحيد الشكل
function Input({ name, placeholder, type = "text", required, icon }: any) {
  return (
    <div className="relative">
      {icon && <div className="absolute right-4 top-4 text-gray-500">{icon}</div>}
      <input 
        name={name} 
        placeholder={placeholder} 
        type={type} 
        required={required}
        className="w-full p-4 bg-[#0a0a0a] border border-white/10 rounded-xl text-white outline-none focus:border-yellow-500 transition" 
      />
    </div>
  );
}