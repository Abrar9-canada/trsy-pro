/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast, Toaster } from 'react-hot-toast';
import { Upload, CheckCircle2, Loader2, FileImage } from 'lucide-react';

export default function FinanceAdmin() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<number | null>(null);

  useEffect(() => {
    fetchPendingCommissions();
  }, []);

  async function fetchPendingCommissions() {
    setLoading(true);
    const { data } = await supabase
      .from('clients')
      .select('*')
      .neq('commission_status', 'مدفوعة');
    setOrders(data || []);
    setLoading(false);
  }

  const handleUpload = async (orderId: number, file: File) => {
    setUploading(orderId);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `receipts/${orderId}-${Date.now()}.${fileExt}`;

      // 1. رفع الملف للـ Storage
      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. تحديث الحالة في قاعدة البيانات
      const { error: updateError } = await supabase
        .from('clients')
        .update({
          commission_status: 'مدفوعة',
          payment_receipt_url: fileName
        })
        .eq('id', orderId);

      if (updateError) throw updateError;

      toast.success("تم تأكيد دفع العمولة ورفع الإيصال");
      fetchPendingCommissions();
    } catch (err: any) {
      toast.error("خطأ: " + err.message);
    } finally {
      setUploading(null);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-yellow-500"><Loader2 className="animate-spin" size={48} /></div>;

  return (
    <div className="p-4 md:p-8 bg-[#0a0a0a] min-h-screen text-white">
      <Toaster />
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <FileImage className="text-yellow-500" /> إدارة المدفوعات المالية
      </h1>

      <div className="bg-[#121212] rounded-3xl border border-white/5 shadow-xl overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-[#1a1a1a] text-gray-400 text-xs uppercase">
            <tr>
              <th className="p-6">رقم الطلب</th>
              <th className="p-6">المندوب</th>
              <th className="p-6">قيمة العمولة</th>
              <th className="p-6 text-center">رفع الإيصال</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-white/5 transition">
                <td className="p-6 font-mono">{order.order_ser_id}</td>
                <td className="p-6">{order.representative_name || 'غير محدد'}</td>
                <td className="p-6 text-yellow-500 font-bold">{order.commission_amount} ر.س</td>
                <td className="p-6 flex justify-center">
                  <label className="cursor-pointer bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/10 transition flex items-center gap-2">
                    {uploading === order.id ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => e.target.files && handleUpload(order.id, e.target.files[0])}
                    />
                    <span className="text-sm">رفع الإيصال</span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="p-10 text-center text-gray-500">لا توجد عمولات معلقة حالياً</div>
        )}
      </div>
    </div>
  );
}