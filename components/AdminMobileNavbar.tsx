"use client";
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import AdminSidebar from './AdminSidebar'; // استيراد الشريط الذي صممناه سابقاً

export default function AdminMobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* زر القائمة للموبايل فقط */}
      <div className="md:hidden p-4 bg-[#0a0a0a] border-b border-white/5 flex justify-between items-center z-50">
        <span className="font-bold text-yellow-500">TRSY Admin</span>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* القائمة المنزلقة للموبايل */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div className="w-72 h-full bg-[#0a0a0a]" onClick={(e) => e.stopPropagation()}>
            <AdminSidebar />
          </div>
        </div>
      )}
    </>
  );
}