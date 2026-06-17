/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast, Toaster } from 'react-hot-toast';
import { Trash2, UserPlus, CheckCircle, Activity, Loader2, Phone, Search, User, BarChart3 } from 'lucide-react';

export default function AdminRepsPage() {
  const router = useRouter();
  const [reps, setReps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRepsWithStats();
  }, []);

  async function fetchRepsWithStats() {
    setLoading(true);
    // جلب المناديب مع عدد طلباتهم
    const { data, error } = await supabase
      .from('profiles')
      .select(`id, full_name, phone, clients(count)`)
      .eq('role', 'representative');

    if (error) {
      toast.error("خطأ في جلب بيانات المناديب");
    } else {
      const formattedData = data.map((rep: any) => ({
        ...rep,
        orderCount: rep.clients && rep.clients.length > 0 ? rep.clients[0].count : 0
      }));
      setReps(formattedData);
    }
    setLoading(false);
  }

  const filteredReps = useMemo(() => {
    return reps.filter(rep => 
      rep.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      rep.phone?.includes(searchTerm)
    );
  }, [reps, searchTerm]);

  async function deleteRep(e: React.MouseEvent, id: string) {
    e.stopPropagation(); // لمنع الانتقال لصفحة التفاصيل عند الضغط على الحذف
    if (!confirm("هل أنت متأكد؟ سيتم حذف المندوب نهائياً.")) return;
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) toast.error("خطأ في الحذف");
    else {
      toast.success("تم الحذف بنجاح");
      fetchRepsWithStats();
    }
  }

  return (
    <div className="p-4 md:p-8 bg-[#0a0a0a] min-h-screen text-white">
      <Toaster position="top-right" />
      
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Activity className="text-yellow-500" /> إدارة المناديب
          </h1>
          <p className="text-gray-500 mt-1">عرض ومتابعة أداء فريق المبيعات</p>
        </div>
        <Link 
          href="/admin/add-rep" 
          className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-yellow-600 transition-all shadow-lg shadow-yellow-500/20"
        >
          <UserPlus size={20} /> إضافة مندوب جديد
        </Link>
      </div>

      {/* شريط البحث والإحصائيات */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3 relative">
          <Search className="absolute right-4 top-3.5 text-gray-500" size={20} />
          <input 
            type="text" 
            placeholder="بحث بالاسم أو الهاتف..." 
            className="w-full p-3 pr-12 bg-[#121212] border border-white/10 rounded-2xl outline-none focus:border-yellow-500 transition"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-4 flex items-center gap-4">
          <BarChart3 className="text-yellow-500" />
          <div>
            <p className="text-gray-500 text-xs uppercase">إجمالي المناديب</p>
            <p className="font-bold text-xl">{reps.length}</p>
          </div>
        </div>
      </div>

      {/* الجدول */}
      <div className="bg-[#121212] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-20 text-center"><Loader2 className="animate-spin inline text-yellow-500" size={40} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-[#1a1a1a] text-gray-400 text-xs uppercase">
                <tr>
                  <th className="p-6">المندوب</th>
                  <th className="p-6">رقم الهاتف</th>
                  <th className="p-6">الطلبات</th>
                  <th className="p-6">الحالة</th>
                  <th className="p-6 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredReps.map((rep) => (
                  <tr 
                    key={rep.id} 
                    className="hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => router.push(`/admin/reps/${rep.id}`)}
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-500">
                          <User size={20} />
                        </div>
                        <span className="font-bold">{rep.full_name}</span>
                      </div>
                    </td>
                    <td className="p-6 text-gray-300 flex items-center gap-2">
                      <Phone size={14} className="text-yellow-500"/> {rep.phone || 'غير محدد'}
                    </td>
                    <td className="p-6">
                      <span className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full font-mono font-bold text-sm">
                        {rep.orderCount} طلب
                      </span>
                    </td>
                    <td className="p-6">
                      <span className="flex items-center gap-2 text-green-500 text-sm bg-green-500/10 w-fit px-3 py-1 rounded-full">
                        <CheckCircle size={14}/> نشيط
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <button 
                        onClick={(e) => deleteRep(e, rep.id)} 
                        className="text-gray-500 hover:text-red-500 transition-colors p-2 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {!loading && filteredReps.length === 0 && (
          <div className="text-center py-20 text-gray-500">لا يوجد مناديب مطابقين للبحث.</div>
        )}
      </div>
    </div>
  );
}