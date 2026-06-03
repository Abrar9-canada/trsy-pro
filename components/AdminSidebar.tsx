"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LayoutDashboard, Users, ClipboardList, LogOut, Wallet, Bell, Plus } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'الرئيسية', href: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'إدارة المناديب', href: '/admin/reps', icon: <Users size={20} /> },
    { name: 'إدارة الطلبات', href: '/admin/orders', icon: <ClipboardList size={20} /> },
    { name: 'المالية', href: '/admin/finance', icon: <Wallet size={20} /> },
    { name: 'التنبيهات', href: '/admin/notifications', icon: <Bell size={20} /> },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-[#0a0a0a] border-l border-white/5 p-6 flex flex-col justify-between h-screen">
      <div>
        <h2 className="text-xl font-bold text-yellow-500 mb-10 flex items-center gap-2">
          <div className="w-3 h-8 bg-yellow-500 rounded-full" />
          لوحة الإدارة
        </h2>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`flex items-center gap-3 p-4 rounded-xl transition ${
                pathname === item.href ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <button onClick={handleSignOut} className="flex items-center gap-3 p-4 text-red-500 hover:bg-red-500/10 rounded-xl transition border border-transparent hover:border-red-500/20">
        <LogOut size={20} />
        <span>تسجيل الخروج</span>
      </button>
    </aside>
  );
}