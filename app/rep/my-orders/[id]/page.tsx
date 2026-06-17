/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import { Send, MessageSquare, Info, Loader2, Save, Edit3, History, ArrowRight, User, CheckCircle2 } from 'lucide-react';

export default function OrderDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchData = async () => {
    if (!id) return;
    const { data: orderData } = await supabase.from('clients').select('*').eq('id', id).single();
    setOrder(orderData);
    
    const { data: comms } = await supabase.from('order_comments').select('*').eq('order_id', id).order('created_at', { ascending: true });
    setComments(comms || []);

    const { data: hist } = await supabase.from('order_history').select('*').eq('order_id', id).order('created_at', { ascending: false });
    setHistory(hist || []);
  };

  useEffect(() => { fetchData(); }, [id]);

  const addComment = async () => {
    if (!comment.trim()) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from('order_comments')
      .insert([{ order_id: id, user_id: user?.id, comment, user_name: 'المندوب' }]).select();
    
    if (error) toast.error("فشل إرسال التعليق");
    else { setComments([...comments, data![0]]); setComment(""); }
    setLoading(false);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const updates = Object.fromEntries(formData.entries());

    const { error } = await supabase.from('clients').update(updates).eq('id', id);
    await supabase.from('order_history').insert([{ order_id: id, action: "تم تحديث البيانات" }]);

    if (error) toast.error("خطأ في التحديث");
    else { 
      toast.success("تم تحديث الطلب بنجاح"); 
      setIsEditing(false); 
      fetchData(); 
    }
    setLoading(false);
  };

  if (!order) return <div className="min-h-screen flex items-center justify-center text-gold"><Loader2 className="animate-spin" size={48} /></div>;

  return (
    <div className="p-4 md:p-8 bg-[#0a0a0a] min-h-screen text-white font-cairo">
      <Toaster position="top-center" />
      
      {/* هيدر الصفحة المطور */}
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center bg-[#121212] p-4 rounded-2xl border border-white/5">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-gold transition">
          <ArrowRight size={20} /> عودة
        </button>
        <span className="text-sm text-gold font-mono">ID: {id}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        
        {/* قسم التفاصيل */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-glass p-8 border border-white/5 bg-[#121212]">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold flex items-center gap-3"><Info className="text-gold" /> تفاصيل الطلب</h1>
              <button onClick={() => setIsEditing(!isEditing)} className="text-gold border border-gold/20 px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-gold/10 transition">
                <Edit3 size={16} /> {isEditing ? "إلغاء" : "تعديل"}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <input name="owner_name" defaultValue={order.owner_name} className="w-full p-4 bg-[#0a0a0a] border border-white/10 rounded-xl focus:border-gold outline-none" />
                <textarea name="description" defaultValue={order.description} className="w-full p-4 bg-[#0a0a0a] border border-white/10 rounded-xl h-32 focus:border-gold outline-none" />
                <button disabled={loading} className="w-full p-4 bg-gold text-black rounded-xl font-bold hover:bg-yellow-500 transition">
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : "حفظ التغييرات"}
                </button>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailField label="اسم العميل" value={order.owner_name} icon={<User size={16}/>} />
                <DetailField label="الحالة" value={order.lead_status} icon={<CheckCircle2 size={16}/>} />
                <div className="col-span-2 p-6 bg-[#0a0a0a] rounded-2xl border border-white/5">
                  <p className="text-gray-500 text-xs mb-2">الوصف</p>
                  <p className="text-gray-200 leading-relaxed">{order.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* السجل */}
          <div className="card-glass p-6 bg-[#121212] border border-white/5 rounded-2xl">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-gold"><History size={18} /> سجل الإجراءات</h3>
            <div className="space-y-3">
              {history.map((h: any, i: number) => (
                <div key={i} className="text-sm text-gray-400 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-gold"></span> {h.action}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* المناقشة */}
        <div className="card-glass p-6 flex flex-col h-[600px] bg-[#121212] border border-white/5 rounded-2xl">
          <h3 className="font-bold mb-6 flex items-center gap-2 text-gold border-b border-white/5 pb-4">
            <MessageSquare size={20} /> المناقشة
          </h3>
          <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
            {comments.map((c: any) => (
              <div key={c.id} className="p-3 rounded-xl bg-[#0a0a0a] border border-white/5">
                <p className="text-[10px] text-gold font-bold">{c.user_name}</p>
                <p className="text-sm mt-1">{c.comment}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2 bg-[#0a0a0a] p-2 rounded-xl border border-white/5">
            <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="اكتب ملاحظة..." className="flex-1 p-2 bg-transparent outline-none text-sm" />
            <button onClick={addComment} disabled={loading} className="bg-gold text-black p-2 rounded-lg hover:bg-yellow-500 transition">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailField({ label, value, icon }: any) {
  return (
    <div className="bg-[#0a0a0a] p-4 rounded-xl border border-white/5">
      <span className="text-gray-500 text-xs flex items-center gap-2 mb-2">{icon} {label}</span>
      <span className="font-bold text-white">{value}</span>
    </div>
  );
}