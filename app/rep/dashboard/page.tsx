/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Toaster } from 'react-hot-toast';
import { LayoutDashboard, TrendingUp, Wallet, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function RepDashboard() {
  const [stats, setStats] = useState<any>(null);

  async function calculateStats() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: clients } = await supabase
      .from('clients')
      .select('*')
      .eq('representative_id', user.id);

    if (clients) {
      const total = clients.length;
      const completed = clients.filter(o => o.status === 'مكتمل').length;
      const pending = clients.filter(o => o.status === 'تحت المراجعة').length;
      const cancelled = clients.filter(o => o.status === 'ملغي').length;

      const totalEarnings = clients.reduce((sum, o) => sum + (Number(o.commission_amount) || 0), 0);
      const paidEarnings = clients.filter(o => o.lead_status === 'دفع الدفعة الأولى').reduce((sum, o) => sum + (Number(o.commission_amount) || 0), 0);

      setStats({
        total, pending, completed, cancelled,
        totalEarnings, paidEarnings,
        chartData: [
          { name: 'مراجعة', count: pending, color: '#D4AF37' },
          { name: 'مكتمل', count: completed, color: '#6D28D9' },
          { name: 'ملغي', count: cancelled, color: '#ef4444' }
        ]
      });
    }
  }

  useEffect(() => {
    calculateStats();
    const channel = supabase.channel('clients-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, () => {
        calculateStats();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  if (!stats) return <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-gold animate-pulse">جاري تحميل لوحة التحكم...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 lg:p-12 overflow-x-hidden">
      <Toaster position="top-right" />
      
      {/* العنوان - متجاوب الحجم */}
      <div className="flex items-center gap-3 mb-8">
        <LayoutDashboard className="text-gold" size={28} />
        <h1 className="text-2xl md:text-3xl font-bold">لوحة تحكم المندوب</h1>
      </div>
      
      {/* بطاقات الإحصائيات - Grid متجاوب */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        <StatCard title="إجمالي الطلبات" value={stats.total} icon={<TrendingUp size={20} />} color="text-gold" />
        <StatCard title="إجمالي العمولات" value={`${stats.totalEarnings} ر.س`} icon={<Wallet size={20} />} color="text-violet-500" />
        <StatCard title="المحصل (مدفوع)" value={`${stats.paidEarnings} ر.س`} icon={<CheckCircle size={20} />} color="text-green-500" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* الرسم البياني - حاوية مرنة */}
        <div className="p-6 md:p-8 bg-[#121212] rounded-3xl border border-white/5 shadow-xl">
          <h2 className="mb-6 font-bold text-lg">توزيع حالات الطلبات</h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData}>
                <XAxis dataKey="name" stroke="#666" fontSize={12} axisLine={false} tickLine={false} />
                <YAxis stroke="#666" fontSize={12} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: '12px'}} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {stats.chartData.map((e: any, i: number) => <Cell key={i} fill={e.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* التفاصيل */}
        <div className="p-6 md:p-8 bg-[#121212] rounded-3xl border border-white/5 shadow-xl flex flex-col justify-center gap-4">
          <DetailRow label="طلبات قيد المراجعة" value={stats.pending} icon={<Clock className="text-gold" size={18} />} />
          <DetailRow label="طلبات مكتملة" value={stats.completed} icon={<CheckCircle className="text-violet-500" size={18} />} />
          <DetailRow label="طلبات ملغية" value={stats.cancelled} icon={<XCircle className="text-red-500" size={18} />} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="p-5 bg-[#121212] border border-white/5 rounded-2xl hover:border-gold/30 transition-all">
      <div className={`mb-3 ${color}`}>{icon}</div>
      <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-1">{title}</h3>
      <p className="text-xl md:text-2xl font-bold">{value}</p>
    </div>
  );
}

function DetailRow({ label, value, icon }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-xl border border-white/5">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm md:text-base text-gray-300 font-medium">{label}</span>
      </div>
      <span className="font-bold text-sm bg-white/5 px-3 py-1 rounded-lg">{value}</span>
    </div>
  );
}