import React from 'react';

export default function OverviewPage() {
  return (
    <div className="min-h-screen bg-dark text-white px-6 py-16">
      
      {/* القسم الرئيسي */}
      <header className="max-w-4xl mx-auto text-center mb-20">
        <h1 className="text-5xl md:text-6xl font-bold mb-8 text-transparent bg-clip-text bg-linear-to-r from-gold to-white">
          ما هي منصة TRSY؟
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
          نحن لا نقدم مجرد نظام إدارة، بل نبني جسراً من الثقة والشفافية بين الوكالات والمندوبين، 
          مستندين إلى تقنيات رقمية تضمن دقة النتائج وسرعة الإنجاز.
        </p>
      </header>

      {/* قسم القيم */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        <div className="p-10 bg-dark-light border-r-4 border-gold rounded-2xl">
          <h2 className="text-3xl font-bold mb-6 text-gold">رؤيتنا</h2>
          <p className="text-lg text-gray-200 leading-8">
            أن نصبح المعيار الذهبي في إدارة المبيعات الميدانية، حيث تتحول كل عملية بيع إلى بيانات دقيقة،
            مبنية على الوضوح الكامل في الحقوق والواجبات.
          </p>
        </div>

        <div className="p-10 bg-dark-light border-r-4 border-violet rounded-2xl">
          <h2 className="text-3xl font-bold mb-6 text-violet">رسالتنا</h2>
          <p className="text-lg text-gray-200 leading-8">
            تمكين المندوبين من تتبع أدائهم لحظياً، وتزويد المدراء بأدوات تحليلية متقدمة تجعل اتخاذ القرار 
            مبنياً على أرقام واقعية لا تحتمل الخطأ.
          </p>
        </div>
      </section>

      {/* قسم الإحصائيات */}
      <section className="max-w-6xl mx-auto mt-20 text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'العمليات المدارة', value: '10,000+' },
            { label: 'دقة العمولات', value: '100%' },
            { label: 'رضا المناديب', value: '98%' },
            { label: 'سهولة الاستخدام', value: 'ممتاز' },
          ].map((item, index) => (
            <div key={index} className="p-8 border border-gray-800 rounded-3xl bg-dark-light/50">
              <div className="text-4xl font-black text-gold mb-3">{item.value}</div>
              <div className="text-md text-gray-400 font-medium">{item.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}