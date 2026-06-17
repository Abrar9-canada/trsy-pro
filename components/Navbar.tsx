/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        
        {/* الشعار */}
        <Link href="/" className="text-2xl font-black text-white tracking-tighter flex items-center gap-0.5">
          SY<span className="text-yellow-500">TR</span>
        </Link>
        
        {/* الروابط للشاشات الكبيرة */}
        <div className="hidden md:flex items-center gap-8 text-gray-400">
          <Link href="/overview" className="hover:text-white transition-colors duration-300 font-medium">
            عن المنصة
          </Link>
          <Link 
            href="/login" 
            className="px-6 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-yellow-500 transition-all hover:scale-105 active:scale-95"
          >
            تسجيل الدخول
          </Link>
        </div>

        {/* زر القائمة للموبايل */}
        <button 
          className="md:hidden text-white p-2" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* القائمة المنسدلة للموبايل */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#050505] border-b border-white/5 overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-4">
              <Link 
                href="/overview" 
                className="text-lg text-gray-300 hover:text-white flex justify-between items-center py-2" 
                onClick={() => setIsOpen(false)}
              >
                عن المنصة <ChevronRight size={20} />
              </Link>
              <Link 
                href="/login" 
                className="mt-4 w-full text-center py-4 bg-yellow-500 text-black font-bold rounded-xl"
                onClick={() => setIsOpen(false)}
              >
                تسجيل الدخول
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}