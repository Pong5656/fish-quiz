import Link from "next/link";
import type { ReactNode } from "react";
import { SOURCE_BY_ID } from "@/data";

/** ป้ายหัวข้อย่อยของหน้า */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2.5 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-sea-600">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-sea-400 to-sea-700" />
      {children}
    </p>
  );
}

/** การอ้างอิงจากทะเบียนแหล่งข้อมูล */
export function SourceChip({ id }: { id: string }) {
  const s = SOURCE_BY_ID.get(id);
  if (!s) return null;
  return (
    <a
      href={s.url}
      target="_blank"
      rel="noopener noreferrer"
      title={s.note}
      className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-ink-200 bg-white px-2 py-1 text-[11.5px] text-ink-600 transition-colors hover:border-sea-300 hover:text-sea-700"
    >
      <span aria-hidden className="text-sea-500">
        ▤
      </span>
      <span className="truncate">{s.title}</span>
    </a>
  );
}

export function SourceList({ ids }: { ids: string[] }) {
  if (!ids.length) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {ids.map((id) => (
        <SourceChip key={id} id={id} />
      ))}
    </div>
  );
}

/** ป้ายระดับความสำคัญ */
export function WeightBadge({ weight }: { weight: number }) {
  const map: Record<number, { label: string; cls: string }> = {
    5: { label: "ต้องได้เต็ม", cls: "bg-rose-50 text-rose-700 border-rose-200" },
    4: { label: "สำคัญสูง", cls: "bg-amber-50 text-amber-800 border-amber-200" },
    3: { label: "สำคัญปานกลาง", cls: "bg-sea-50 text-sea-700 border-sea-200" },
    2: { label: "อ่านพอเข้าใจ", cls: "bg-ink-50 text-ink-600 border-ink-200" },
  };
  const it = map[weight] ?? map[3];
  return (
    <span className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${it.cls}`}>
      {it.label}
    </span>
  );
}

/** การ์ดลิงก์ทั่วไป */
export function LinkCard({
  href,
  title,
  desc,
  meta,
  icon,
}: {
  href: string;
  title: string;
  desc: string;
  meta?: string;
  icon?: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="card-surface card-surface-hover group relative flex h-full flex-col overflow-hidden rounded-xl p-5"
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-sea-400 to-sea-700 transition-transform duration-300 group-hover:scale-x-100"
      />
      {icon && (
        <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sea-50 to-sea-100 text-sea-700 ring-1 ring-inset ring-sea-200/60 transition-colors group-hover:from-sea-100 group-hover:to-sea-200">
          {icon}
        </span>
      )}
      <span className="flex items-start justify-between gap-3">
        <span className="text-[15px] font-semibold text-ink-900 transition-colors group-hover:text-sea-800">
          {title}
        </span>
        <span
          aria-hidden
          className="mt-0.5 shrink-0 text-ink-300 transition-transform group-hover:translate-x-1 group-hover:text-sea-600"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M7 4l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </span>
      <span className="mt-2 flex-1 text-[13px] leading-relaxed text-ink-500">{desc}</span>
      {meta && (
        <span className="mt-3 inline-flex w-fit rounded-md bg-ink-50 px-2 py-0.5 text-[11.5px] font-medium text-ink-500">
          {meta}
        </span>
      )}
    </Link>
  );
}

/** แบนเนอร์แจ้งข้อมูลที่ยังไม่ยืนยัน */
export function CautionNote({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50/70 p-3.5 text-[13px] leading-relaxed text-amber-900">
      <span aria-hidden className="mt-0.5 shrink-0 text-amber-600">
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 3.2a.9.9 0 01.9.9v4.4a.9.9 0 11-1.8 0V6.1a.9.9 0 01.9-.9zm0 9.2a1.1 1.1 0 110-2.2 1.1 1.1 0 010 2.2z" />
        </svg>
      </span>
      <div>{children}</div>
    </div>
  );
}
