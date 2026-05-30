/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Toaster } from 'react-hot-toast';

export default function RepDashboard() {
  const [stats, setStats] = useState<any>(null);

  async function calculateStats() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // تم تغيير 'orders' إلى 'clients' حسب جدولنا الفعلي
    const { data: clients } = await supabase
      .from('clients')
      .select('*')
      .eq('representative_id', user.id);

    if (clients) {
      const total = clients.length;
      const completed = clients.filter(o => o.status === 'مكتمل').length;
      const pending = clients.filter(o => o.status === 'تحت المراجعة').length;
      const cancelled = clients.filter(o => o.status === 'ملغي').length;

      // حساب الأرباح (نفترض وجود حقل commission_amount)
      const totalEarnings = clients.reduce((sum, o) => sum + (Number(o.commission_amount) || 0), 0);
      const paidEarnings = clients.filter(o => o.lead_status === 'دفع الدفعة الأولى').reduce((sum, o) => sum + (Number(o.commission_amount) || 0), 0);

      setStats({
        total, pending, completed, cancelled,
        totalEarnings, paidEarnings,
        chartData: [
          { name: 'مراجعة', count: pending, color: '#ca8a04' },
          { name: 'مكتمل', count: completed, color: '#16a34a' },
          { name: 'ملغي', count: cancelled, color: '#dc2626' }
        ]
      });
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    calculateStats();
    
    // الاشتراك في التغييرات اللحظية
    const channel = supabase.channel('clients-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, () => {
        calculateStats();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (!stats) return <div className="p-10 text-center text-white">جاري تحميل الإحصائيات...</div>;

  return (
    <div className="p-8 bg-gray-950 text-white min-h-screen">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-8 text-yellow-500">لوحة تحكم المندوب</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="إجمالي الطلبات" value={stats.total} />
        <StatCard title="إجمالي العمولات" value={`${stats.totalEarnings} ر.س`} />
        <StatCard title="المحصل (مدفوع)" value={`${stats.paidEarnings} ر.س`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
          <h2 className="mb-6 font-bold">توزيع حالات الطلبات</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.chartData}>
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{backgroundColor: '#111', border: '1px solid #333'}} />
              <Bar dataKey="count">
                {stats.chartData.map((e: any, i: number) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="p-6 bg-gray-900 rounded-xl border border-gray-800 grid grid-cols-1 gap-2">
          <DetailRow label="طلبات قيد المراجعة" value={stats.pending} />
          <DetailRow label="طلبات مكتملة" value={stats.completed} />
          <DetailRow label="طلبات ملغية" value={stats.cancelled} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: any) {
  return (
    <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl">
      <h3 className="text-gray-400 text-sm">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: any) {
  return (
    <div className="flex justify-between p-3 border-b border-gray-800">
      <span className="text-gray-400">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}