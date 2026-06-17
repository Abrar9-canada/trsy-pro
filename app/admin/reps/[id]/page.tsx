/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, ArrowLeft, Phone, ShieldAlert, ShieldCheck, Wallet, ListChecks, CalendarDays } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';

export default function RepDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [rep, setRep] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  async function fetchRepDetails() {
    if (!id) return;
    const { data, error } = await supabase
      .from('profiles')
      .select(`*, clients (*)`)
      .eq('id', id)
      .single();

    if (error) toast.error("خطأ في جلب البيانات");
    else setRep(data);
    setLoading(false);
  }

  useEffect(() => { fetchRepDetails(); }, [id]);

  const stats = useMemo(() => {
    const orders = rep?.clients || [];
    const totalEarnings = orders
      .filter((o: any) => o.payment_status === 'released')
      .reduce((sum: number, o: any) => sum + (Number(o.commission_amount) || 0), 0);
    return { orders, totalEarnings };
  }, [rep]);

  async function toggleStatus(newStatus: string) {
    setActionLoading(true);
    const { error } = await supabase.from('profiles').update({ status: newStatus }).eq('id', id);
    if (error) toast.error("فشل التحديث");
    else {
      toast.success("تم تغيير حالة المندوب");
      fetchRepDetails();
    }
    setActionLoading(false);
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-yellow-500"><Loader2 className="animate-spin" size={40} /></div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      <Toaster position="top-right" />
      <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-white transition"><ArrowLeft size={20} /> عودة للقائمة</button>

      {/* الرأس */}
      <div className="bg-[#121212] p-8 rounded-3xl border border-white/10 mb-8 flex flex-col md:flex-row justify-between items-start gap-6 shadow-2xl">
        <div>
          <h2 className="text-3xl font-bold mb-2">{rep.full_name}</h2>
          <div className="flex flex-wrap gap-4 text-gray-400">
            <p className="flex items-center gap-2"><Phone size={16}/> {rep.phone}</p>
            <p className={`flex items-center gap-1 font-bold ${rep.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
              {rep.status === 'active' ? <ShieldCheck size={16}/> : <ShieldAlert size={16}/>}
              {rep.status === 'active' ? 'حساب نشط' : 'حساب مجمد'}
            </p>
          </div>
        </div>
        <button onClick={() => toggleStatus(rep.status === 'active' ? 'inactive' : 'active')} disabled={actionLoading}
          className={`px-8 py-3 rounded-2xl font-bold transition flex items-center gap-2 ${rep.status === 'active' ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white'}`}>
          {actionLoading ? <Loader2 className="animate-spin"/> : (rep.status === 'active' ? "تجميد الحساب" : "تفعيل الحساب")}
        </button>
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="إجمالي الطلبات" value={stats.orders.length} icon={<ListChecks className="text-yellow-500" />} />
        <StatCard title="الأرباح المحررة" value={`${stats.totalEarnings.toLocaleString()} ر.س`} icon={<Wallet className="text-green-500" />} />
        <StatCard title="تاريخ الانضمام" value={new Date(rep.created_at).toLocaleDateString()} icon={<CalendarDays className="text-violet-500" />} />
      </div>

      {/* الجدول */}
      <div className="bg-[#121212] rounded-3xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/5 font-bold">سجل الطلبات الأخير</div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-[#1a1a1a] text-gray-400 text-xs uppercase">
              <tr>
                <th className="p-6">العميل</th>
                <th className="p-6">الحالة المالية</th>
                <th className="p-6">العمولة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stats.orders.length > 0 ? stats.orders.map((o: any) => (
                <tr key={o.id} className="hover:bg-white/5">
                  <td className="p-6 font-bold">{o.owner_name}</td>
                  <td className="p-6"><span className={`px-3 py-1 rounded-full text-xs ${o.payment_status === 'released' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>{o.payment_status || 'معلق'}</span></td>
                  <td className="p-6 font-mono text-white">{o.commission_amount} ر.س</td>
                </tr>
              )) : <tr><td colSpan={3} className="p-10 text-center text-gray-500">لا توجد طلبات مسجلة لهذا المندوب بعد.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: any) {
  return (
    <div className="p-6 bg-[#121212] border border-white/10 rounded-3xl flex items-center gap-4">
      <div className="p-3 bg-white/5 rounded-2xl">{icon}</div>
      <div>
        <p className="text-gray-500 text-xs uppercase tracking-wider">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}