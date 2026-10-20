"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Trick, TrickCategory } from "@/data/tricks";
import { getTopic } from "@/data";

type Props = {
  tricks: Trick[];
  categories: TrickCategory[];
};

/**
 * แสดงทริกทีละข้อ แยกเป็นหมวด — ตามที่ผู้ใช้ต้องการ
 * เลือกหมวดด้านซ้าย แล้วไล่ทีละข้อด้วยปุ่มก่อนหน้า/ถัดไป
 */
export function TrickExplorer({ tricks, categories }: Props) {
  const [cat, setCat] = useState<TrickCategory | "ทั้งหมด">("ทั้งหมด");

  const list = useMemo(
    () => (cat === "ทั้งหมด" ? tricks : tricks.filter((t) => t.category === cat)),
    [cat, tricks],
  );

  const [i, setI] = useState(0);
  const current = list[Math.min(i, Math.max(0, list.length - 1))];

  const go = (d: number) => {
    setI((v) => {
      const n = v + d;
      if (n < 0) return list.length - 1;
      if (n >= list.length) return 0;
      return n;
    });
  };

  const pickCat = (c: TrickCategory | "ทั้งหมด") => {
    setCat(c);
    setI(0);
  };

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[220px_1fr]">
      {/* ── เมนูหมวด ── */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <p className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-400">
          หมวดทริก
        </p>
        <div className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:flex-nowrap">
          <CatBtn
            active={cat === "ทั้งหมด"}
            onClick={() => pickCat("ทั้งหมด")}
            label="ทั้งหมด"
            count={tricks.length}
          />
          {categories.map((c) => (
            <CatBtn
              key={c}
              active={cat === c}
              onClick={() => pickCat(c)}
              label={c}
              count={tricks.filter((t) => t.category === c).length}
            />
          ))}
        </div>
      </aside>

      {/* ── ตัวแสดงทีละข้อ ── */}
      <div>
        {current && (
          <>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[12.5px] text-ink-400">
                ข้อ {Math.min(i + 1, list.length)} จาก {list.length}
              </span>
              <div className="flex gap-2">
                <NavBtn onClick={() => go(-1)} label="ก่อนหน้า" dir="prev" />
                <NavBtn onClick={() => go(1)} label="ถัดไป" dir="next" />
              </div>
            </div>

            {/* แถบความคืบหน้า */}
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-ink-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sea-400 to-sea-700 transition-all duration-300"
                style={{ width: `${((Math.min(i, list.length - 1) + 1) / list.length) * 100}%` }}
              />
            </div>

            <article
              key={`${cat}-${i}`}
              className="animate-rise mt-6 rounded-2xl border border-ink-100 bg-white p-6 shadow-[0_16px_50px_-32px_rgba(31,87,118,0.5)] sm:p-8"
            >
              <span className="inline-flex rounded-md border border-sea-200 bg-sea-50 px-2 py-0.5 text-[11.5px] font-medium text-sea-700">
                {current.category}
              </span>

              <h2 className="mt-4 text-[21px] font-bold leading-snug tracking-tight text-ink-900 sm:text-[24px]">
                {current.title}
              </h2>

              <p className="mt-4 text-[14.5px] leading-[1.85] text-ink-700">
                {current.principle}
              </p>

              <div className="mt-6">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-ink-400">
                  วิธีทำจริงเป็นขั้นตอน
                </p>
                <ol className="mt-3 space-y-3">
                  {current.how.map((h, hi) => (
                    <li
                      key={hi}
                      className="flex gap-3.5 text-[14px] leading-[1.75] text-ink-700"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-sea-800 text-[11.5px] font-semibold text-white">
                        {hi + 1}
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {current.example && (
                <div className="mt-6 rounded-lg border border-sand-200 bg-sand-50 p-4">
                  <p className="text-[11.5px] font-semibold uppercase tracking-wide text-sand-800">
                    ตัวอย่างการใช้จริง
                  </p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-700">
                    {current.example}
                  </p>
                </div>
              )}

              <div className="mt-6 border-t border-ink-50 pt-4">
                <p className="text-[12px] leading-relaxed text-ink-500">
                  <span className="font-medium text-ink-700">ที่มา: </span>
                  {current.from}
                </p>
              </div>

              {current.appliesTo && current.appliesTo.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-[12px] text-ink-400">ใช้กับหมวด:</span>
                  {current.appliesTo.map((slug) => {
                    const t = getTopic(slug);
                    if (!t) return null;
                    return (
                      <Link
                        key={slug}
                        href={`/topics/${slug}`}
                        className="rounded-md border border-ink-200 bg-white px-2 py-0.5 text-[11.5px] text-ink-600 transition-colors hover:border-sea-300 hover:text-sea-700"
                      >
                        {t.short}
                      </Link>
                    );
                  })}
                </div>
              )}
            </article>

            {/* จุดนำทางด้านล่าง */}
            <div className="mt-5 flex flex-wrap gap-1.5">
              {list.map((t, ti) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setI(ti)}
                  aria-label={`ไปทริกข้อ ${ti + 1}: ${t.title}`}
                  aria-current={ti === Math.min(i, list.length - 1) ? "true" : undefined}
                  className={`h-1.5 rounded-full transition-all ${
                    ti === Math.min(i, list.length - 1)
                      ? "w-6 bg-sea-600"
                      : "w-1.5 bg-ink-200 hover:bg-sea-300"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CatBtn({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left text-[13px] transition-colors ${
        active
          ? "border-sea-300 bg-sea-50 font-semibold text-sea-800"
          : "border-ink-200 bg-white text-ink-600 hover:border-sea-200 hover:text-sea-700"
      }`}
    >
      <span>{label}</span>
      <span
        className={`rounded text-[11px] ${active ? "text-sea-600" : "text-ink-400"}`}
      >
        {count}
      </span>
    </button>
  );
}

function NavBtn({
  onClick,
  label,
  dir,
}: {
  onClick: () => void;
  label: string;
  dir: "prev" | "next";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-[12.5px] font-medium text-ink-700 transition-colors hover:border-sea-300 hover:text-sea-700"
    >
      {dir === "prev" && (
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {label}
      {dir === "next" && (
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}
