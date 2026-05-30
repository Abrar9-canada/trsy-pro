"use client";
import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="border-b border-gray-800 bg-dark p-6 flex justify-between items-center shadow-lg">
      <Link href="/" className="text-3xl font-bold text-gold">TRSY</Link>
      
      <div className="flex gap-8 items-center text-gray-400">
        <Link href="/" className="hover:text-gold transition">الرئيسية</Link>
        <Link href="/overview" className="hover:text-gold transition">عن المنصة</Link>
        <Link href="/login" className="px-6 py-2 border border-gold text-gold rounded-full hover:bg-gold hover:text-black transition font-bold">
          تسجيل الدخول
        </Link>
      </div>
    </nav>
  );
}