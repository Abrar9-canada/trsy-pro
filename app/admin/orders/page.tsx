"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast, Toaster } from 'react-hot-toast';

export default function AdminOrdersPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([]);
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const { data } = await supabase.from('clients').select('*');
    setOrders(data || []);
  }

  async function updateStatus(id: number, newStatus: string) {
    if (newStatus === 'ملغي' && !cancelReason) {
      setCancelId(id);
      return;
    }

    const { error } = await supabase
      .from('clients')
      .update({ status: newStatus, cancellation_reason: cancelReason })
      .eq('id', id);

    if (error) toast.error("خطأ: " + error.message);
    else {
      toast.success("تم تحديث الحالة");
      setCancelId(null);
      setCancelReason("");
      fetchOrders();
    }
  }

  return (
    <div className="p-8 bg-gray-950 min-h-screen text-white">
      <Toaster />
      <h1 className="text-3xl font-bold mb-8 text-yellow-500">إدارة الطلبات الشاملة</h1>
      
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-gray-800 text-gray-300 uppercase text-xs">
            <tr>
              <th className="p-4">الطلب</th>
              <th className="p-4">العميل</th>
              <th className="p-4">الحالة</th>
              <th className="p-4">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="p-4">{order.order_ser_id}</td>
                <td className="p-4 font-bold">{order.owner_name}</td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">{order.status}</span>
                </td>
                <td className="p-4 flex gap-2">
                  {['مكتمل', 'ملغي', 'تحت التطوير'].map(status => (
                    <button 
                      key={status}
                      onClick={() => updateStatus(order.id, status)}
                      className={`px-3 py-1 rounded text-xs ${status === 'ملغي' ? 'bg-red-900' : 'bg-blue-900'}`}
                    >
                      {status}
                    </button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* نافذة سبب الإلغاء */}
      {cancelId && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-gray-900 p-8 rounded-2xl w-96 border border-red-500">
            <h3 className="font-bold mb-4 text-red-500">سبب الإلغاء مطلوب</h3>
            <textarea 
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-3 bg-gray-800 rounded mb-4" 
              placeholder="اكتب سبب الإلغاء هنا..." 
            />
            <button onClick={() => updateStatus(cancelId, 'ملغي')} className="w-full bg-red-600 py-2 rounded">تأكيد الإلغاء</button>
          </div>
        </div>
      )}
    </div>
  );
}