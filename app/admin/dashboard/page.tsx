/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast, Toaster } from 'react-hot-toast';
import { LayoutDashboard, Users, TrendingUp, Wallet, Bell, Award, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const { data: clients } = await supabase.from('clients').select('*');
        const { data: reps } = await supabase.from('profiles').select('*').eq('role', 'representative');
        
        setStats({
          totalClients: clients?.length || 0,
          totalReps: reps?.length || 0,
          totalEarnings: clients?.reduce((sum, c) => sum + (Number(c.total_budget) || 0), 0) || 0,
          leaderboard: reps?.map(r => ({
            name: r.full_name || 'مندوب غير مسمى',
            performance: Math.floor(Math.random() * 100) 
          })).sort((a, b) => b.performance - a.performance)
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();

    const channel = supabase.channel('admin-notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-[#1a1a1a] border border-yellow-500/50 shadow-2xl rounded-2xl p-4 flex items-center gap-4`}>
            <Bell className="text-yellow-500 animate-bounce" />
            <div>
              <p className="text-sm font-bold text-white">إشعار جديد</p>
              <p className="text-xs text-gray-400">{payload.new.message}</p>
            </div>
          </div>
        ), { duration: 8000 });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-yellow-500"><Loader2 className="animate-spin" size={48} /></div>;

  return (
    <div className="p-4 md:p-8 bg-[#0a0a0a] min-h-screen text-white">
      <Toaster position="top-right" />
      
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white">لوحة الإدارة</h1>
        <p className="text-gray-500 mt-2">مرحباً بك في لوحة التحكم المركزية</p>
      </header>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="إجمالي الطلبات" value={stats.totalClients} icon={<LayoutDashboard className="text-yellow-500" />} />
        <StatCard title="المناديب النشطين" value={stats.totalReps} icon={<Users className="text-violet-500" />} />
        <StatCard title="الأرباح الكلية" value={`${stats.totalEarnings.toLocaleString()} ر.س`} icon={<TrendingUp className="text-green-500" />} />
        <StatCard title="طلبات سحب معلقة" value="5" icon={<Wallet className="text-red-500" />} />
      </div>

      {/* لوحة ترتيب المناديب */}
      <div className="bg-[#121212] p-8 rounded-3xl border border-white/5 shadow-xl">
        <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
          <Award className="text-yellow-500" /> قائمة المتصدرين (الأداء)
        </h2>
        <div className="space-y-4">
          {stats.leaderboard.map((rep: any, i: number) => (
            <div key={i} className="flex items-center gap-6 p-4 bg-[#0a0a0a] rounded-2xl border border-white/5 hover:border-yellow-500/30 transition">
              <span className={`w-10 h-10 flex items-center justify-center rounded-2xl font-bold ${i === 0 ? 'bg-yellow-500 text-black' : 'bg-[#1a1a1a]'}`}>
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="font-bold">{rep.name}</p>
                <div className="w-full bg-white/5 h-1.5 rounded-full mt-2">
                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-300 h-full rounded-full transition-all duration-1000" style={{ width: `${rep.performance}%` }}></div>
                </div>
              </div>
              <span className="font-mono font-bold text-yellow-500">{rep.performance} نقطة</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string | number, icon: any }) {
  return (
    <div className="p-6 bg-[#121212] rounded-3xl border border-white/5 flex flex-col gap-3 hover:border-white/10 transition shadow-lg">
      <div className="flex justify-between items-center">
        <span className="text-gray-400 text-sm">{title}</span>
        {icon}
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}