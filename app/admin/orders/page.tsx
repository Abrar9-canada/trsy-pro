/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast, Toaster } from 'react-hot-toast';
import { ClipboardList, CheckCircle2, XCircle, Loader2, AlertCircle, ChevronLeft, ChevronRight, RefreshCw, Clock } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelData, setCancelData] = useState<{id: number | null, order: any}>({ id: null, order: null });
  const [cancelReason, setCancelReason] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await supabase
      .from('clients')
      .select('*, user_id', { count: 'exact' }) 
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) toast.error("خطأ في جلب البيانات");
    else {
      setOrders(data || []);
      setTotalCount(count || 0);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  async function updateStatus(order: any, newStatus: string) {
    if (newStatus === 'ملغي' && !cancelReason) {
      setCancelData({ id: order.id, order });
      return;
    }

    const { error } = await supabase
      .from('clients')
      .update({ status: newStatus, cancellation_reason: newStatus === 'ملغي' ? cancelReason : null })
      .eq('id', order.id);

    if (error) {
      toast.error("خطأ: " + error.message);
    } else {
      toast.success("تم تحديث الحالة بنجاح");
      if (order.user_id) {
        await supabase.from('rep_notifications').insert([{ rep_id: order.user_id, message: `تحديث طلب ${order.order_ser_id}: ${newStatus}`, is_read: false }]);
      }
      setCancelData({ id: null, order: null });
      setCancelReason("");
      fetchOrders();
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <ClipboardList className="text-yellow-500" /> إدارة الطلبات
        </h1>
        <button onClick={fetchOrders} className="p-2 hover:bg-white/5 rounded-full"><RefreshCw size={20} /></button>
      </div>
      
      <div className="bg-[#121212] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-yellow-500" size={40} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-[#1a1a1a] text-gray-400 text-xs uppercase tracking-wider">
                  <th className="p-6">رقم الطلب</th>
                  <th className="p-6">العميل</th>
                  <th className="p-6">الحالة</th>
                  <th className="p-6 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition">
                    <td className="p-6 font-mono text-yellow-500 font-medium">{order.order_ser_id}</td>
                    <td className="p-6 font-bold">{order.owner_name}</td>
                    <td className="p-6">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="p-6 flex justify-center gap-2">
                      <ActionButton status="مكتمل" color="text-green-500" onClick={() => updateStatus(order, 'مكتمل')} />
                      <ActionButton status="تطوير" color="text-blue-500" onClick={() => updateStatus(order, 'تحت التطوير')} />
                      <ActionButton status="ملغي" color="text-red-500" onClick={() => updateStatus(order, 'ملغي')} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} total={Math.ceil(totalCount / limit)} onPageChange={setPage} />
      </div>

      {cancelData.id && <CancelModal reason={cancelReason} setReason={setCancelReason} onClose={() => setCancelData({id: null, order: null})} onConfirm={() => updateStatus(cancelData.order, 'ملغي')} />}
    </div>
  );
}

// مكونات فرعية لتنظيف الكود الأساسي
function StatusBadge({ status }: { status: string }) {
  const styles = {
    'مكتمل': 'bg-green-500/10 text-green-500',
    'ملغي': 'bg-red-500/10 text-red-500',
    'تحت التطوير': 'bg-blue-500/10 text-blue-500'
  } as any;
  return <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-yellow-500/10 text-yellow-500'}`}>{status || 'جديد'}</span>;
}

function ActionButton({ color, onClick, status }: any) {
  const Icons = { 'مكتمل': CheckCircle2, 'تطوير': Clock, 'ملغي': XCircle };
  const Icon = Icons[status as keyof typeof Icons];
  return <button onClick={onClick} className={`p-2 hover:bg-white/10 rounded-xl transition ${color}`} title={status}><Icon size={20} /></button>;
}

function Pagination({ page, total, onPageChange }: any) {
  return (
    <div className="flex items-center justify-between p-6 border-t border-white/5 bg-[#1a1a1a]">
      <button disabled={page === 1} onClick={() => onPageChange(page - 1)} className="p-2 bg-[#0a0a0a] rounded-xl disabled:opacity-30"><ChevronRight size={20} /></button>
      <span className="text-sm font-bold">صفحة {page} / {total || 1}</span>
      <button disabled={page >= total} onClick={() => onPageChange(page + 1)} className="p-2 bg-[#0a0a0a] rounded-xl disabled:opacity-30"><ChevronLeft size={20} /></button>
    </div>
  );
}

function CancelModal({ reason, setReason, onClose, onConfirm }: any) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#121212] p-8 rounded-3xl w-full max-w-sm border border-red-500/30">
        <h3 className="font-bold mb-4 flex items-center gap-2 text-red-500"><AlertCircle size={20} /> سبب الإلغاء</h3>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} className="w-full p-4 bg-[#0a0a0a] rounded-xl border border-white/10 mb-6 focus:border-red-500 outline-none" placeholder="اكتب السبب..." rows={3} />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 bg-gray-800 rounded-xl">إلغاء</button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-red-600 rounded-xl font-bold">تأكيد</button>
        </div>
      </div>
    </div>
  );
}