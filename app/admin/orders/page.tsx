/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast, Toaster } from 'react-hot-toast';
import { ClipboardList, CheckCircle2, XCircle, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;

  // دالة إرسال الإشعار الداخلي (تستخدم user_id)
  const notifyRepresentative = async (userId: string, message: string) => {
    if (!userId) return;
    const { error } = await supabase.from('rep_notifications').insert([
      { rep_id: userId, message: message, is_read: false }
    ]);
    if (error) console.error("خطأ في الإشعار:", error);
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // تم التأكد من جلب user_id في الاستعلام
    const { data, count, error } = await supabase
      .from('clients')
      .select('*, user_id', { count: 'exact' }) 
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      toast.error("خطأ في جلب البيانات");
    } else {
      setOrders(data || []);
      setTotalCount(count || 0);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  async function updateStatus(order: any, newStatus: string) {
    if (newStatus === 'ملغي' && !cancelReason) {
      setCancelId(order.id);
      return;
    }

    const { error } = await supabase
      .from('clients')
      .update({ 
        status: newStatus, 
        cancellation_reason: newStatus === 'ملغي' ? cancelReason : null 
      })
      .eq('id', order.id);

    if (error) {
      toast.error("خطأ: " + error.message);
    } else {
      toast.success("تم تحديث الحالة وإرسال إشعار للمندوب");
      
      // إرسال الإشعار الداخلي للمندوب باستخدام user_id
      if (order.user_id) {
        await notifyRepresentative(order.user_id, `تم تحديث حالة طلبك رقم #${order.order_ser_id} إلى: ${newStatus}`);
      }

      setCancelId(null);
      setCancelReason("");
      fetchOrders();
    }
  }

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="p-4 md:p-8 bg-[#0a0a0a] min-h-screen text-white">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <ClipboardList className="text-yellow-500" /> إدارة الطلبات الشاملة
      </h1>
      
      <div className="bg-[#121212] rounded-3xl border border-white/5 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-yellow-500" size={48} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-[#1a1a1a] text-gray-400 text-xs uppercase">
                <tr>
                  <th className="p-6">رقم الطلب</th>
                  <th className="p-6">العميل</th>
                  <th className="p-6">الحالة</th>
                  <th className="p-6 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition">
                    <td className="p-6 font-mono text-yellow-500">{order.order_ser_id}</td>
                    <td className="p-6 font-bold">{order.owner_name}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === 'مكتمل' ? 'bg-green-500/10 text-green-500' : 
                        order.status === 'ملغي' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {order.status || 'جديد'}
                      </span>
                    </td>
                    <td className="p-6 flex justify-center gap-2">
                      <ActionButton status="مكتمل" color="text-green-500" onClick={() => updateStatus(order, 'مكتمل')} />
                      <ActionButton status="تحت التطوير" color="text-blue-500" onClick={() => updateStatus(order, 'تحت التطوير')} />
                      <ActionButton status="ملغي" color="text-red-500" onClick={() => updateStatus(order, 'ملغي')} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between p-6 border-t border-white/5 bg-[#1a1a1a]">
          <span className="text-sm text-gray-400">إجمالي الطلبات: {totalCount}</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 bg-[#0a0a0a] rounded-lg disabled:opacity-30 hover:bg-white/5"><ChevronRight size={20} /></button>
            <span className="px-4 py-2 bg-[#0a0a0a] rounded-lg text-sm font-bold">صفحة {page} من {totalPages || 1}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="p-2 bg-[#0a0a0a] rounded-lg disabled:opacity-30 hover:bg-white/5"><ChevronLeft size={20} /></button>
          </div>
        </div>
      </div>

      {cancelId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#121212] p-8 rounded-3xl w-full max-w-md border border-red-500/30">
            <h3 className="font-bold mb-4 text-red-500 flex items-center gap-2">
              <AlertCircle size={20} /> سبب الإلغاء مطلوب
            </h3>
            <textarea 
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-4 bg-[#0a0a0a] rounded-xl border border-white/10 mb-6 text-white outline-none focus:border-red-500" 
              placeholder="لماذا تم إلغاء هذا الطلب؟..." 
              rows={4}
            />
            <div className="flex gap-3">
              <button onClick={() => setCancelId(null)} className="flex-1 py-3 bg-gray-800 rounded-xl font-bold">إلغاء</button>
              <button onClick={() => updateStatus(orders.find(o => o.id === cancelId), 'ملغي')} className="flex-1 py-3 bg-red-600 rounded-xl font-bold">تأكيد الإلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionButton({ status, color, onClick }: any) {
  return (
    <button onClick={onClick} className={`p-2 hover:bg-white/5 rounded-xl transition ${color}`}>
      {status === 'مكتمل' ? <CheckCircle2 size={20} /> : status === 'ملغي' ? <XCircle size={20} /> : <ClipboardList size={20} />}
    </button>
  );
}