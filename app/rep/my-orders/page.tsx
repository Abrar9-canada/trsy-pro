/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import { LayoutList, Search, MessageCircle, ExternalLink, Loader2, Filter, DollarSign } from 'lucide-react';

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

        // جلب البيانات مع فلترة ذكية
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .or(`representative_id.eq.${user.id},user_id.eq.${user.id}`) // يبحث في العمودين لضمان عدم ضياع الطلبات
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

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const ownerName = (order.owner_name || "").toLowerCase();
      const orderId = (order.order_ser_id || "").toString();
      
      const matchesSearch = ownerName.includes(searchTerm.toLowerCase()) || orderId.includes(searchTerm);
      const matchesStatus = statusFilter === "الكل" || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <Loader2 className="animate-spin text-yellow-500" size={48} />
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-[#0a0a0a] min-h-screen text-white">
      <Toaster position="top-right" />
      
      {/* العنوان */}
      <div className="flex items-center gap-3 mb-8">
        <LayoutList className="text-yellow-500" size={32} />
        <h1 className="text-3xl font-bold">قائمة طلباتي ({filteredOrders.length})</h1>
      </div>

      {/* البحث والفلترة */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-[#121212] p-4 rounded-2xl border border-white/5 shadow-xl">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-3.5 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="بحث بالاسم أو رقم الطلب..." 
            className="w-full p-3 pr-12 bg-[#0a0a0a] rounded-xl border border-white/5 outline-none focus:border-yellow-500 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="bg-[#0a0a0a] p-3 rounded-xl border border-white/5 outline-none cursor-pointer"
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="الكل">كل الحالات</option>
          <option value="تحت المراجعة">تحت المراجعة</option>
          <option value="مكتمل">مكتمل</option>
          <option value="ملغي">ملغي</option>
        </select>
      </div>

      {/* الجدول الاحترافي */}
      <div className="bg-[#121212] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-[#1a1a1a] text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-6">الطلب</th>
                <th className="p-6">العميل</th>
                <th className="p-6">الحالة</th>
                <th className="p-6">العمولة</th>
                <th className="p-6 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-6 font-mono text-yellow-500">{order.order_ser_id || '---'}</td>
                  <td className="p-6 font-bold">{order.owner_name || 'غير معروف'}</td>
                  <td className="p-6">
                    <span className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-[10px] font-bold border border-yellow-500/20">
                      {order.status || 'جديد'}
                    </span>
                  </td>
                  <td className="p-6 text-green-500 font-bold flex items-center gap-1">
                    <DollarSign size={14} /> {order.commission_amount || 0}
                  </td>
                  <td className="p-6 flex items-center justify-center gap-4">
                    <a href={`https://wa.me/${order.phone}`} target="_blank" className="text-green-500 hover:text-green-400 transition-colors">
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
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-20 text-gray-500">لا توجد طلبات تطابق بحثك حالياً.</div>
        )}
      </div>
    </div>
  );
}