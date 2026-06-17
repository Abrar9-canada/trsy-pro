/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LayoutDashboard, PlusCircle, List, Wallet, Menu, LogOut, X, UserCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function RepLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserEmail(data.user.email || "");
    });
  }, []);

  const navItems = [
    { name: 'الإحصائيات', href: '/rep/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'إضافة طلب', href: '/rep/add-client', icon: <PlusCircle size={20} /> },
    { name: 'طلباتي', href: '/rep/my-orders', icon: <List size={20} /> },
    { name: 'المحفظة', href: '/rep/wallet', icon: <Wallet size={20} /> },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("تم تسجيل الخروج");
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white font-cairo">
      {/* القائمة الجانبية (Sidebar) */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-72 bg-[#121212]/95 backdrop-blur-xl border-l border-white/5 p-6 flex flex-col justify-between transition-transform md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div>
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-yellow-600 to-yellow-400 flex items-center justify-center">
              <span className="font-bold text-black">M</span>
            </div>
            <div>
              <h2 className="font-bold text-lg">لوحة المندوب</h2>
              <p className="text-[10px] text-gray-500 truncate max-w-[150px]">{userEmail}</p>
            </div>
          </div>
          
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                onClick={() => setIsOpen(false)}
                className={`group flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 ${
                  pathname === item.href 
                    ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
                {pathname === item.href && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />}
              </Link>
            ))}
          </nav>
        </div>

        <button 
          onClick={handleSignOut}
          className="flex items-center gap-3 p-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all border border-transparent hover:border-red-500/10"
        >
          <LogOut size={20} />
          <span className="font-medium">تسجيل الخروج</span>
        </button>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 min-h-screen">
        {/* هيدر الموبايل */}
        <div className="md:hidden p-4 bg-[#121212] border-b border-white/5 flex justify-between items-center sticky top-0 z-40">
          <span className="font-bold text-yellow-500">لوحة المندوب</span>
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-white/10 rounded-lg">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
        
        {/* Overlay للموبايل */}
        {isOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />}
        
        <div className="p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}