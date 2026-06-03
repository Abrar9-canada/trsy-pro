"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-5">
        {/* الشعار - حجم أكبر قليلاً ليبرز */}
        <Link href="/" className="text-3xl font-bold text-gold tracking-tight hover:opacity-80 transition">
          TRSY
        </Link>
        
        {/* قائمة الشاشات الكبيرة - خط أكبر ومساحة أريح */}
        <div className="hidden md:flex items-center text-gray-200 text-lg">
          <Link href="/overview" className="hover:text-gold transition duration-300 font-medium">
            عن المنصة
          </Link>
        </div>

        {/* زر القائمة للجوال - تصميم أوضح وأكبر */}
        <button 
          className="md:hidden text-gold font-bold text-lg p-2" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? 'إغلاق' : 'القائمة'}
        </button>
      </div>

      {/* قائمة الجوال المنسدلة - مساحة أكبر للضغط */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 p-8 flex flex-col gap-6 text-center animate-in slide-in-from-top-4 shadow-2xl">
          <Link 
            href="/overview" 
            className="text-xl text-white hover:text-gold transition font-medium" 
            onClick={() => setIsOpen(false)}
          >
            عن المنصة
          </Link>
        </div>
      )}
    </nav>
  );
}