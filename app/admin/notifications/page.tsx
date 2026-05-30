/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast, Toaster } from 'react-hot-toast';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);

  // استخدام useCallback يجعل الدالة ثابتة ولا يتم إعادة إنشائها بدون داعٍ
  const fetchNotifications = useCallback(async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    setNotifications(data || []);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();
  }, [fetchNotifications]);

  async function markAsProcessed(id: number) {
    const { error } = await supabase
      .from('notifications')
      .update({ status: 'تمت المعالجة' })
      .eq('id', id);

    if (!error) {
      toast.success("تم تحديث الطلب بنجاح");
      fetchNotifications(); // إعادة جلب البيانات لتحديث الجدول
    } else {
      toast.error("حدث خطأ أثناء التحديث");
    }
  }

  return (
    <div className="p-8 bg-[#030712] min-h-screen text-white">
      <Toaster />
      <h1 className="text-3xl font-bold mb-8 text-yellow-500">مركز معالجة طلبات السحب</h1>

      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="p-4">التاريخ</th>
              <th className="p-4">الرسالة</th>
              <th className="p-4">الحالة</th>
              <th className="p-4">الإجراء</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((n) => (
              <tr key={n.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="p-4 text-sm text-gray-400">
                  {new Date(n.created_at).toLocaleDateString('ar-SA')}
                </td>
                <td className="p-4">{n.message}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${n.status === 'تمت المعالجة' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                    {n.status}
                  </span>
                </td>
                <td className="p-4">
                  {n.status === 'جديد' && (
                    <button 
                      onClick={() => markAsProcessed(n.id)}
                      className="bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded-lg text-black font-bold text-sm transition"
                    >
                      تمت المعالجة
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}