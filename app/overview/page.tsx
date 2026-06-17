/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function OverviewPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-yellow-500 selection:text-black">
      
      {/* زر العودة للرئيسية */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/" className="px-6 py-2 bg-[#121212] border border-white/10 rounded-full text-sm text-gray-400 hover:text-white hover:border-yellow-500 transition-all duration-300 backdrop-blur-md">
          ← العودة للرئيسية
        </Link>
      </div>

      <main className="px-6 py-24">
        {/* القسم الرئيسي */}
        <header className="max-w-4xl mx-auto text-center mb-32">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-extrabold mb-8 text-white tracking-tighter leading-[1.1]"
          >
            نحن نبني <span className="text-yellow-500">الثقة</span> في الميدان
          </motion.h1>
          <p className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-2xl mx-auto font-light">
            منصة TRSY ليست مجرد أداة إدارية، بل هي النبض الرقمي الذي يربط أهداف الشركات بطموحات المناديب.
          </p>
        </header>

        {/* قسم القيم - تصميم بطاقات متطورة */}
        <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 mb-32">
          {[
            { title: 'رؤيتنا', desc: 'أن نصبح المعيار العالمي الأول في أتمتة المبيعات الميدانية، محولين التعقيد إلى بساطة رقمية.', color: 'border-yellow-500' },
            { title: 'رسالتنا', desc: 'خلق بيئة عمل يسودها الوضوح، حيث تُترجم كل حركة ميدانية إلى أرقام عادلة ومحفزة للجميع.', color: 'border-white' }
          ].map((item, i) => (
            <div key={i} className={`p-12 bg-[#0c0c0c] border-t-4 ${item.color} rounded-[2rem] hover:bg-[#121212] transition-all duration-500`}>
              <h2 className="text-3xl font-bold mb-6">{item.title}</h2>
              <p className="text-lg text-gray-400 leading-8">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* قسم الإحصائيات - إضافة لمسة جمالية */}
        <section className="max-w-6xl mx-auto mb-32">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'عملية مدارة', value: '10K+' },
              { label: 'دقة عمولات', value: '100%' },
              { label: 'رضا المناديب', value: '98%' },
              { label: 'سرعة التنفيذ', value: '0.1s' },
            ].map((item, index) => (
              <div key={index} className="p-8 border border-white/5 rounded-[2rem] bg-[#0c0c0c] text-center hover:border-yellow-500/30 transition-all">
                <div className="text-4xl font-black text-yellow-500 mb-2">{item.value}</div>
                <div className="text-xs text-gray-500 uppercase tracking-[0.2em]">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* زر الدعوة لاتخاذ إجراء */}
        <section className="max-w-2xl mx-auto text-center p-16 bg-[#0c0c0c] rounded-[3rem] border border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-yellow-500/5 blur-[100px]"></div>
          <h3 className="text-3xl font-bold mb-8">ابدأ التحول الرقمي اليوم</h3>
          <Link href="/login" className="inline-flex px-12 py-5 bg-white text-black font-bold rounded-2xl hover:bg-yellow-500 transition-all hover:scale-105">
            انضم إلى TRSY
          </Link>
        </section>
      </main>
    </div>
  );
}