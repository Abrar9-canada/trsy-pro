import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({ 
  subsets: ["arabic"],
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "TRSY | منصة إدارة المندوبين",
  description: "النظام الأذكى لإدارة المبيعات، أتمتة العمولات، وشفافية الأداء الميداني في منصة واحدة.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <body className={`${cairo.className} bg-[#0a0a0a] text-white antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}