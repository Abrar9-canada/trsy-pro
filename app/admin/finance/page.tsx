/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast, Toaster } from 'react-hot-toast';
import { Upload, Loader2, FileImage, CheckCircle2, Wallet, RefreshCw } from 'lucide-react';

export default function FinanceAdmin() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<number | null>(null);

  const fetchPendingCommissions = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .neq('commission_status', 'مدفوعة')
      .order('created_at', { ascending: false });
    
    if (error) toast.error("حدث خطأ أثناء جلب البيانات");
    else setOrders(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPendingCommissions(); }, [fetchPendingCommissions]);

  const handleUpload = async (orderId: number, file: File) => {
    if (!file) return;
    setUploading(orderId);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `receipts/${orderId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('clients')
        .update({
          commission_status: 'مدفوعة',
          payment_receipt_url: fileName
        })
        .eq('id', orderId);

      if (updateError) throw updateError;

      toast.success("تم اعتماد الدفعة بنجاح");
      fetchPendingCommissions();
    } catch (err: any) {
      toast.error("خطأ: " + err.message);
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      <Toaster position="top-right" />
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Wallet className="text-green-500" /> إدارة العمولات
        </h1>
        <button onClick={fetchPendingCommissions} className="p-2 hover:bg-white/5 rounded-full text-gray-400">
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="bg-[#121212] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-20 text-center"><Loader2 className="animate-spin inline text-yellow-500" size={40} /></div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-[#1a1a1a] text-gray-400 text-xs uppercase">
                <tr>
                  <th className="p-6">رقم الطلب</th>
                  <th className="p-6">المندوب</th>
                  <th className="p-6">العمولة المستحقة</th>
                  <th className="p-6 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition">
                    <td className="p-6 font-mono text-yellow-500">{order.order_ser_id}</td>
                    <td className="p-6 font-bold">{order.representative_name || 'غير محدد'}</td>
                    <td className="p-6 text-green-400 font-bold">{Number(order.commission_amount || 0).toLocaleString()} ر.س</td>
                    <td className="p-6 flex justify-center">
                      <button 
                        disabled={uploading === order.id}
                        className={`relative cursor-pointer px-4 py-2 rounded-xl border flex items-center gap-2 transition ${uploading === order.id ? 'bg-gray-800 border-gray-700' : 'bg-green-500/10 border-green-500/20 hover:bg-green-500/20'}`}
                      >
                        {uploading === order.id ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                        <span className="text-sm">{uploading === order.id ? 'جاري الرفع...' : 'رفع الإيصال'}</span>
                        <input 
                          type="file" 
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          accept="image/*"
                          onChange={(e) => e.target.files && handleUpload(order.id, e.target.files[0])}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center text-gray-500">
            <CheckCircle2 size={48} className="mx-auto mb-4 opacity-20" />
            لا توجد عمولات معلقة حالياً. كل شيء على ما يرام!
          </div>
        )}
      </div>
    </div>
  );
}