import Link from 'next/link';

export default function RepLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <aside className="w-64 bg-gray-900 border-l border-gray-800 p-6 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-yellow-500 mb-6">لوحة المندوب</h2>
        <nav className="flex flex-col gap-4">
          <Link href="/rep/dashboard" className="hover:text-yellow-500">📊 الإحصائيات</Link>
          <Link href="/rep/add-client" className="hover:text-yellow-500">➕ إضافة طلب جديد</Link>
          <Link href="/rep/my-orders" className="hover:text-yellow-500">📋 طلباتي</Link>
          <Link href="/rep/wallet" className="hover:text-yellow-500">💰 المحفظة المالية</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}