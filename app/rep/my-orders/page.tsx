/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import { LayoutList, Search, MessageCircle, ExternalLink, Loader2, DollarSign, Package, TrendingUp } from 'lucide-react';

export default function MyOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .or(`representative_id.eq.${user.id},user_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error("حدث خطأ أثناء تحميل الطلبات");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // حساب الإحصائيات (الإضافة المطور)
  const stats = useMemo(() => {
    const totalCommission = orders.reduce((acc, curr) => acc + (curr.commission_amount || 0), 0);
    return { total: orders.length, commission: totalCommission };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const ownerName = (order.owner_name || "").toLowerCase();
      const orderId = (order.order_ser_id || "").toString();
      const matchesSearch = ownerName.includes(searchTerm.toLowerCase()) || orderId.includes(searchTerm);
      const matchesStatus = statusFilter === "الكل" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'مكتمل': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'ملغي': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'تحت المراجعة': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <Loader2 className="animate-spin text-yellow-500" size={48} />
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-[#0a0a0a] min-h-screen text-white font-cairo">
      <Toaster position="top-right" />
      
      <div className="flex items-center gap-3 mb-8">
        <LayoutList className="text-yellow-500" size={32} />
        <h1 className="text-3xl font-bold">قائمة طلباتي</h1>
      </div>

      {/* بطاقات الإحصائيات المضافة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-[#121212] p-6 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="p-3 bg-yellow-500/10 rounded-xl"><Package className="text-yellow-500" /></div>
          <div>
            <p className="text-gray-400 text-sm">إجمالي الطلبات</p>
            <h3 className="text-2xl font-bold">{stats.total}</h3>
          </div>
        </div>
        <div className="bg-[#121212] p-6 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-xl"><TrendingUp className="text-green-500" /></div>
          <div>
            <p className="text-gray-400 text-sm">إجمالي العمولات</p>
            <h3 className="text-2xl font-bold">{stats.commission.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-[#121212] p-4 rounded-2xl border border-white/5">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-3.5 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="بحث بالاسم أو رقم الطلب..." 
            className="w-full p-3 pr-12 bg-[#0a0a0a] rounded-xl border border-white/10 outline-none focus:border-yellow-500 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="bg-[#0a0a0a] p-3 rounded-xl border border-white/10 outline-none cursor-pointer hover:bg-white/5"
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="الكل">كل الحالات</option>
          <option value="تحت المراجعة">تحت المراجعة</option>
          <option value="مكتمل">مكتمل</option>
          <option value="ملغي">ملغي</option>
        </select>
      </div>

      <div className="bg-[#121212] rounded-3xl border border-white/5 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-[#1a1a1a] text-gray-400 text-xs uppercase">
            <tr>
              <th className="p-6">الطلب</th>
              <th className="p-6">العميل</th>
              <th className="p-6">الحالة</th>
              <th className="p-6">العمولة</th>
              <th className="p-6 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-white/5 transition-all">
                <td className="p-6 font-mono text-yellow-500">{order.order_ser_id || '---'}</td>
                <td className="p-6 font-bold">{order.owner_name || 'غير معروف'}</td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(order.status)}`}>
                    {order.status || 'جديد'}
                  </span>
                </td>
                <td className="p-6 text-green-500 font-bold flex items-center gap-1">
                  <DollarSign size={14} /> {order.commission_amount?.toLocaleString() || 0}
                </td>
                <td className="p-6 flex items-center justify-center gap-4">
                  <a href={`https://wa.me/${order.phone}`} target="_blank" className="text-green-500 hover:text-green-400 transition-colors">
                    <MessageCircle size={20} />
                  </a>
                  <Link href={`/rep/my-orders/${order.id}`} className="text-violet-400 hover:text-violet-300 font-bold text-sm flex items-center gap-1">
                    عرض <ExternalLink size={14} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <div className="text-center py-20 text-gray-500 italic">لا توجد طلبات تطابق بحثك حالياً.</div>
        )}
      </div>
    </div>
  );
}