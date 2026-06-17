/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast, Toaster } from 'react-hot-toast';
import { Wallet, Landmark, CreditCard, User, Loader2, Send, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function WalletPage() {
  const [bankData, setBankData] = useState({ bank_name: '', account_holder: '', iban: '' });
  const [totalCommission, setTotalCommission] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchWallet = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // جلب البيانات البنكية
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (profile) setBankData({ bank_name: profile.bank_name || '', account_holder: profile.account_holder || '', iban: profile.iban || '' });
      
      // جلب العمولات
      const { data: clients } = await supabase.from('clients').select('commission_amount').eq('representative_id', user.id);
      const total = clients?.reduce((sum, item) => sum + (Number(item.commission_amount) || 0), 0);
      setTotalCommission(total || 0);
    };
    fetchWallet();
  }, []);

  const saveBank = async () => {
    if (!bankData.bank_name || !bankData.iban) {
        toast.error("يرجى تعبئة بيانات البنك والآيبان");
        return;
    }
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
      toast.error("الرصيد الحالي لا يسمح بالسحب");
      return;
    }
    
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    // إضافة طلب السحب لجدول الإشعارات مع توثيق المبلغ
    const { error } = await supabase.from('notifications').insert([{
      message: `طلب سحب أرباح: ${totalCommission} ر.س | المندوب: ${user?.email}`,
      type: 'withdrawal_request'
    }]);

    if (error) toast.error("حدث خطأ، حاول لاحقاً");
    else toast.success("تم إرسال طلبك للإدارة، سيتم التواصل معك قريباً!");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8 font-cairo">
      <Toaster position="top-right" />
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* بطاقة الرصيد الفخمة */}
        <div className="relative bg-gradient-to-br from-[#1a1600] via-[#332a00] to-[#1a1600] p-8 rounded-3xl border border-yellow-600/20 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5">
            <Wallet size={200} />
          </div>
          <p className="text-yellow-500/80 font-bold mb-1 tracking-widest uppercase text-sm">إجمالي الأرباح المستحقة</p>
          <h2 className="text-5xl font-bold text-white mb-8">{totalCommission.toLocaleString()} <span className="text-2xl text-yellow-600">ر.س</span></h2>
          
          <button 
            onClick={requestWithdrawal}
            disabled={loading || totalCommission === 0}
            className="flex items-center gap-3 bg-yellow-600 hover:bg-yellow-500 text-black px-8 py-4 rounded-2xl font-bold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
            {loading ? "جاري المعالجة..." : "طلب سحب الأرباح"}
          </button>
        </div>

        {/* بطاقة البيانات البنكية */}
        <div className="bg-[#121212] p-8 rounded-3xl border border-white/5 shadow-xl">
          <h3 className="font-bold text-lg mb-6 text-white flex items-center gap-2">
            <Landmark className="text-yellow-600" /> المعلومات البنكية لتحويل الأرباح
          </h3>
          
          <div className="space-y-5">
            <Input icon={<Landmark size={18} />} value={bankData.bank_name} onChange={(e: any) => setBankData({...bankData, bank_name: e.target.value})} placeholder="اسم البنك (مثال: الراجحي)" />
            <Input icon={<User size={18} />} value={bankData.account_holder} onChange={(e: any) => setBankData({...bankData, account_holder: e.target.value})} placeholder="الاسم كما في الحساب البنكي" />
            <Input icon={<CreditCard size={18} />} value={bankData.iban} onChange={(e: any) => setBankData({...bankData, iban: e.target.value})} placeholder="رقم الآيبان (SA...)" />
            
            <button 
              onClick={saveBank} 
              disabled={saving}
              className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold transition text-white flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
              تحديث وحفظ البيانات البنكية
            </button>
          </div>
          
          <div className="mt-6 flex items-start gap-3 p-4 bg-yellow-900/10 rounded-xl border border-yellow-600/10">
            <AlertCircle size={20} className="text-yellow-600 flex-shrink-0" />
            <p className="text-xs text-yellow-600/70 leading-relaxed">
              تأكد من صحة رقم الآيبان لضمان وصول الحوالات المالية بدون تأخير. الإدارة لا تتحمل مسؤولية تحويل الأرباح لحسابات خاطئة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ icon, value, onChange, placeholder }: any) {
  return (
    <div className="relative group">
      <div className="absolute right-4 top-4 text-gray-500 group-focus-within:text-yellow-600 transition-colors">{icon}</div>
      <input 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        className="w-full p-4 pr-12 bg-[#0a0a0a] rounded-xl border border-white/10 text-white outline-none focus:border-yellow-600 transition" 
      />
    </div>
  );
}