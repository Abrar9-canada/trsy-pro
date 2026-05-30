/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast, Toaster } from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // 1. جلب البيانات والإحصائيات
    async function fetchData() {
      const { data: clients } = await supabase.from('clients').select('*');
      const { data: reps } = await supabase.from('profiles').select('*').eq('role', 'representative');
      
      setStats({
        totalClients: clients?.length || 0,
        totalReps: reps?.length || 0,
        totalEarnings: clients?.reduce((sum, c) => sum + (Number(c.total_budget) || 0), 0) || 0,
        leaderboard: reps?.map(r => ({
          name: r.full_name,
          performance: Math.floor(Math.random() * 100) 
        })).sort((a, b) => b.performance - a.performance)
      });
    }
    fetchData();

    // 2. الاستماع للإشعارات الجديدة (طلبات السحب)
    const channel = supabase.channel('new-withdrawals')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications' 
      }, (payload) => {
        toast.custom(() => (
          <div className="bg-yellow-500 p-4 rounded-lg shadow-2xl text-black font-bold border border-black animate-bounce">
            🚨 طلب سحب أرباح جديد!
            <p className="text-sm font-normal">{payload.new.message}</p>
          </div>
        ), { duration: 6000 });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (!stats) return <div className="flex justify-center items-center h-screen text-yellow-500">جاري تحميل لوحة التحكم الفخمة...</div>;

  return (
    <div className="p-8 bg-[#030712] min-h-screen text-white font-sans">
      <Toaster position="top-left" />
      
      <h1 className="text-4xl font-extrabold mb-10 bg-clip-text text-transparent bg-linear-to-r from-yellow-500 to-yellow-200">
        لوحة تحكم الإدارة
      </h1>

      {/* بطاقات الإحصائيات الفخمة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard title="إجمالي الطلبات" value={stats.totalClients} />
        <StatCard title="المناديب النشطين" value={stats.totalReps} />
        <StatCard title="الأرباح الكلية" value={`${stats.totalEarnings} ر.س`} />
        <StatCard title="العمولات المستحقة" value="12,500 ر.س" />
      </div>

      {/* لوحة ترتيب المناديب */}
      <div className="bg-gray-900/50 p-8 rounded-3xl border border-gray-800 backdrop-blur-lg">
        <h2 className="text-2xl font-bold mb-6 text-yellow-500">🏆 لوحة ترتيب المناديب (Leaderboard)</h2>
        <div className="space-y-4">
          {stats.leaderboard.map((rep: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-800/40 rounded-2xl hover:bg-gray-800 transition border border-gray-700/50">
              <div className="flex items-center gap-4">
                <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${i === 0 ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`}>
                  {i + 1}
                </span>
                <span className="font-bold">{rep.name}</span>
              </div>
              <div className="w-1/3 bg-gray-700 h-2 rounded-full overflow-hidden">
                <div className="bg-yellow-500 h-full" style={{ width: `${rep.performance}%` }}></div>
              </div>
              <span className="text-sm font-mono">{rep.performance} نقطة</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// مكون البطاقة الفخمة
function StatCard({ title, value }: { title: string, value: string | number }) {
  return (
    <div className="p-8 bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:border-yellow-600 transition-all duration-300 transform hover:scale-[1.02]">
      <h4 className="text-gray-400 text-xs uppercase tracking-widest mb-2">{title}</h4>
      <p className="text-4xl font-black text-white">{value}</p>
    </div>
  );
}