import React from 'react';
import Link from 'next/link';

export default function OverviewPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      
      {/* زر العودة للرئيسية - في زاوية الصفحة */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/" className="px-6 py-2 bg-[#121212] border border-white/10 rounded-full text-sm text-gray-400 hover:text-white hover:border-gold transition-all duration-300">
          ← العودة للرئيسية
        </Link>
      </div>

      <main className="px-6 py-24">
        {/* القسم الرئيسي */}
        <header className="max-w-4xl mx-auto text-center mb-24">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-white leading-tight">
            ما هي منصة TRSY؟
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto font-light">
            نحن لا نقدم مجرد نظام إدارة، بل نبني جسراً من الثقة والشفافية بين الوكالات والمندوبين، 
            مستندين إلى تقنيات رقمية تضمن دقة النتائج وسرعة الإنجاز.
          </p>
        </header>

        {/* قسم القيم */}
        <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 mb-24">
          <div className="p-12 bg-[#121212] border-r-4 border-yellow-500 rounded-2xl hover:bg-[#161616] transition-colors duration-500">
            <h2 className="text-3xl font-bold mb-6 text-yellow-500">رؤيتنا</h2>
            <p className="text-lg text-gray-300 leading-8">
              أن نصبح المعيار الذهبي في إدارة المبيعات الميدانية، حيث تتحول كل عملية بيع إلى بيانات دقيقة،
              مبنية على الوضوح الكامل في الحقوق والواجبات.
            </p>
          </div>

          <div className="p-12 bg-[#121212] border-r-4 border-violet-500 rounded-2xl hover:bg-[#161616] transition-colors duration-500">
            <h2 className="text-3xl font-bold mb-6 text-violet-500">رسالتنا</h2>
            <p className="text-lg text-gray-300 leading-8">
              تمكين المندوبين من تتبع أدائهم لحظياً، وتزويد المدراء بأدوات تحليلية متقدمة تجعل اتخاذ القرار 
              مبنيّاً على أرقام واقعية لا تحتمل الخطأ.
            </p>
          </div>
        </section>

        {/* قسم الإحصائيات */}
        <section className="max-w-6xl mx-auto mb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'العمليات المدارة', value: '10,000+' },
              { label: 'دقة العمولات', value: '100%' },
              { label: 'رضا المناديب', value: '98%' },
              { label: 'سهولة الاستخدام', value: 'ممتاز' },
            ].map((item, index) => (
              <div key={index} className="p-8 border border-white/5 rounded-3xl bg-[#121212]/50 text-center hover:scale-[1.02] transition-transform duration-300">
                <div className="text-4xl font-black text-yellow-500 mb-3">{item.value}</div>
                <div className="text-sm text-gray-400 uppercase tracking-widest">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* زر الدعوة لاتخاذ إجراء */}
        <section className="max-w-2xl mx-auto text-center p-12 bg-gradient-to-b from-[#121212] to-[#0a0a0a] rounded-3xl border border-white/5">
          <h3 className="text-2xl font-bold mb-6">هل أنت جاهز لرفع كفاءة فريقك؟</h3>
          <Link href="/login" className="inline-block px-10 py-4 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)]">
            ابدأ رحلتك مع TRSY
          </Link>
        </section>
      </main>
    </div>
  );
}