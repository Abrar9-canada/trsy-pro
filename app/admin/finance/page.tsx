"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function FinanceAdmin() {
  const [receipt, setReceipt] = useState<File | null>(null);

  const processPayment = async (orderId: number) => {
    // 1. رفع صورة الإيصال للـ Storage
    const fileName = `receipts/${orderId}.png`;
    await supabase.storage.from('receipts').upload(fileName, receipt!);

    // 2. تحديث الحالة في قاعدة البيانات
    await supabase.from('clients').update({
        commission_status: 'مدفوعة',
        payment_receipt_url: fileName
    }).eq('id', orderId);
  };

  return (
    <div className="p-8 text-white">
        {/* قائمة الطلبات التي تحتاج دفع عمولات */}
        {/* زر لرفع الإيصال وتحديث حالة العمولة لـ "مدفوعة" */}
    </div>
  );
}