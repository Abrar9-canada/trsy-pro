/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast, Toaster } from 'react-hot-toast';
import { CheckCircle2, Clock, Bell, Loader2, MessageCircle } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    setNotifications(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  async function markAsProcessed(id: number) {
    const { error } = await supabase.from('notifications').update({ status: 'تمت المعالجة' }).eq('id', id);
    if (!error) {
      toast.success("تم تحديث الحالة");
      fetchNotifications();
    } else toast.error("حدث خطأ");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Bell className="text-yellow-500" /> مركز معالجة طلبات السحب
      </h1>

      <div className="bg-[#121212] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <table className="w-full text-right">
          <thead className="bg-[#1a1a1a] text-gray-400 text-xs uppercase">
            <tr>
              <th className="p-6">التاريخ</th>
              <th className="p-6">الرسالة</th>
              <th className="p-6">الحالة</th>
              <th className="p-6 text-center">الإجراء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {notifications.map((n) => (
              <tr key={n.id} className="hover:bg-white/5 transition">
                <td className="p-6 text-sm text-gray-400">{new Date(n.created_at).toLocaleDateString('ar-SA')}</td>
                <td className="p-6 font-medium">{n.message}</td>
                <td className="p-6">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${n.status === 'تمت المعالجة' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    {n.status === 'تمت المعالجة' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                    {n.status}
                  </span>
                </td>
                <td className="p-6 flex justify-center gap-2">
                  {n.status !== 'تمت المعالجة' && (
                    <button onClick={() => markAsProcessed(n.id)} className="bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold text-sm">تأكيد</button>
                  )}
                  {/* زر واتساب يظهر هنا */}
                  <button onClick={() => window.open(`https://wa.me/${n.rep_phone}`, '_blank')} className="bg-green-600 p-2 rounded-xl hover:bg-green-700">
                    <MessageCircle size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}