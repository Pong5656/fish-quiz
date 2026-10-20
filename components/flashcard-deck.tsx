"use client";

import { useMemo, useState } from "react";
import type { Flashcard } from "@/data/flashcards";

type Props = {
  cards: Flashcard[];
  groups: readonly string[];
};

/**
 * บัตรคำแบบพลิกได้ พร้อมระบบทบทวนเฉพาะใบที่ยังไม่แม่น
 * เก็บสถานะไว้ในหน่วยความจำของหน้า ไม่ส่งข้อมูลออกไปที่ใด
 */
export function FlashcardDeck({ cards, groups }: Props) {
  const [group, setGroup] = useState<string>("ทั้งหมด");
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [reviewOnly, setReviewOnly] = useState(false);
  const [order, setOrder] = useState<number[]>(() => cards.map((_, idx) => idx));

  /* ลำดับการ์ดที่กำลังเล่นอยู่ */
  const visible = useMemo(() => {
    let idxs = order.slice();
    if (group !== "ทั้งหมด") {
      idxs = idxs.filter((k) => cards[k].group === group);
    }
    if (reviewOnly) {
      idxs = idxs.filter((k) => !known.has(k));
    }
    return idxs;
  }, [order, group, reviewOnly, known, cards]);

  const pos = Math.min(i, Math.max(0, visible.length - 1));
  const key = visible[pos];
  const card = key === undefined ? undefined : cards[key];

  const go = (d: number) => {
    setFlipped(false);
    setI((v) => {
      const n = v + d;
      if (n < 0) return visible.length - 1;
      if (n >= visible.length) return 0;
      return n;
    });
  };

  const shuffle = () => {
    const idxs = cards.map((_, idx) => idx);
    for (let a = idxs.length - 1; a > 0; a--) {
      const b = Math.floor(Math.random() * (a + 1));
      [idxs[a], idxs[b]] = [idxs[b], idxs[a]];
    }
    setOrder(idxs);
    setI(0);
    setFlipped(false);
  };

  const reset = () => {
    setOrder(cards.map((_, idx) => idx));
    setKnown(new Set());
    setReviewOnly(false);
    setI(0);
    setFlipped(false);
    setGroup("ทั้งหมด");
  };

  const mark = (isKnown: boolean) => {
    if (key === undefined) return;
    setKnown((prev) => {
      const next = new Set(prev);
      if (isKnown) next.add(key);
      else next.delete(key);
      return next;
    });
    go(1);
  };

  const pct = cards.length ? Math.round((known.size / cards.length) * 100) : 0;

  return (
    <div className="mt-8">
      {/* ── ตัวกรอง ── */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setGroup("ทั้งหมด");
            setI(0);
            setFlipped(false);
          }}
          className={`rounded-lg border px-3 py-1.5 text-[12.5px] transition-colors ${
            group === "ทั้งหมด"
              ? "border-sea-300 bg-sea-50 font-semibold text-sea-800"
              : "border-ink-200 bg-white text-ink-600 hover:border-sea-200"
          }`}
        >
          ทั้งหมด <span className="text-ink-400">{cards.length}</span>
        </button>
        {groups.map((g) => {
          const n = cards.filter((c) => c.group === g).length;
          return (
            <button
              key={g}
              type="button"
              onClick={() => {
                setGroup(g);
                setI(0);
                setFlipped(false);
              }}
              className={`rounded-lg border px-3 py-1.5 text-[12.5px] transition-colors ${
                group === g
                  ? "border-sea-300 bg-sea-50 font-semibold text-sea-800"
                  : "border-ink-200 bg-white text-ink-600 hover:border-sea-200"
              }`}
            >
              {g} <span className="text-ink-400">{n}</span>
            </button>
          );
        })}
      </div>

      {/* ── แถบเครื่องมือ ── */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setReviewOnly((v) => !v);
            setI(0);
            setFlipped(false);
          }}
          aria-pressed={reviewOnly}
          className={`rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
            reviewOnly
              ? "border-amber-300 bg-amber-50 text-amber-800"
              : "border-ink-200 bg-white text-ink-600 hover:border-amber-300"
          }`}
        >
          {reviewOnly ? "กำลังดูเฉพาะใบที่ยังไม่แม่น" : "ดูเฉพาะใบที่ยังไม่แม่น"}
        </button>

        <button
          type="button"
          onClick={shuffle}
          className="rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-[12.5px] font-medium text-ink-600 transition-colors hover:border-sea-300 hover:text-sea-700"
        >
          สลับลำดับ
        </button>

        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-[12.5px] font-medium text-ink-600 transition-colors hover:border-sea-300 hover:text-sea-700"
        >
          เริ่มใหม่ทั้งหมด
        </button>

        <span className="ml-auto text-[12.5px] text-ink-500">
          แม่นแล้ว {known.size}/{cards.length} · {pct}%
        </span>
      </div>

      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* ── การ์ด ── */}
      {card ? (
        <>
          <div className="mt-6 flex items-center justify-between gap-4">
            <span className="text-[12.5px] text-ink-400">
              ใบที่ {pos + 1} จาก {visible.length}
            </span>
            <span className="rounded-md border border-ink-200 bg-white px-2 py-0.5 text-[11.5px] text-ink-500">
              {card.group}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setFlipped((v) => !v)}
            aria-label={flipped ? "พลิกกลับไปด้านหน้า" : "พลิกดูคำตอบ"}
            className="mt-3 block w-full [perspective:1400px]"
          >
            <span
              className={`relative block min-h-[240px] w-full transition-transform duration-500 [transform-style:preserve-3d] sm:min-h-[280px] ${
                flipped ? "[transform:rotateY(180deg)]" : ""
              }`}
            >
              {/* ด้านหน้า */}
              <span className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-ink-100 bg-white p-8 text-center shadow-[0_18px_50px_-34px_rgba(31,87,118,0.6)] [backface-visibility:hidden]">
                <span className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-400">
                  คำถาม · กดการ์ดเพื่อดูคำตอบ
                </span>
                <span className="mt-4 text-[22px] font-bold leading-snug text-ink-900 sm:text-[26px]">
                  {card.front}
                </span>
              </span>

              {/* ด้านหลัง */}
              <span className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-sea-200 bg-sea-50 p-8 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <span className="text-[11.5px] font-semibold uppercase tracking-wide text-sea-600">
                  คำตอบ
                </span>
                <span className="mt-4 text-[17px] font-semibold leading-relaxed text-sea-950 sm:text-[19px]">
                  {card.back}
                </span>
              </span>
            </span>
          </button>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-4 py-2.5 text-[13.5px] font-medium text-ink-700 transition-colors hover:border-sea-300 hover:text-sea-700"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              ก่อนหน้า
            </button>

            <button
              type="button"
              onClick={() => mark(true)}
              className="ml-auto rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-[13.5px] font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
            >
              จำได้แล้ว
            </button>

            <button
              type="button"
              onClick={() => mark(false)}
              className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2.5 text-[13.5px] font-semibold text-amber-800 transition-colors hover:bg-amber-100"
            >
              ยังไม่แม่น ไว้ทวน
            </button>
          </div>
        </>
      ) : (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
          <p className="text-[17px] font-bold text-emerald-900">
            ทบทวนครบทุกใบที่เลือกไว้แล้ว
          </p>
          <p className="mt-2 text-[13.5px] text-emerald-950/80">
            {reviewOnly
              ? "ทุกใบในกลุ่มนี้อยู่ในสถานะจำได้แล้ว ให้ปิดตัวกรองเพื่อทบทวนทั้งชุดอีกครั้ง หรือสลับลำดับเพื่อกันการจำตามตำแหน่ง"
              : "กดเริ่มใหม่ทั้งหมดเพื่อทบทวนตั้งแต่ต้น หรือเลือกกลุ่มอื่น"}
          </p>
        </div>
      )}

      <p className="mt-6 text-[12.5px] leading-relaxed text-ink-400">
        สถานะความแม่นถูกเก็บไว้ในหน้านี้เท่านั้น ไม่ส่งไปที่เซิร์ฟเวอร์ใด
        เมื่อปิดหรือรีเฟรชหน้าจะเริ่มนับใหม่
      </p>
    </div>
  );
}
