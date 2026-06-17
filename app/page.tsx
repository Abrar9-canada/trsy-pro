/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar'; 

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-yellow-500 selection:text-black">
      {/* 1. شريط التنقل - يظهر فقط في هذه الصفحة */}
      <Navbar />

      {/* 2. القسم الترحيبي مع تأثير التوهج */}
      <section className="relative flex flex-col items-center justify-center min-h-[85vh] text-center px-6 pt-20 overflow-hidden">
        {/* خلفية جمالية */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <h1 className="text-6xl md:text-9xl font-extrabold mb-8 tracking-tighter">
          مرحباً بك في <span className="text-yellow-500">TRSY</span>
        </h1>
        
        <p className="text-xl md:text-3xl text-gray-400 mb-12 max-w-2xl leading-relaxed font-light">
          نظامك المتكامل لإدارة العمليات الميدانية، أتمتة العمولات، والارتقاء بأداء فريقك بضغطة زر.
        </p>
        
        <Link 
          href="/login" 
          className="px-12 py-5 bg-white text-black font-bold text-lg rounded-2xl hover:bg-yellow-500 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
        >
          ابدأ الآن
        </Link>
      </section>

      {/* 3. قسم المزايا */}
      <section id="features" className="py-32 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-bold mb-20">لماذا يختار الجميع TRSY؟</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'شفافية مالية', desc: 'حساب آلي ودقيق للعمولات يضمن حقوق المندوبين دون تدخل بشري.', icon: '💰' },
              { title: 'تحكم ميداني', desc: 'تابع أداء المناديب في الميدان لحظة بلحظة مع تقارير ذكية.', icon: '📍' },
              { title: 'أمن بيانات', desc: 'نظام تشفير متطور يضمن خصوصية وسرية بياناتك الحساسة.', icon: '🛡️' }
            ].map((item, index) => (
              <div 
                key={index} 
                className="p-10 bg-[#0c0c0c] border border-white/10 rounded-[2rem] hover:border-yellow-500/50 transition-all duration-500 hover:translate-y-[-10px] group shadow-xl"
              >
                <div className="text-4xl mb-8 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-yellow-500">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 4. Footer */}
      <footer className="py-16 text-center border-t border-white/5 bg-[#0a0a0a]">
        <div className="text-2xl font-bold mb-4 text-white">
          TR<span className="text-yellow-500">SY</span>
        </div>
        <p className="text-gray-600 text-sm">© {new Date().getFullYear()} - جميع الحقوق محفوظة لمنصة TRSY</p>
      </footer>
    </div>
  );
}