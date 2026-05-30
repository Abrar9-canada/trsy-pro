"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';

export default function OrderDetails() {
  const { id } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [order, setOrder] = useState<any>(null);
  const [comment, setComment] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    const getData = async () => {
      const { data: orderData } = await supabase.from('clients').select('*').eq('id', id).single();
      setOrder(orderData);
      const { data: comms } = await supabase.from('order_comments').select('*').eq('order_id', id).order('created_at', { ascending: true });
      setComments(comms || []);
    };
    getData();
  }, [id]);

  const addComment = async () => {
    if (!comment) return;
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('order_comments').insert([{ order_id: id, user_id: user?.id, comment, user_name: 'المندوب' }]);
    setComment("");
    window.location.reload();
  };

  if (!order) return <div className="text-white">جاري التحميل...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h1 className="text-2xl font-bold text-yellow-500 mb-4">تفاصيل الطلب: {order.order_ser_id}</h1>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <p><span className="text-gray-400">اسم العميل:</span> {order.owner_name}</p>
            <p><span className="text-gray-400">رقم العميل:</span> {order.client_ser_id}</p>
            <p><span className="text-gray-400">الحالة:</span> {order.status}</p>
            <p><span className="text-gray-400">تاريخ الإضافة:</span> {new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          <div className="mt-6 p-4 bg-gray-800 rounded">
            <h3 className="font-bold mb-2">وصف المشروع:</h3>
            <p className="text-gray-300">{order.description}</p>
          </div>
        </div>
      </div>

      {/* Timeline / التعليقات */}
      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 flex flex-col h-150">
        <h3 className="font-bold mb-4 border-b border-gray-700 pb-2">المناقشة الداخلية (Timeline)</h3>
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {comments.map((c) => (
            <div key={c.id} className={`p-3 rounded-lg ${c.user_name === 'المندوب' ? 'bg-yellow-900/20 mr-4' : 'bg-gray-800 ml-4'}`}>
              <p className="text-xs text-yellow-500 font-bold">{c.user_name}</p>
              <p className="text-sm">{c.comment}</p>
              <span className="text-[10px] text-gray-500">{new Date(c.created_at).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="اكتب ملاحظة..." className="flex-1 p-2 bg-gray-800 rounded text-sm" />
          <button onClick={addComment} className="bg-yellow-600 px-4 rounded">إرسال</button>
        </div>
      </div>
    </div>
  );
}