/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast, Toaster } from 'react-hot-toast';
import { Trash2, UserPlus, CheckCircle, Activity, Loader2, Phone, Search, User, BarChart3, ChevronLeft } from 'lucide-react';

export default function AdminRepsPage() {
  const router = useRouter();
  const [reps, setReps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRepsWithStats = useCallback(async () => {
    setLoading(true);
    // جلب المناديب
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, phone')
      .eq('role', 'representative');

    if (error) {
      toast.error("خطأ في جلب بيانات المناديب");
    } else {
      // جلب عدد الطلبات لكل مندوب
      const { data: counts } = await supabase
        .from('clients')
        .select('user_id');

      const formattedData = data?.map((rep: any) => ({
        ...rep,
        orderCount: counts?.filter((c: any) => c.user_id === rep.id).length || 0
      }));
      setReps(formattedData || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchRepsWithStats(); }, [fetchRepsWithStats]);

  const filteredReps = useMemo(() => {
    return reps.filter(rep => 
      rep.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      rep.phone?.includes(searchTerm)
    );
  }, [reps, searchTerm]);

  async function deleteRep(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    if (!confirm("تنبيه: سيتم حذف المندوب نهائياً، هل أنت متأكد؟")) return;
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) toast.error("خطأ في عملية الحذف");
    else {
      toast.success("تم حذف المندوب بنجاح");
      fetchRepsWithStats();
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      <Toaster position="top-right" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Activity className="text-yellow-500" /> إدارة المناديب
          </h1>
          <p className="text-gray-500 mt-1">متابعة أداء فريق المبيعات</p>
        </div>
        <Link href="/admin/add-rep" className="w-full md:w-auto bg-yellow-500 text-black px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-yellow-600 transition shadow-xl shadow-yellow-500/10">
          <UserPlus size={20} /> إضافة مندوب جديد
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3 relative">
          <Search className="absolute right-4 top-4 text-gray-500" size={20} />
          <input type="text" placeholder="بحث بالاسم أو الهاتف..." className="w-full p-4 pr-12 bg-[#121212] border border-white/10 rounded-2xl outline-none focus:border-yellow-500 transition"
            onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-4 flex items-center gap-4">
          <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500"><BarChart3 size={20} /></div>
          <div>
            <p className="text-gray-500 text-xs uppercase">إجمالي المناديب</p>
            <p className="font-bold text-lg">{reps.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#121212] rounded-3xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center"><Loader2 className="animate-spin inline text-yellow-500" size={40} /></div>
        ) : filteredReps.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-[#1a1a1a] text-gray-400 text-xs uppercase">
                <tr>
                  <th className="p-6">المندوب</th>
                  <th className="p-6">رقم الهاتف</th>
                  <th className="p-6">الطلبات</th>
                  <th className="p-6">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredReps.map((rep) => (
                  <tr key={rep.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => router.push(`/admin/reps/${rep.id}`)}>
                    <td className="p-6 flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-500 font-bold">{rep.full_name[0]}</div>
                      <span className="font-bold">{rep.full_name}</span>
                    </td>
                    <td className="p-6 text-gray-400">{rep.phone || '---'}</td>
                    <td className="p-6">
                      <span className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-sm font-bold">{rep.orderCount} طلب</span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <button onClick={(e) => deleteRep(e, rep.id)} className="text-gray-500 hover:text-red-500 p-2"><Trash2 size={18} /></button>
                        <ChevronLeft size={18} className="text-gray-600" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">لا يوجد مناديب مطابقين للبحث.</div>
        )}
      </div>
    </div>
  );
}