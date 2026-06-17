/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Toaster } from 'react-hot-toast';
import { LayoutDashboard, Users, TrendingUp, Wallet, Award, Loader2, BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // جلب البيانات بطلب واحد متوازي
      const [clientsRes, repsRes] = await Promise.all([
        supabase.from('clients').select('*'),
        supabase.from('profiles').select('*').eq('role', 'representative')
      ]);
      
      const clients = clientsRes.data || [];
      const reps = repsRes.data || [];
      
      // حساب الإحصائيات
      const releasedEarnings = clients.filter(c => c.payment_status === 'released').reduce((sum, c) => sum + (Number(c.commission_amount) || 0), 0);
      const restrictedEarnings = clients.filter(c => c.payment_status === 'restricted').reduce((sum, c) => sum + (Number(c.commission_amount) || 0), 0);
      const pendingEarnings = clients.filter(c => c.payment_status === 'pending').reduce((sum, c) => sum + (Number(c.commission_amount) || 0), 0);

      const leaderboard = reps.map(r => ({
        name: r.full_name,
        performance: clients
          .filter(c => c.user_id === r.id && c.payment_status === 'released')
          .reduce((sum, c) => sum + (Number(c.commission_amount) || 0), 0)
      })).sort((a, b) => b.performance - a.performance);

      setStats({ totalClients: clients.length, totalReps: reps.length, releasedEarnings, restrictedEarnings, pendingEarnings, leaderboard });
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-yellow-500"><Loader2 className="animate-spin" size={48} /></div>;

  return (
    <div className="p-4 md:p-10 bg-[#0a0a0a] min-h-screen text-white">
      <Toaster position="top-right" />
      
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold">مرحباً بك، المدير</h1>
        <p className="text-gray-400 mt-2">إليك ملخص الأداء المالي والتشغيلي لنظامك</p>
      </header>

      {/* بطاقات الإحصائيات - Grid متجاوب */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard title="إجمالي الطلبات" value={stats.totalClients} icon={<LayoutDashboard size={20} />} color="text-yellow-500" />
        <StatCard title="الأرباح المحررة" value={`${stats.releasedEarnings.toLocaleString()} ر.س`} icon={<TrendingUp size={20} />} color="text-green-500" />
        <StatCard title="مبالغ مقيدة" value={`${stats.restrictedEarnings.toLocaleString()} ر.س`} icon={<Wallet size={20} />} color="text-red-500" />
        <StatCard title="قيد الانتظار" value={`${stats.pendingEarnings.toLocaleString()} ر.س`} icon={<BarChart3 size={20} />} color="text-blue-500" />
      </div>

      {/* لوحة المتصدرين */}
      <div className="bg-[#121212] p-6 md:p-8 rounded-3xl border border-white/5">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Award className="text-yellow-500" /> قائمة المتصدرين (العمولات)
        </h2>
        {stats.leaderboard.length > 0 ? (
          <div className="space-y-3">
            {stats.leaderboard.map((rep: any, i: number) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-[#0a0a0a] rounded-2xl border border-white/5 hover:border-yellow-500/30 transition">
                <span className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold ${i === 0 ? 'bg-yellow-500 text-black' : 'bg-[#1a1a1a] text-gray-400'}`}>
                  {i + 1}
                </span>
                <span className="font-semibold text-lg flex-1">{rep.name}</span>
                <span className="font-mono font-bold text-green-400">{rep.performance.toLocaleString()} ر.س</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10">لا توجد بيانات متاحة حالياً</p>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="p-6 bg-[#121212] rounded-3xl border border-white/5 hover:border-white/10 transition flex flex-col gap-2">
      <div className={`flex items-center gap-2 ${color}`}>{icon} <span className="text-xs uppercase tracking-widest text-gray-400">{title}</span></div>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}