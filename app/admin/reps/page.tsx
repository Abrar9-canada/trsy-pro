"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link'; // تأكدي من هذا الاستيراد
import { supabase } from '@/lib/supabase';
import { toast, Toaster } from 'react-hot-toast';
import { Trash2, UserPlus, CheckCircle, Activity, Loader2, Phone } from 'lucide-react';

export default function AdminRepsPage() {
  const [reps, setReps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRepsWithStats();
  }, []);

  async function fetchRepsWithStats() {
    setLoading(true);
    
    // جلب البيانات مع العمود الجديد (phone) وعدد الطلبات المرتبط
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id, 
        full_name, 
        phone,
        clients(count)
      `)
      .eq('role', 'representative');

    if (error) {
      console.error(error);
      toast.error("خطأ في جلب بيانات المناديب");
    } else {
      // معالجة البيانات لاستخراج رقم الطلبات من استعلام الـ count
      const formattedData = data.map((rep: any) => ({
        ...rep,
        orderCount: rep.clients && rep.clients.length > 0 ? rep.clients[0].count : 0
      }));
      setReps(formattedData);
    }
    setLoading(false);
  }

  async function deleteRep(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا المندوب؟")) return;
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) toast.error("خطأ في الحذف: " + error.message);
    else {
      toast.success("تم حذف المندوب");
      fetchRepsWithStats();
    }
  }

  return (
    <div className="p-8">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Activity className="text-yellow-500" /> إدارة المناديب
        </h1>
        
        {/* تم تحديث الزر ليصبح Link وينقل لصفحة إضافة مندوب */}
        <Link 
          href="/admin/add-rep" 
          className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-yellow-600 transition"
        >
          <UserPlus size={20} /> إضافة مندوب جديد
        </Link>
      </div>

      <div className="bg-[#121212] rounded-3xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center"><Loader2 className="animate-spin inline text-yellow-500" size={32} /></div>
        ) : (
          <table className="w-full text-right">
            <thead className="bg-[#1a1a1a] text-gray-400 text-xs uppercase">
              <tr>
                <th className="p-6">المندوب</th>
                <th className="p-6">رقم الهاتف</th>
                <th className="p-6">الطلبات المنجزة</th>
                <th className="p-6">الحالة</th>
                <th className="p-6 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reps.map((rep) => (
                <tr key={rep.id} className="hover:bg-white/5">
                  <td className="p-6 font-bold">{rep.full_name}</td>
                  <td className="p-6 text-gray-300 flex items-center gap-2">
                    <Phone size={14} className="text-yellow-500"/> {rep.phone || 'غير محدد'}
                  </td>
                  <td className="p-6 text-yellow-500 font-mono font-bold">
                    {rep.orderCount} طلب
                  </td>
                  <td className="p-6">
                    <span className="flex items-center gap-2 text-green-500 text-sm">
                      <CheckCircle size={14}/> نشيط
                    </span>
                  </td>
                  <td className="p-6 text-center">
                    <button onClick={() => deleteRep(rep.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}