import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import Navbar from "../components/Navbar";
import "./globals.css";

const cairo = Cairo({ 
  subsets: ["arabic"],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: "TRSY | منصة إدارة المندوبين",
  description: "النظام الأذكى لإدارة المبيعات",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} bg-dark text-white`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}