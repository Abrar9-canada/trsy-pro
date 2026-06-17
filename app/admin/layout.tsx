/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import AdminNavigation from '@/components/admin/AdminNavigation'; // تأكدي من مسار المكون

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // تحديد المسارات التي يظهر فيها الزر العائم (يمكنكِ إضافة المزيد مثل '/admin/reps')
  const showFab = pathname === '/admin/orders';

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      {/* AdminNavigation تحتوي بداخلها على:
        1. AdminSidebar (للديسكتوب)
        2. AdminMobileNavbar (للموبايل) 
      */}
      <AdminNavigation />
      
      {/* منطقة المحتوى الرئيسية */}
      <main className="flex-1 w-full relative overflow-x-hidden min-h-screen">
        <div className="p-6 md:p-10">
          {children}
        </div>

        {/* الزر العائم (FAB): يظهر في صفحات الطلبات */}
        {showFab && (
          <Link 
            href="/admin/add-order" 
            className="fixed bottom-6 left-6 md:bottom-10 md:right-auto md:left-10 bg-yellow-500 hover:bg-yellow-400 text-black p-4 md:p-5 rounded-full shadow-[0_0_30px_rgba(234,179,8,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 z-40 group"
            title="إضافة طلب جديد"
          >
            <Plus size={28} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
            
            {/* تأثير التوهج الهادئ */}
            <div className="absolute inset-0 rounded-full bg-yellow-500 animate-ping opacity-20 pointer-events-none"></div>
          </Link>
        )}
      </main>
    </div>
  );
}