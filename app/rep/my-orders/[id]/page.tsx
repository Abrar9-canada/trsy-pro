/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';
import { Send, MessageSquare, Clock, User, Info, Loader2 } from 'lucide-react';

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      if (!id) return;
      const { data: orderData } = await supabase.from('clients').select('*').eq('id', id).single();
      setOrder(orderData);
      
      const { data: comms } = await supabase
        .from('order_comments')
        .select('*')
        .eq('order_id', id)
        .order('created_at', { ascending: true });
        
      setComments(comms || []);
    };
    getData();
  }, [id]);

  const addComment = async () => {
    if (!comment.trim()) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase.from('order_comments').insert([{ 
      order_id: id, 
      user_id: user?.id, 
      comment, 
      user_name: 'المندوب' 
    }]);
    
    setComment("");
    // تحديث المحادثة فورياً
    window.location.reload(); 
    setLoading(false);
  };

  if (!order) return <div className="min-h-screen flex items-center justify-center text-gold"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-4 md:p-8 bg-[#0a0a0a] min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        
        {/* معلومات الطلب الأساسية */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#121212] p-8 rounded-3xl border border-white/5 shadow-2xl">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-8 flex items-center gap-3">
              <Info className="text-yellow-500" /> تفاصيل الطلب: <span className="text-gold">{order.id.slice(0,8)}</span>
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <DetailField label="اسم العميل" value={order.owner_name} />
              <DetailField label="الحالة" value={order.status} />
              <DetailField label="تاريخ الإضافة" value={new Date(order.created_at).toLocaleDateString()} />
              <DetailField label="الميزانية" value={`${order.budget || 0} ر.س`} />
            </div>

            <div className="mt-8 p-6 bg-[#0a0a0a] rounded-2xl border border-white/5">
              <h3 className="font-bold mb-4 text-gray-400">وصف المشروع:</h3>
              <p className="text-gray-200 leading-relaxed">{order.description}</p>
            </div>
          </div>
        </div>

        {/* Timeline / التعليقات */}
        <div className="bg-[#121212] p-6 rounded-3xl border border-white/5 flex flex-col h-[600px] shadow-2xl">
          <h3 className="font-bold mb-6 flex items-center gap-2 text-white border-b border-white/5 pb-4">
            <MessageSquare className="text-violet-500" size={20} /> المناقشة الداخلية
          </h3>
          
          <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
            {comments.map((c) => (
              <div key={c.id} className={`p-4 rounded-2xl ${c.user_name === 'المندوب' ? 'bg-yellow-500/10 ml-4 border border-yellow-500/20' : 'bg-[#0a0a0a] mr-4 border border-white/5'}`}>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[10px] uppercase tracking-widest text-gold font-bold">{c.user_name}</p>
                  <Clock className="text-gray-600" size={10} />
                </div>
                <p className="text-sm text-gray-200">{c.comment}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2 bg-[#0a0a0a] p-2 rounded-2xl border border-white/5">
            <input 
              value={comment} 
              onChange={(e) => setComment(e.target.value)} 
              placeholder="اكتب ملاحظة..." 
              className="flex-1 p-3 bg-transparent text-white outline-none text-sm" 
            />
            <button 
              onClick={addComment} 
              disabled={loading}
              className="bg-yellow-500 hover:bg-yellow-400 text-black p-3 rounded-xl transition"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailField({ label, value }: any) {
  return (
    <div className="bg-[#0a0a0a] p-4 rounded-xl border border-white/5">
      <span className="text-gray-500 text-xs block mb-1">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}