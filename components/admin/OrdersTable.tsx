"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // تأكدي من مسار ملف الـ supabase client
import { Eye, Edit, Trash2, Search, Loader2 } from 'lucide-react';

export default function OrdersTable() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // جلب البيانات من Supabase عند تحميل الصفحة
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders') // اسم الجدول في قاعدة البيانات
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("خطأ في جلب البيانات:", error);
      } else {
        setOrders(data || []);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  // تصفية البيانات برقم الطلب
  const filteredOrders = orders.filter((order) =>
    order.id.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* شريط البحث */}
      <div className="bg-[#0f0f0f] p-4 rounded-2xl border border-white/5">
        <div className="relative">
          <Search className="absolute right-4 top-3.5 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="البحث برقم الطلب..." 
            className="w-full bg-[#050505] p-3 pr-12 rounded-xl border border-white/5 outline-none focus:border-yellow-500 text-white"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* الجدول */}
      <div className="overflow-x-auto bg-[#0f0f0f] rounded-2xl border border-white/5 shadow-xl min-h-[300px]">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-yellow-500" size={32} />
          </div>
        ) : (
          <table className="w-full text-right border-collapse">
            <thead className="bg-white/5 text-gray-400 text-sm uppercase">
              <tr>
                <th className="p-5">رقم الطلب</th>
                <th className="p-5">المندوب</th>
                <th className="p-5">الحالة</th>
                <th className="p-5">الإجمالي</th>
                <th className="p-5 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="text-white divide-y divide-white/5">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-5 font-bold text-yellow-500">{order.id}</td>
                  <td className="p-5">{order.rep_name}</td>
                  <td className="p-5">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-500">
                      {order.status}
                    </span>
                  </td>
                  <td className="p-5">{order.total_amount} ر.س</td>
                  <td className="p-5 flex justify-center gap-3">
                    <button className="text-gray-500 hover:text-white"><Eye size={18} /></button>
                    <button className="text-gray-500 hover:text-white"><Edit size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}