import type { Metadata, Viewport } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sarabun",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ติวความรู้ทางการประมง | แข่งขันงานเกษตรกำแพงแสน",
    template: "%s | ติวความรู้ทางการประมง",
  },
  description:
    "เว็บติวการแข่งขันความรู้ทางการประมง คณะประมง มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน ครอบคลุมทุกหมวดของข้อสอบ พร้อมข้อสอบจำลอง ทริกการแข่ง และแหล่งอ้างอิง",
  keywords: [
    "ความรู้ทางการประมง",
    "แข่งขันเกษตรกำแพงแสน",
    "คณะประมง มก",
    "ติวประมง",
    "อนุกรมวิธานปลา",
  ],
};

export const viewport: Viewport = {
  themeColor: "#0f2836",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={sarabun.variable}>
      <body className="min-h-dvh font-sans antialiased">
        <SiteHeader />
        <main className="min-h-[60dvh]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
