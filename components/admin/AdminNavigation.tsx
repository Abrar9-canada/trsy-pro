"use client";

// بدلاً من './' استخدمي '../' للرجوع خطوة للخلف
import AdminSidebar from '../AdminSidebar';
import AdminMobileNavbar from '../AdminMobileNavbar';
export default function AdminNavigation() {
  return (
    <>
      {/* هذا يظهر في الشاشات الكبيرة فقط (أجهزة الكمبيوتر) */}
      <div className="hidden md:block h-screen sticky top-0">
        <AdminSidebar />
      </div>

      {/* هذا يظهر في الشاشات الصغيرة فقط (الجوال) */}
      <div className="md:hidden">
        <AdminMobileNavbar />
      </div>
    </>
  );
}