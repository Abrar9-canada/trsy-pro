/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LayoutDashboard, PlusCircle, List, Wallet, Menu, LogOut } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function RepLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'الإحصائيات', href: '/rep/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'إضافة طلب', href: '/rep/add-client', icon: <PlusCircle size={20} /> },
    { name: 'طلباتي', href: '/rep/my-orders', icon: <List size={20} /> },
    { name: 'المحفظة', href: '/rep/wallet', icon: <Wallet size={20} /> },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("تم تسجيل الخروج");
    router.push('/login'); // تأكدي من مسار صفحة تسجيل الدخول لديك
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      {/* القائمة الجانبية */}
      <aside className={`hidden md:flex flex-col w-64 bg-[#121212] border-l border-white/5 p-6 justify-between`}>
        <div>
          <h2 className="text-xl font-bold text-yellow-500 mb-10 flex items-center gap-2">
            <div className="w-3 h-8 bg-yellow-500 rounded-full" />
            لوحة المندوب
          </h2>
          
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
                  pathname === item.href 
                    ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* زر تسجيل الخروج في الأسفل */}
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-3 p-4 text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
        >
          <LogOut size={20} />
          <span className="font-medium">تسجيل الخروج</span>
        </button>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 min-h-screen overflow-auto">
        <div className="md:hidden p-4 bg-[#121212] border-b border-white/5 flex justify-between items-center">
          <span className="font-bold text-yellow-500">لوحة المندوب</span>
          <button onClick={() => setIsOpen(!isOpen)}><Menu /></button>
        </div>
        
        {isOpen && (
          <div className="md:hidden bg-[#121212] p-4 flex flex-col gap-2 border-b border-white/5">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="p-3 text-gray-300" onClick={() => setIsOpen(false)}>
                {item.name}
              </Link>
            ))}
            <button onClick={handleSignOut} className="p-3 text-red-500 text-right">تسجيل الخروج</button>
          </div>
        )}
        
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}