/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { LayoutList, Search, MessageCircle, ExternalLink, Loader2, Filter } from 'lucide-react';

export default function MyOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase
        .from('clients')
        .select('*')
        .eq('representative_id', user?.id)
        .order('created_at', { ascending: false });
      setOrders(data || []);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  // نظام البحث والفلترة الاحترافي
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        order.order_ser_id?.toString().includes(searchTerm);
      const matchesStatus = statusFilter === "الكل" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gold"><Loader2 className="animate-spin" size={40} /></div>;

  return (
    <div className="p-4 md:p-8 bg-[#0a0a0a] min-h-screen text-white">
      <div className="flex items-center gap-3 mb-8">
        <LayoutList className="text-yellow-500" size={32} />
        <h1 className="text-3xl font-bold">قائمة طلباتي</h1>
      </div>

      {/* شريط البحث والفلترة */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-[#121212] p-4 rounded-2xl border border-white/5">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-3.5 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="بحث بالاسم أو رقم الطلب..." 
            className="w-full p-3 pr-12 bg-[#0a0a0a] rounded-xl border border-white/5 text-white outline-none focus:border-yellow-500"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-[#0a0a0a] p-2 rounded-xl border border-white/5">
          <Filter className="text-gray-500 ml-2" size={18} />
          <select 
            className="bg-transparent text-sm outline-none cursor-pointer"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="الكل">كل الحالات</option>
            <option value="تحت المراجعة">تحت المراجعة</option>
            <option value="مكتمل">مكتمل</option>
            <option value="ملغي">ملغي</option>
          </select>
        </div>
      </div>

      {/* عرض الجدول */}
      <div className="hidden md:block bg-[#121212] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        <table className="w-full text-right">
          <thead className="bg-[#1a1a1a] text-gray-400 text-sm">
            <tr>
              <th className="p-6">رقم الطلب</th>
              <th className="p-6">العميل</th>
              <th className="p-6">النوع</th>
              <th className="p-6">الحالة</th>
              <th className="p-6">العمولة</th>
              <th className="p-6 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-white/5 transition-colors">
                <td className="p-6 font-mono text-gold">{order.order_ser_id}</td>
                <td className="p-6 font-bold">{order.owner_name}</td>
                <td className="p-6 text-gray-400 text-sm">{order.site_type}</td>
                <td className="p-6">
                  <span className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/20">
                    {order.status}
                  </span>
                </td>
                <td className="p-6 text-green-500 font-bold">{order.commission_amount || 0} ر.س</td>
                <td className="p-6 flex items-center justify-center gap-4">
                  <a href={`https://wa.me/${order.phone}`} target="_blank" className="text-green-500 hover:text-green-400">
                    <MessageCircle size={20} />
                  </a>
                  <Link href={`/rep/my-orders/${order.id}`} className="text-violet-500 hover:text-violet-400 font-bold text-sm flex items-center gap-1">
                    عرض <ExternalLink size={14} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* عرض البطاقات للجوال */}
      <div className="md:hidden space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-[#121212] p-5 rounded-2xl border border-white/5 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <span className="font-mono text-gold">{order.order_ser_id}</span>
              <span className="bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded text-[10px] font-bold">{order.status}</span>
            </div>
            <h3 className="font-bold text-lg mb-1">{order.owner_name}</h3>
            <p className="text-gray-400 text-sm mb-4">{order.site_type}</p>
            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <span className="text-green-500 font-bold">{order.commission_amount || 0} ر.س</span>
              <div className="flex gap-4">
                <a href={`https://wa.me/${order.phone}`} target="_blank" className="text-green-500"><MessageCircle size={20} /></a>
                <Link href={`/rep/my-orders/${order.id}`} className="text-violet-500 font-bold text-sm">عرض</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredOrders.length === 0 && (
        <div className="text-center py-20 text-gray-500">لم يتم العثور على طلبات مطابقة.</div>
      )}
    </div>
  );
}