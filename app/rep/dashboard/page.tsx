/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Toaster } from 'react-hot-toast';
import { LayoutDashboard, TrendingUp, Wallet, CheckCircle, Clock, XCircle, Award } from 'lucide-react';

export default function RepDashboard() {
  const [stats, setStats] = useState<any>(null);

  async function calculateStats() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

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
      const paidEarnings = clients.filter(o => o.lead_status === 'تم الدفع').reduce((sum, o) => sum + (Number(o.commission_amount) || 0), 0);

      setStats({
        total, pending, completed, cancelled,
        totalEarnings, paidEarnings,
        chartData: [
          { name: 'مراجعة', count: pending, color: '#eab308' },
          { name: 'مكتمل', count: completed, color: '#8b5cf6' },
          { name: 'ملغي', count: cancelled, color: '#ef4444' }
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

  if (!stats) return <div className="min-h-screen flex items-center justify-center bg-bg-primary text-gold">جاري تحليل البيانات...</div>;

  return (
    <div className="min-h-screen bg-bg-primary p-4 md:p-8 text-white font-cairo">
      <Toaster position="top-center" />
      
      <header className="mb-8 flex items-center gap-3">
        <LayoutDashboard className="text-gold" size={32} />
        <h1 className="text-3xl font-bold">لوحة تحكم المندوب</h1>
      </header>
      
      {/* إحصائيات الأداء */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="إجمالي الأرباح" value={`${stats.totalEarnings} ر.س`} icon={<Wallet size={24} />} color="text-gold" />
        <StatCard title="المحصل حالياً" value={`${stats.paidEarnings} ر.س`} icon={<CheckCircle size={24} />} color="text-green-500" />
        <StatCard title="كفاءة الإنجاز" value={`${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%`} icon={<Award size={24} />} color="text-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* الرسم البياني المطور */}
        <div className="lg:col-span-2 card-glass p-6">
          <h2 className="mb-6 font-bold text-xl flex items-center gap-2"><TrendingUp className="text-gold" size={20} /> أداء الطلبات الميدانية</h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData}>
                <XAxis dataKey="name" stroke="#444" axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#0f0f0f', border: '1px solid #333', borderRadius: '12px'}} />
                <Bar dataKey="count" radius={[6, 6, 6, 6]} barSize={60}>
                  {stats.chartData.map((e: any, i: number) => <Cell key={i} fill={e.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* ملخص الحالات */}
        <div className="card-glass p-6 flex flex-col gap-4">
          <h2 className="font-bold text-xl mb-2">توزيع الحالات</h2>
          <DetailRow label="تحت المراجعة" value={stats.pending} color="text-gold" icon={<Clock size={20} />} />
          <DetailRow label="طلبات مكتملة" value={stats.completed} color="text-purple-500" icon={<CheckCircle size={20} />} />
          <DetailRow label="طلبات ملغية" value={stats.cancelled} color="text-red-500" icon={<XCircle size={20} />} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="card-glass p-6 border border-white/5 hover:border-gold/30 transition-all">
      <div className={`${color} mb-4 p-3 bg-bg-primary w-fit rounded-2xl`}>{icon}</div>
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

function DetailRow({ label, value, color, icon }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-bg-primary rounded-2xl border border-white/5">
      <div className="flex items-center gap-3">
        <div className={`${color}`}>{icon}</div>
        <span className="text-gray-300 font-medium">{label}</span>
      </div>
      <span className="font-bold text-lg">{value}</span>
    </div>
  );
}