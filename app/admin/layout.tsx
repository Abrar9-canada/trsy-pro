import AdminSidebar from '@/components/AdminSidebar';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#030712] text-white">
      {/* القائمة الجانبية المستقلة */}
      <AdminSidebar />
      
      {/* منطقة المحتوى الرئيسية */}
      <main className="flex-1 overflow-y-auto relative">
        {children}

        {/* الزر العائم (تم تصحيح Link) */}
        <Link 
          href="/admin/add-client" 
          className="fixed bottom-8 left-8 md:bottom-12 md:left-12 bg-yellow-600 hover:bg-yellow-500 text-black p-4 rounded-full shadow-lg shadow-yellow-500/20 transition-all hover:scale-110 z-50"
          title="إضافة عميل جديد"
        >
          <Plus size={32} strokeWidth={3} />
        </Link>
      </main>
    </div>
  );
}