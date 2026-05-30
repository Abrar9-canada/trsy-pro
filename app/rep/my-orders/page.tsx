"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function MyOrders() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase
        .from('clients')
        .select('*')
        .eq('representative_id', user?.id)
        .order('created_at', { ascending: false });
      setOrders(data || []);
    };
    fetchOrders();
  }, []);

  return (
    <div className="overflow-x-auto">
      <h1 className="text-2xl font-bold mb-6 text-yellow-500">قائمة طلباتي</h1>
      <table className="w-full text-right bg-gray-900 rounded-xl overflow-hidden">
        <thead className="bg-gray-800 text-yellow-500">
          <tr>
            <th className="p-4">رقم الطلب</th>
            <th className="p-4">العميل</th>
            <th className="p-4">النوع</th>
            <th className="p-4">الحالة</th>
            <th className="p-4">العمولة</th>
            <th className="p-4">التواصل</th>
            <th className="p-4">التفاصيل</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800/50">
              <td className="p-4">{order.order_ser_id}</td>
              <td className="p-4 font-bold">{order.owner_name}</td>
              <td className="p-4 text-sm">{order.site_type}</td>
              <td className="p-4"><span className="bg-yellow-900/30 text-yellow-500 px-2 py-1 rounded text-xs">{order.status}</span></td>
              <td className="p-4 text-green-500">{order.commission_amount || 0} ر.س</td>
              <td className="p-4">
                <a href={`https://wa.me/${order.phone}`} target="_blank" className="text-green-500 text-xl">💬</a>
              </td>
              <td className="p-4">
                <Link href={`/rep/my-orders/${order.id}`} className="text-blue-400 text-sm underline">عرض</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}