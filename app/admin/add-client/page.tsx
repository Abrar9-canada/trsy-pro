/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast, Toaster } from 'react-hot-toast';
import { UserPlus, Loader2, DollarSign, Briefcase, User, Phone, MapPin, ChevronDown } from 'lucide-react';

export default function AddClientPage() {
  const router = useRouter();
  const [reps, setReps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    owner_name: '',
    phone: '',
    address: '',
    service_type: '',
    amount: '',
    user_id: ''
  });

  useEffect(() => {
    async function fetchReps() {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, phone') // جلبنا رقم الهاتف أيضاً
        .eq('role', 'representative');
      if (data) setReps(data);
    }
    fetchReps();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const clientData = {
      owner_name: formData.owner_name,
      phone: formData.phone,
      address: formData.address,
      service_type: formData.service_type,
      budget: Number(formData.amount),
      user_id: formData.user_id,
      lead_status: 'محتمل',
      payment_status: 'pending'
    };

    const { error } = await supabase.from('clients').insert([clientData]);

    if (error) {
      toast.error("خطأ: " + error.message);
      setLoading(false);
    } else {
      toast.success("تم إضافة العميل بنجاح!");
      
      // منطق المراسلة التلقائية
      const selectedRep = reps.find(r => r.id === formData.user_id);
      if (selectedRep && selectedRep.phone) {
        const message = `مرحباً ${selectedRep.full_name}، تم تعيين عميل جديد لك: ${formData.owner_name}. الهاتف: ${formData.phone}. الخدمة: ${formData.service_type}.`;
        const formattedPhone = selectedRep.phone.replace(/^0+/, '966');
        window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
      }

      router.push('/admin/orders');
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-12">
      <Toaster position="top-right" />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <UserPlus className="text-yellow-500" /> إضافة عميل جديد
        </h1>

        <form onSubmit={handleSubmit} className="bg-[#121212] p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="اسم العميل" icon={<User size={18}/>} placeholder="أدخل اسم العميل" onChange={(v: any) => setFormData({...formData, owner_name: v})} />
            <InputField label="رقم الهاتف" icon={<Phone size={18}/>} type="tel" placeholder="05xxxxxxxx" onChange={(v: any) => setFormData({...formData, phone: v})} />
          </div>

          <InputField label="العنوان" icon={<MapPin size={18}/>} placeholder="مدينة، حي، شارع" onChange={(v: any) => setFormData({...formData, address: v})} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="نوع الخدمة" icon={<Briefcase size={18}/>} placeholder="مثال: تسويق، تصميم..." onChange={(v: any) => setFormData({...formData, service_type: v})} />
            <InputField label="قيمة الميزانية ($)" icon={<DollarSign size={18}/>} type="number" placeholder="500" onChange={(v: any) => setFormData({...formData, amount: v})} />
          </div>

          <div>
            <label className="block mb-3 text-sm text-gray-400 font-medium">المندوب المسؤول</label>
            <select required className="w-full p-4 bg-[#0a0a0a] border border-white/10 rounded-2xl text-white outline-none focus:border-yellow-500"
              onChange={(e) => setFormData({...formData, user_id: e.target.value})}>
              <option value="">-- اختر المندوب --</option>
              {reps.map((rep) => <option key={rep.id} value={rep.id}>{rep.full_name}</option>)}
            </select>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : "حفظ العميل ومراسلة المندوب واتساب"}
          </button>
        </form>
      </div>
    </div>
  );
}

function InputField({ label, icon, onChange, type = "text", placeholder }: any) {
  return (
    <div>
      <label className="block mb-2 text-sm text-gray-400 flex items-center gap-2">{icon} {label}</label>
      <input type={type} required placeholder={placeholder} className="w-full p-4 bg-[#0a0a0a] border border-white/10 rounded-2xl text-white outline-none focus:border-yellow-500"
        onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}