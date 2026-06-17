import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

// إعداد الخط مع المتغير لربطه بـ Tailwind
const cairo = Cairo({ 
  subsets: ["arabic"],
  weight: ['300', '400', '600', '700'],
  display: 'swap',
  variable: '--font-cairo', 
});

export const metadata: Metadata = {
  title: "TRSY | منصة إدارة المندوبين",
  description: "النظام الأذكى لإدارة المبيعات وأتمتة العمولات.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#eab308",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // نمرر المتغير cairo.variable هنا ليكون متاحاً في ملف CSS
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="bg-[#050505] text-white antialiased font-cairo selection:bg-yellow-500 selection:text-black min-h-screen">
        
        {/* نظام التنبيهات يعمل في كل المشروع */}
        <Toaster position="top-center" />

        {/* المحتوى الرئيسي */}
        <main>
          {children}
        </main>

      </body>
    </html>
  );
}