"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Section, Topic } from "@/data/types";
import type { Photo } from "@/data/photos";
import { Highlight } from "@/components/highlight";
import { SourceChip } from "@/components/ui";
import { PhotoGallery } from "@/components/photo-gallery";
import { deriveKeywords } from "@/data";

/* ── โหมดไฮไลต์ ── */
export type HlMode = "all" | "key" | "off";

const HL_LABEL: Record<HlMode, string> = {
  all: "เน้นทั้งหมด",
  key: "เฉพาะคำสำคัญ",
  off: "ปิดไฮไลต์",
};

/**
 * โหมดอ่านไล่ทีละช่วง
 *
 * ออกแบบมาให้อ่านจบในรอบเดียวโดยไม่ต้องเลื่อนหา:
 * แสดงเนื้อหาทีละช่วงพร้อมแถบความคืบหน้า และมีจุดนำทางไปช่วงใดก็ได้
 * ทุกช่วงมีไฮไลต์คำสำคัญ ตัวเลข และจุดที่มักเข้าใจผิด เปิด-ปิดได้
 */
export function ReadAlong({
  topic,
  topics,
  photos = [],
}: {
  topic: Topic;
  /** ลำดับบทความทั้งหมด ใช้คำนวณความคืบหน้ารวม */
  topics: { slug: string; short: string; title: string }[];
  /** ภาพถ่ายจริงประจำหมวด แสดงท้ายบทเพื่อทบทวนก่อนไปบทถัดไป */
  photos?: Photo[];
}) {
  const sections = topic.sections;
  const [i, setI] = useState(0);
  const [hl, setHl] = useState<HlMode>("all");
  const [done, setDone] = useState<Set<number>>(new Set());
  const topRef = useRef<HTMLDivElement>(null);

  /* จำตำแหน่งที่อ่านไว้ในหน่วยความจำของแท็บ เพื่อกลับมาอ่านต่อได้ */
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`read:${topic.slug}`);
      if (raw) {
        const n = Number(raw);
        if (Number.isFinite(n) && n >= 0 && n < sections.length) {
          setI(n);
          setDone(new Set(Array.from({ length: n }, (_, k) => k)));
        }
      }
    } catch {
      /* ไม่มี sessionStorage ก็อ่านจากต้นได้ */
    }
  }, [topic.slug, sections.length]);

  useEffect(() => {
    try {
      sessionStorage.setItem(`read:${topic.slug}`, String(i));
    } catch {
      /* เขียนไม่ได้ไม่เป็นไร */
    }
  }, [i, topic.slug]);

  const goto = useCallback(
    (n: number) => {
      const clamped = Math.max(0, Math.min(sections.length - 1, n));
      setI(clamped);
      setDone((prev) => {
        const next = new Set(prev);
        for (let k = 0; k < clamped; k++) next.add(k);
        return next;
      });
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [sections.length],
  );

  /* ลัดด้วยแป้นพิมพ์ — เหมือนแอปอ่านหนังสือ */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight" || e.key === "j") goto(i + 1);
      if (e.key === "ArrowLeft" || e.key === "k") goto(i - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [i, goto]);

  const sec = sections[i];
  const total = sections.length;
  const pct = Math.round(((i + 1) / total) * 100);
  const idx = topics.findIndex((t) => t.slug === topic.slug);
  const prevTopic = idx > 0 ? topics[idx - 1] : null;
  const nextTopic = idx < topics.length - 1 ? topics[idx + 1] : null;

  const hlHost = useMemo(
    () =>
      hl === "off" ? "hl-host hl-off" : hl === "key" ? "hl-host hl-keyonly" : "hl-host",
    [hl],
  );

  return (
    <div ref={topRef} className={hlHost}>
      {/* ── แถบเครื่องมือติดบนจอ ── */}
      <div className="sticky top-16 z-40 -mx-4 border-b border-ink-100 bg-sand-50/95 px-4 py-2.5 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-3 gap-y-2">
          <span className="text-[12.5px] font-semibold text-ink-800">
            ช่วงที่ {i + 1}
            <span className="font-normal text-ink-400"> / {total}</span>
          </span>

          <span className="hidden text-[12px] text-ink-500 sm:inline">
            อ่านแล้ว {done.size}/{total}
          </span>

          {/* สลับโหมดไฮไลต์ */}
          <div className="ml-auto flex items-center gap-1 rounded-lg border border-ink-200 bg-white p-0.5">
            {(["all", "key", "off"] as HlMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setHl(m)}
                aria-pressed={hl === m}
                title={`ไฮไลต์: ${HL_LABEL[m]}`}
                className={`rounded-md px-2 py-1 text-[11.5px] font-medium transition-colors ${
                  hl === m ? "bg-sea-800 text-white" : "text-ink-500 hover:text-sea-700"
                }`}
              >
                {m === "all" ? "ไฮไลต์" : m === "key" ? "คำสำคัญ" : "ปิด"}
              </button>
            ))}
          </div>

          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => goto(i - 1)}
              disabled={i === 0}
              className="read-nav-btn rounded-lg border border-ink-200 bg-white px-2.5 py-1 text-[12px] font-medium text-ink-700 disabled:opacity-35"
            >
              ← ก่อนหน้า
            </button>
            <button
              type="button"
              onClick={() => goto(i + 1)}
              disabled={i === total - 1}
              className="read-nav-btn rounded-lg bg-sea-800 px-2.5 py-1 text-[12px] font-semibold text-white disabled:opacity-35"
            >
              ถัดไป →
            </button>
          </div>
        </div>

        {/* แถบความคืบหน้าแบบบาง */}
        <div className="mx-auto mt-2 h-1 max-w-3xl overflow-hidden rounded-full bg-ink-100">
          <div className="read-progress h-full rounded-full" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* ── เนื้อหาช่วงปัจจุบัน ── */}
      <article key={i} className="animate-rise mx-auto mt-7 max-w-3xl">
        <div className="reading-card rounded-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[11.5px] font-semibold uppercase tracking-wide text-sea-600">
              {topic.short} · ช่วงที่ {i + 1}
            </span>
            <span className="shrink-0 rounded-md bg-ink-50 px-2 py-0.5 text-[11px] text-ink-500">
              {sec.heading.split(".")[0].trim() && /^\d+$/.test(sec.heading.split(".")[0].trim())
                ? "หัวข้อ " + sec.heading.split(".")[0].trim()
                : "หัวข้อ"}
            </span>
          </div>

          <h2 className="mt-3 text-[22px] font-bold leading-snug tracking-tight text-ink-900 sm:text-[25px]">
            {sec.heading.replace(/^\d+\.\s*/, "")}
          </h2>
          <span className="mt-3 block h-0.5 w-14 rounded-full bg-gradient-to-r from-sea-400 to-sea-600" />

          {/* ย่อหน้า */}
          {sec.body?.map((p, pi) => (
            <p key={pi} className="mt-5 text-[15px] leading-[1.95] text-ink-700">
              <Highlight text={p} keywords={deriveKeywords(sec)} />
            </p>
          ))}

          {/* ตาราง */}
          {sec.table && (
            <figure className="my-6">
              <div className="table-scroll rounded-lg border border-ink-100">
                <table className="data-table">
                  <thead>
                    <tr>
                      {sec.table.head.map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sec.table.rows.map((row, ri) => (
                      <tr key={ri}>
                        {row.map((cell, ci) => (
                          <td
                            key={ci}
                            className={
                              ci === 0 ? "whitespace-nowrap font-medium text-ink-900" : undefined
                            }
                          >
                            <Highlight text={cell} keywords={deriveKeywords(sec)} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {sec.table.caption && (
                <figcaption className="mt-2 text-[12px] text-ink-400">
                  {sec.table.caption}
                </figcaption>
              )}
            </figure>
          )}

          {/* ภาพ */}
          {sec.image && (
            <figure className="diagram-frame my-6 overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sec.image.src}
                alt={sec.image.alt}
                className="h-auto w-full bg-white object-cover"
              />
              <figcaption className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-ink-100 bg-white px-4 py-3 text-[12px] text-ink-500">
                <span className="text-ink-700">{sec.image.alt}</span>
                <span aria-hidden className="text-ink-300">
                  ·
                </span>
                <a
                  href={sec.image.creditUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sea-700 hover:underline"
                >
                  {sec.image.credit}
                </a>
              </figcaption>
            </figure>
          )}

          {/* Bullets */}
          {sec.bullets && (
            <ul className="mt-6 space-y-3">
              {sec.bullets.map((b, bi) => (
                <li
                  key={bi}
                  className="flex gap-3 text-[14.5px] leading-[1.85] text-ink-700"
                >
                  <span
                    aria-hidden
                    className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-sea-400"
                  />
                  <span>
                    <Highlight text={b} keywords={deriveKeywords(sec)} />
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* จุดที่มักออกสอบ */}
          {sec.hot && sec.hot.length > 0 && (
            <div className="mt-7 rounded-xl border border-sea-200 bg-sea-50/50">
              <div className="flex items-center gap-2 border-b border-sea-200 px-4 py-2.5">
                <span aria-hidden className="text-sea-600">
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                    <path d="M10 1.5l2.3 5.1 5.6.6-4.2 3.8 1.2 5.5L10 13.8l-4.9 2.7 1.2-5.5L2.1 7.2l5.6-.6L10 1.5z" />
                  </svg>
                </span>
                <p className="text-[13px] font-semibold text-sea-800">
                  จุดที่มักออกสอบในหัวข้อนี้
                </p>
                <span className="ml-auto text-[11.5px] text-sea-600">{sec.hot.length} ข้อ</span>
              </div>
              <ul className="divide-y divide-sea-100">
                {sec.hot.map((h, hi) => (
                  <li key={hi} className="px-4 py-4">
                    <p className="text-[13.5px] font-medium leading-snug text-ink-900">
                      <span className="mr-1.5 font-mono text-[12px] text-sea-600">Q{hi + 1}</span>
                      <Highlight text={h.q} keywords={deriveKeywords(sec)} />
                    </p>
                    <p className="mt-1.5 border-l-2 border-sea-300 pl-3 text-[13px] leading-relaxed text-ink-700">
                      <span className="mr-1 font-semibold text-sea-700">ตอบ:</span>
                      <Highlight text={h.a} keywords={deriveKeywords(sec)} />
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* แหล่งอ้างอิง */}
          {sec.sources && sec.sources.length > 0 && (
            <div className="mt-6 border-t border-ink-50 pt-4">
              <p className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-400">
                แหล่งอ้างอิงของช่วงนี้
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {sec.sources.map((id) => (
                  <SourceChip key={id} id={id} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── ปุ่มไปช่วงถัดไป ── */}
        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => goto(i - 1)}
            disabled={i === 0}
            className="read-nav-btn rounded-xl border border-ink-200 bg-white px-4 py-3 text-[13.5px] font-medium text-ink-700 disabled:cursor-not-allowed disabled:opacity-35"
          >
            ช่วงก่อนหน้า
          </button>

          {i < total - 1 ? (
            <button
              type="button"
              onClick={() => goto(i + 1)}
              className="btn-primary ml-auto rounded-xl px-6 py-3 text-[13.5px] font-semibold text-white"
            >
              อ่านช่วงถัดไป
            </button>
          ) : (
            <div className="ml-auto flex flex-wrap gap-2">
              <Link
                href={`/quiz/topic/${topic.slug}`}
                className="btn-primary rounded-xl px-5 py-3 text-[13.5px] font-semibold text-white"
              >
                ทดสอบหมวดนี้
              </Link>
            </div>
          )}
        </div>
      </article>

      {/* ── จุดนำทางไปทุกช่วง ── */}
      <div className="mx-auto mt-7 max-w-3xl">
        <div className="rounded-xl border border-ink-100 bg-white p-4">
          <p className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-400">
            ทุกช่วงในบทนี้ — กดเพื่อข้ามไป
          </p>
          <ol className="mt-3 space-y-1">
            {sections.map((s, si) => (
              <li key={s.heading}>
                <button
                  type="button"
                  onClick={() => goto(si)}
                  aria-current={si === i ? "true" : undefined}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[13px] transition-colors ${
                    si === i
                      ? "bg-sea-800 font-semibold text-white"
                      : done.has(si)
                        ? "text-ink-500 hover:bg-sea-50"
                        : "text-ink-700 hover:bg-ink-50"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10.5px] font-bold ${
                      si === i
                        ? "bg-white/20 text-white"
                        : done.has(si)
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-ink-100 text-ink-500"
                    }`}
                  >
                    {done.has(si) && si !== i ? "✓" : si + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    {s.heading.replace(/^\d+\.\s*/, "")}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        {/* ไปบทอื่น */}
        <nav className="mt-6 grid gap-3 sm:grid-cols-2">
          {prevTopic ? (
            <Link
              href={`/read/${prevTopic.slug}`}
              className="group rounded-xl border border-ink-100 bg-white p-4 transition-colors hover:border-sea-200"
            >
              <p className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-400">
                ← บทก่อนหน้า
              </p>
              <p className="mt-1 text-[13.5px] font-semibold text-ink-900 group-hover:text-sea-700">
                {prevTopic.short}
              </p>
            </Link>
          ) : (
            <span />
          )}
          {nextTopic && (
            <Link
              href={`/read/${nextTopic.slug}`}
              className="group rounded-xl border border-ink-100 bg-white p-4 text-right transition-colors hover:border-sea-200"
            >
              <p className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-400">
                บทถัดไป →
              </p>
              <p className="mt-1 text-[13.5px] font-semibold text-ink-900 group-hover:text-sea-700">
                {nextTopic.short}
              </p>
            </Link>
          )}
        </nav>

        <p className="mt-6 text-center text-[12px] text-ink-400">
          ใช้ปุ่ม ← → หรือ J / K บนแป้นพิมพ์เพื่อเลื่อนช่วงได้เช่นกัน
        </p>

        {/* ── ภาพถ่ายจริงประจำบท ทบทวนก่อนไปบทถัดไป ── */}
        {photos.length > 0 && (
          <div className="mt-10 text-left">
            <PhotoGallery
              photos={photos}
              heading="ภาพถ่ายจริงประจำบทนี้"
              note="ดูภาพแล้วลองเรียกชื่อชนิดและลักษณะสำคัญก่อนไปบทถัดไป ภาพทั้งหมดมาจาก Wikimedia Commons ภายใต้สัญญาอนุญาตเปิด พร้อมเครดิตและลิงก์ต้นทาง"
            />
          </div>
        )}
      </div>
    </div>
  );
}
