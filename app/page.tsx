import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <Navbar />

      {/* القسم الترحيبي */}
      <section className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6 pt-20">
        <h1 className="text-5xl md:text-8xl font-bold mb-8 leading-tight">
          مرحباً بك في <span className="text-gold">TRSY</span>
        </h1>
        {/* زيادة حجم النص ليصبح متوسطاً مريحاً */}
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl leading-relaxed">
          النظام الأذكى لإدارة المندوبين، أتمتة العمولات، وشفافية الأداء الميداني في منصة واحدة.
        </p>
        
        <Link href="/login" className="px-12 py-5 bg-gold text-black font-bold text-xl rounded-2xl hover:scale-105 hover:bg-yellow-500 transition duration-300 shadow-[0_0_30px_rgba(202,138,4,0.4)]">
          تسجيل الدخول
        </Link>
      </section>

      {/* قسم المزايا */}
      <section className="py-24 px-8 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { icon: '✦', title: 'شفافية مالية', desc: 'حساب آلي ودقيق لعمولات المندوبين يضمن حقوق الجميع.' },
            { icon: '✧', title: 'إدارة ميدانية', desc: 'متابعة لحظية لأداء المناديب وتطور الطلبيات في الميدان.' },
            { icon: '★', title: 'خصوصية عالية', desc: 'نظام عزل بيانات يضمن سرية معلومات كل مندوب.' }
          ].map((item, index) => (
            <div key={index} className="p-10 bg-[#121212] border border-white/5 rounded-3xl hover:border-gold/30 transition-all duration-300 group">
              <div className="text-gold text-5xl mb-6">{item.icon}</div>
              {/* زيادة حجم العناوين والوصف داخل البطاقات */}
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-lg text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      
      <footer className="py-12 text-center border-t border-white/5">
        <p className="text-gray-500 text-sm">© {new Date().getFullYear()} TRSY Platform - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}