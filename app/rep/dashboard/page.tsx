/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Toaster } from 'react-hot-toast';
import { LayoutDashboard, TrendingUp, Wallet, CheckCircle, Clock, XCircle, Award } from 'lucide-react';

export default function RepDashboard() {
  const [stats, setStats] = useState<any>(null);

  async function calculateStats() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // استخدام الاستعلام الموحد لضمان جلب كافة طلبات المندوب
    const { data: clients } = await supabase
      .from('clients')
      .select('*')
      .or(`representative_id.eq.${user.id},user_id.eq.${user.id}`);

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
          { name: 'مكتمل', count: completed, color: '#8B5CF6' },
          { name: 'ملغي', count: cancelled, color: '#EF4444' }
        ]
      });
    }
  }

  useEffect(() => {
    calculateStats();
    const channel = supabase.channel('clients-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, () => calculateStats())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  if (!stats) return <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-yellow-500">جاري تحميل البيانات...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      <Toaster position="top-right" />
      
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/10 rounded-xl">
            <LayoutDashboard className="text-yellow-500" size={28} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">لوحة التحليلات</h1>
        </div>
      </header>
      
      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="إجمالي الأرباح" value={`${stats.totalEarnings} ر.س`} icon={<Wallet size={24} />} color="text-yellow-500" gradient="from-yellow-500/20" />
        <StatCard title="المحصل حالياً" value={`${stats.paidEarnings} ر.س`} icon={<CheckCircle size={24} />} color="text-green-500" gradient="from-green-500/20" />
        <StatCard title="كفاءة الإنجاز" value={`${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%`} icon={<Award size={24} />} color="text-purple-500" gradient="from-purple-500/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* الرسم البياني */}
        <div className="lg:col-span-2 p-6 bg-[#121212] rounded-3xl border border-white/5 shadow-2xl">
          <h2 className="mb-6 font-bold text-lg flex items-center gap-2"><TrendingUp size={18} /> أداء الطلبات</h2>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData}>
                <XAxis dataKey="name" stroke="#666" axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#1a1a1a', border: 'none', borderRadius: '12px'}} />
                <Bar dataKey="count" radius={[8, 8, 8, 8]} barSize={50}>
                  {stats.chartData.map((e: any, i: number) => <Cell key={i} fill={e.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* ملخص الحالة */}
        <div className="p-6 bg-[#121212] rounded-3xl border border-white/5 shadow-2xl flex flex-col gap-4">
          <h2 className="font-bold text-lg mb-2">توزيع الحالات</h2>
          <DetailRow label="تحت المراجعة" value={stats.pending} color="text-yellow-500" icon={<Clock size={20} />} />
          <DetailRow label="طلبات مكتملة" value={stats.completed} color="text-purple-500" icon={<CheckCircle size={20} />} />
          <DetailRow label="طلبات ملغية" value={stats.cancelled} color="text-red-500" icon={<XCircle size={20} />} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, gradient }: any) {
  return (
    <div className={`p-6 bg-gradient-to-br ${gradient} to-[#121212] border border-white/5 rounded-3xl hover:scale-[1.02] transition-transform`}>
      <div className={`${color} mb-4 p-3 bg-[#0a0a0a] w-fit rounded-2xl`}>{icon}</div>
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function DetailRow({ label, value, color, icon }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-2xl border border-white/5">
      <div className="flex items-center gap-3">
        <div className={`${color}`}>{icon}</div>
        <span className="text-gray-300">{label}</span>
      </div>
      <span className="font-bold text-lg">{value}</span>
    </div>
  );
}