"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast, Toaster } from 'react-hot-toast';

export default function WalletPage() {
  const [bankData, setBankData] = useState({ bank_name: '', account_holder: '', iban: '' });
  const [totalCommission, setTotalCommission] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWallet = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (profile) setBankData({ bank_name: profile.bank_name || '', account_holder: profile.account_holder || '', iban: profile.iban || '' });
      
      const { data: clients } = await supabase.from('clients').select('commission_amount').eq('representative_id', user.id);
      const total = clients?.reduce((sum, item) => sum + (Number(item.commission_amount) || 0), 0);
      setTotalCommission(total || 0);
    };
    fetchWallet();
  }, []);

  const saveBank = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    await supabase.from('profiles').update(bankData).eq('id', user.id);
    toast.success("تم حفظ البيانات البنكية");
  };

  const requestWithdrawal = async () => {
    if (totalCommission <= 0) {
      toast.error("لا يوجد رصيد كافٍ للسحب");
      return;
    }
    
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    // إرسال الإشعار للإدارة
    const { error } = await supabase.from('notifications').insert([{
      message: `طلب سحب أرباح جديد بمبلغ ${totalCommission} ر.س من المندوب: ${user?.email}`
    }]);

    if (error) {
      toast.error("حدث خطأ أثناء إرسال الطلب");
    } else {
      toast.success("تم إرسال طلب السحب للإدارة بنجاح!");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Toaster />
      <div className="bg-linear-to-r from-yellow-700 to-yellow-600 p-8 rounded-3xl mb-8 shadow-2xl">
        <p className="text-yellow-100 mb-2">إجمالي العمولات المستحقة</p>
        <h2 className="text-4xl font-bold text-white">{totalCommission} ر.س</h2>
        <button 
          onClick={requestWithdrawal}
          disabled={loading}
          className="mt-6 bg-white text-yellow-700 px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transition disabled:opacity-50"
        >
          {loading ? "جاري الإرسال..." : "طلب سحب الأرباح"}
        </button>
      </div>

      <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
        <h3 className="font-bold mb-6 text-yellow-500">إدارة البيانات البنكية</h3>
        <div className="space-y-4">
          <input 
            value={bankData.bank_name} 
            onChange={(e) => setBankData({...bankData, bank_name: e.target.value})} 
            placeholder="اسم البنك" 
            className="w-full p-3 bg-gray-800 rounded border border-gray-700 text-white" 
          />
          <input 
            value={bankData.account_holder} 
            onChange={(e) => setBankData({...bankData, account_holder: e.target.value})} 
            placeholder="اسم صاحب الحساب" 
            className="w-full p-3 bg-gray-800 rounded border border-gray-700 text-white" 
          />
          <input 
            value={bankData.iban} 
            onChange={(e) => setBankData({...bankData, iban: e.target.value})} 
            placeholder="رقم الآيبان (IBAN)" 
            className="w-full p-3 bg-gray-800 rounded border border-gray-700 text-white" 
          />
          <button 
            onClick={saveBank} 
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold transition text-white"
          >
            حفظ بيانات السحب
          </button>
        </div>
      </div>
    </div>
  );
}