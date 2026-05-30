import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark text-white font-sans">
      
      {/* القسم الترحيبي - تركيز كامل على العنوان */}
      <section className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 pt-20">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          مرحباً بك في <span className="text-gold">TRSY</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl">
          النظام الأذكى لإدارة المندوبين، أتمتة العمولات، وشفافية الأداء الميداني في منصة واحدة.
        </p>
        
        {/* زر واحد فقط كما طلبتِ */}
        <Link href="/login" className="px-10 py-4 bg-gold text-black font-bold text-lg rounded-full hover:bg-gold-light transition duration-300">
          تسجيل الدخول
        </Link>
      </section>

      {/* قسم المزايا (Features Section) */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="p-8 bg-dark-light border border-gold/30 rounded-3xl">
            <div className="text-gold text-4xl mb-4">✦</div>
            <h3 className="text-xl font-bold mb-2">شفافية مالية</h3>
            <p className="text-gray-400">حساب آلي ودقيق لعمولات المندوبين يضمن حقوق الجميع.</p>
          </div>

          <div className="p-8 bg-dark-light border border-violet/30 rounded-3xl">
            <div className="text-violet text-4xl mb-4">✧</div>
            <h3 className="text-xl font-bold mb-2">إدارة ميدانية</h3>
            <p className="text-gray-400">متابعة لحظية لأداء المناديب وتطور الطلبيات في الميدان.</p>
          </div>

          <div className="p-8 bg-dark-light border border-gold/30 rounded-3xl">
            <div className="text-gold text-4xl mb-4">★</div>
            <h3 className="text-xl font-bold mb-2">خصوصية عالية</h3>
            <p className="text-gray-400">نظام عزل بيانات يضمن سرية معلومات كل مندوب.</p>
          </div>
        </div>
      </section>
      
      <footer className="py-10 text-center border-t border-dark-light">
        <p className="text-gray-600">© 2026 TRSY Platform - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}