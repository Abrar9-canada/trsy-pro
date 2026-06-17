/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Toaster } from 'react-hot-toast';
import { LayoutDashboard, Users, TrendingUp, Wallet, Award, Loader2, CheckCircle2 } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // 1. جلب كافة الطلبات مع تفاصيلها المالية
      const { data: clients } = await supabase.from('clients').select('*');
      // 2. جلب كافة المناديب
      const { data: reps } = await supabase.from('profiles').select('*').eq('role', 'representative');
      
      if (clients && reps) {
        // حساب الإحصائيات المالية بدقة
        const releasedEarnings = clients.filter(c => c.payment_status === 'released').reduce((sum, c) => sum + (Number(c.commission_amount) || 0), 0);
        const restrictedEarnings = clients.filter(c => c.payment_status === 'restricted').reduce((sum, c) => sum + (Number(c.commission_amount) || 0), 0);

        // ترتيب المناديب بناءً على أدائهم الفعلي (المبالغ المحررة لهم)
        const leaderboard = reps.map(r => {
          const repEarnings = clients
            .filter(c => c.user_id === r.id && c.payment_status === 'released')
            .reduce((sum, c) => sum + (Number(c.commission_amount) || 0), 0);
          return { name: r.full_name, performance: repEarnings };
        }).sort((a, b) => b.performance - a.performance);

        setStats({
          totalClients: clients.length,
          totalReps: reps.length,
          releasedEarnings,
          restrictedEarnings,
          leaderboard
        });
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-yellow-500"><Loader2 className="animate-spin" size={48} /></div>;

  return (
    <div className="p-6 md:p-10 bg-[#0a0a0a] min-h-screen text-white w-full overflow-x-hidden">
      <Toaster position="top-right" />
      
      <header className="mb-10">
        <h1 className="text-3xl md:text-5xl font-bold">لوحة الإدارة</h1>
        <p className="text-gray-400 text-lg mt-2">متابعة الأداء والتدفقات المالية</p>
      </header>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="إجمالي الطلبات" value={stats.totalClients} icon={<LayoutDashboard size={24} className="text-yellow-500" />} />
        <StatCard title="المناديب" value={stats.totalReps} icon={<Users size={24} className="text-violet-500" />} />
        <StatCard title="أرباح محررة" value={`${stats.releasedEarnings.toLocaleString()} ر.س`} icon={<TrendingUp size={24} className="text-green-500" />} />
        <StatCard title="مبالغ مقيدة" value={`${stats.restrictedEarnings.toLocaleString()} ر.س`} icon={<Wallet size={24} className="text-red-500" />} />
      </div>

      {/* لوحة ترتيب المناديب */}
      <div className="bg-[#121212] p-8 rounded-3xl border border-white/5 w-full">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <Award className="text-yellow-500" size={28} /> قائمة المتصدرين (الأرباح المحررة)
        </h2>
        <div className="space-y-4">
          {stats.leaderboard.map((rep: any, i: number) => (
            <div key={i} className="flex items-center gap-4 p-5 bg-[#0a0a0a] rounded-2xl border border-white/5 hover:border-yellow-500/20 transition">
              <span className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg ${i === 0 ? 'bg-yellow-500 text-black' : 'bg-[#1a1a1a]'}`}>
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="font-bold text-xl">{rep.name}</p>
              </div>
              <span className="font-mono font-bold text-green-500 text-lg">{rep.performance.toLocaleString()} ر.س</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string | number, icon: any }) {
  return (
    <div className="p-6 md:p-8 bg-[#121212] rounded-3xl border border-white/5 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <span className="text-gray-400 text-sm uppercase tracking-wider">{title}</span>
        {icon}
      </div>
      <p className="text-2xl md:text-3xl font-bold truncate">{value}</p>
    </div>
  );
}