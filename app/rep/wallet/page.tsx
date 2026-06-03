/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast, Toaster } from 'react-hot-toast';
import { Wallet, Landmark, CreditCard, User, Loader2, Send, Save } from 'lucide-react';

export default function WalletPage() {
  const [bankData, setBankData] = useState({ bank_name: '', account_holder: '', iban: '' });
  const [totalCommission, setTotalCommission] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

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
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { error } = await supabase.from('profiles').update(bankData).eq('id', user.id);
    setSaving(false);
    if (error) toast.error("حدث خطأ أثناء الحفظ");
    else toast.success("تم تحديث البيانات البنكية بنجاح");
  };

  const requestWithdrawal = async () => {
    if (totalCommission <= 0) {
      toast.error("لا يوجد رصيد كافٍ للسحب");
      return;
    }
    
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase.from('notifications').insert([{
      message: `طلب سحب أرباح جديد بمبلغ ${totalCommission} ر.س من المندوب: ${user?.email}`
    }]);

    if (error) toast.error("حدث خطأ أثناء إرسال الطلب");
    else toast.success("تم إرسال طلب السحب للإدارة بنجاح!");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <Toaster position="top-right" />
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* بطاقة الرصيد */}
        <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 p-8 rounded-3xl shadow-2xl shadow-yellow-900/20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Wallet size={120} />
          </div>
          <p className="text-yellow-100 font-medium mb-1">إجمالي العمولات المستحقة</p>
          <h2 className="text-5xl font-bold mb-8">{totalCommission} <span className="text-2xl opacity-70">ر.س</span></h2>
          <button 
            onClick={requestWithdrawal}
            disabled={loading}
            className="flex items-center gap-2 bg-white text-yellow-800 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
            {loading ? "جاري الإرسال..." : "طلب سحب الأرباح"}
          </button>
        </div>

        {/* بطاقة البيانات البنكية */}
        <div className="bg-[#121212] p-8 rounded-3xl border border-white/5 shadow-xl">
          <h3 className="font-bold text-lg mb-6 text-white flex items-center gap-2">
            <Landmark className="text-yellow-500" /> إدارة البيانات البنكية
          </h3>
          <div className="space-y-4">
            <Input 
              icon={<Landmark size={18} />} 
              value={bankData.bank_name} 
              onChange={(e: any) => setBankData({...bankData, bank_name: e.target.value})} 
              placeholder="اسم البنك" 
            />
            <Input 
              icon={<User size={18} />} 
              value={bankData.account_holder} 
              onChange={(e: any) => setBankData({...bankData, account_holder: e.target.value})} 
              placeholder="اسم صاحب الحساب" 
            />
            <Input 
              icon={<CreditCard size={18} />} 
              value={bankData.iban} 
              onChange={(e: any) => setBankData({...bankData, iban: e.target.value})} 
              placeholder="رقم الآيبان (IBAN)" 
            />
            <button 
              onClick={saveBank} 
              disabled={saving}
              className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition text-white flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
              حفظ البيانات البنكية
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ icon, value, onChange, placeholder }: any) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-4 text-gray-500">{icon}</div>
      <input 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        className="w-full p-4 pl-12 bg-[#0a0a0a] rounded-xl border border-white/5 text-white outline-none focus:border-yellow-500 transition" 
      />
    </div>
  );
}