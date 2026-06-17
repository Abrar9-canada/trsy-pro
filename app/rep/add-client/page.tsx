/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast, Toaster } from 'react-hot-toast';
import { Loader2, PlusCircle, Upload, Building2, User, MapPin, Phone, Share2, MessageCircle, DollarSign, Calendar } from 'lucide-react';

export default function AddOrderPage() {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const fields = Object.fromEntries(formData.entries());

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("يجب تسجيل الدخول لإضافة عميل!");

      let filePath = null;
      const file = fields.file as File;
      
      if (file && file.size > 0) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('client-files').upload(fileName, file);
        if (uploadError) throw uploadError;
        filePath = fileName;
      }

      const { error } = await supabase.from('clients').insert({
        owner_name: fields.owner_name,
        phone: fields.phone,
        whatsapp: fields.whatsapp || null,
        business_name: fields.business_name,
        activity_type: fields.activity_type || 'غير محدد',
        location: fields.location || null,
        maps_url: fields.maps_url || null,
        instagram: fields.instagram || null,
        site_type: fields.site_type,
        description: fields.description,
        budget: fields.budget ? parseFloat(fields.budget as string) : 0,
        deadline: fields.deadline || null,
        lead_status: fields.lead_status,
        file_path: filePath,
        user_id: user.id
      });

      if (error) throw error;

      toast.success("تم تسجيل الطلب بنجاح!");
      form.reset();
      setSelectedFile(null);
    } catch (err: any) {
      toast.error("خطأ: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] p-4 md:p-8 text-white font-cairo">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <PlusCircle className="text-yellow-500" size={32} />
          <h1 className="text-2xl md:text-3xl font-bold">إضافة طلب جديد</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#0c0c0c] p-6 md:p-10 rounded-3xl border border-white/5 shadow-2xl">
          
          {/* قسم بيانات العميل */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-yellow-500 flex items-center gap-2 border-b border-white/10 pb-2">
              <User size={18} /> معلومات العميل
            </h3>
            <Input name="owner_name" label="اسم صاحب المشروع" icon={<User size={18}/>} required />
            <Input name="phone" label="رقم الهاتف" icon={<Phone size={18}/>} required />
            <Input name="whatsapp" label="رابط الواتساب" icon={<MessageCircle size={18}/>} />
            <Input name="business_name" label="اسم المشروع" icon={<Building2 size={18}/>} required />
            <Input name="location" label="المدينة والمنطقة" icon={<MapPin size={18}/>} />
            <Input name="maps_url" label="رابط Google Maps" icon={<MapPin size={18}/>} />
            <Input name="instagram" label="حساب الإنستقرام" icon={<Share2 size={18}/>} />
          </div>

          {/* قسم تفاصيل المشروع */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-yellow-500 flex items-center gap-2 border-b border-white/10 pb-2">
              <Building2 size={18} /> تفاصيل المشروع
            </h3>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-400">نوع الموقع</label>
              <select name="site_type" className="w-full p-4 bg-[#0a0a0a] border border-white/10 rounded-xl text-white outline-none focus:border-yellow-500 transition">
                <option>صفحة تعريفية</option>
                <option>موقع مطعم</option>
                <option>متجر إلكتروني</option>
                <option>موقع حجوزات</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">وصف الطلب</label>
              <textarea name="description" className="w-full p-4 bg-[#0a0a0a] border border-white/10 rounded-xl text-white h-24 outline-none focus:border-yellow-500 transition" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input name="budget" label="الميزانية" type="number" icon={<DollarSign size={18}/>} />
              <Input name="deadline" label="الموعد النهائي" type="date" icon={<Calendar size={18}/>} />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">حالة الجدية</label>
              <select name="lead_status" className="w-full p-4 bg-[#0a0a0a] border border-white/10 rounded-xl text-white outline-none focus:border-yellow-500 transition">
                <option value="محتمل">محتمل</option>
                <option value="جاد">جاد</option>
                <option value="تم الدفع">تم الدفع</option>
              </select>
            </div>

            <label className="flex items-center gap-3 p-4 bg-[#0a0a0a] border border-dashed border-white/20 rounded-xl cursor-pointer hover:border-yellow-500 transition">
              <Upload className="text-yellow-500" size={20} />
              <span className="text-gray-400 text-sm truncate">{selectedFile || "رفع ملف (PDF, PNG, JPG)"}</span>
              <input type="file" name="file" className="hidden" accept=".pdf,.png,.jpg" onChange={(e) => setSelectedFile(e.target.files?.[0]?.name || null)} />
            </label>
          </div>

          <button 
            disabled={loading} 
            className="md:col-span-2 py-4 bg-yellow-500 text-black font-bold text-lg rounded-xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "إنشاء الطلب"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Input({ name, label, placeholder, type = "text", required, icon }: any) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">{label}</label>
      <div className="relative">
        {icon && <div className="absolute right-4 top-4 text-gray-500">{icon}</div>}
        <input 
          name={name} 
          placeholder={placeholder} 
          type={type} 
          required={required}
          className={`w-full p-4 bg-[#0a0a0a] border border-white/10 rounded-xl text-white outline-none focus:border-yellow-500 transition ${icon ? 'pr-12' : ''}`} 
        />
      </div>
    </div>
  );
}