"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/", label: "หน้าแรก" },
  { href: "/path", label: "เส้นทางอ่าน" },
  { href: "/topics", label: "เนื้อหา" },
  { href: "/photos", label: "คลังภาพ" },
  { href: "/quiz", label: "ข้อสอบจำลอง" },
  { href: "/flashcards", label: "บัตรคำ" },
  { href: "/tricks", label: "ทริกการแข่ง" },
  { href: "/competition", label: "ข้อมูลการแข่งขัน" },
  { href: "/sources", label: "แหล่งอ้างอิง" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="no-print sticky top-0 z-50 border-b border-ink-100 bg-white/85 backdrop-blur-md supports-[backdrop-filter]:bg-white/72">
      <div className="h-0.5 w-full bg-gradient-to-r from-sea-400 via-sea-600 to-sand-400" />
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-sea-600 to-sea-950 text-white shadow-[0_6px_16px_-8px_rgba(15,40,54,0.8)] transition-transform duration-300 group-hover:scale-105">
            <span
              aria-hidden
              className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-sea-300/25 blur-[2px]"
            />
            <FishMark className="relative h-5 w-5" />
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-[15px] font-semibold text-ink-900">
              ติวความรู้ทางการประมง
            </span>
            <span className="text-[11px] text-ink-500">
              งานเกษตรกำแพงแสน · คณะประมง มก.
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-0.5 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`relative rounded-md px-3 py-2 text-[13.5px] font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-sea-50 text-sea-800"
                  : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <span
                  aria-hidden
                  className="absolute inset-x-3 -bottom-[7px] h-[2.5px] rounded-full bg-gradient-to-r from-sea-400 to-sea-700"
                />
              )}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="เปิดเมนู"
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg border border-ink-200 text-ink-700 transition-colors hover:bg-ink-50 lg:hidden"
        >
          <span className="sr-only">เมนู</span>
          {open ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="animate-sweep border-t border-ink-100 bg-white px-4 pb-3 lg:hidden"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
                isActive(item.href)
                  ? "bg-sea-50 text-sea-800"
                  : "text-ink-700 hover:bg-ink-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}

      <div className="h-0.5 w-full bg-transparent">
        <div
          className="progress-bar h-0.5 bg-gradient-to-r from-sea-400 to-sea-700"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}

function FishMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M2.6 12c2.2-3.6 5.9-6 10.1-6 3 0 5.8 1.1 8 3l-.1-3.5c0-.6.5-1 1-1s1 .4 1 1V8c0 .5-.3.9-.8 1-.3 0-.5 0-.7-.1-1.9-1.9-4.5-3-7.4-3C10.2 6 6.4 8.4 4.2 12c2.2 3.6 6 6 10.5 6 2.9 0 5.5-1.1 7.4-3-.3-.1-.6-.4-.6-.8V11c0-.6.5-1 1-1s1 .4 1 1v3.4c0 .2 0 .3-.1.5-.1.5-.4.8-.9 1-2.2 1.9-5 3-8 3-4.2 0-7.9-2.4-10.1-6-.1 0-.2-.1-.3-.2-.2-.2-.3-.5-.3-.8s.1-.6.3-.8c.1-.1.2-.2.3-.2z" />
      <circle cx="16.5" cy="10.5" r="1.4" fill="#0f2836" />
    </svg>
  );
}
