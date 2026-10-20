"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { QuizSet } from "@/data/quiz-types";
import { getTopic } from "@/data";

type Phase = "intro" | "running" | "done";

type Answer = {
  /** ดัชนีตัวเลือกที่เลือก หรือ null ถ้าไม่ได้ตอบ */
  picked: number | null;
  /** ทำเครื่องหมายว่าข้ามไว้กลับมาตรวจ */
  flagged: boolean;
};

export function QuizRunner({ set }: { set: QuizSet }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(() =>
    set.questions.map(() => ({ picked: null, flagged: false })),
  );
  const [secondsLeft, setSecondsLeft] = useState(set.minutes * 60);
  const [showHint, setShowHint] = useState(false);
  const [showFigure, setShowFigure] = useState(true);
  /**
   * โหมดทำข้อสอบ
   *   exam   = ทำรวดเดียวแล้วส่ง ตรวจทีหลัง (เหมือนห้องสอบจริง)
   *   reveal = เฉลยทันทีทีละข้อ พร้อมคำอธิบาย (เหมือนติวเตอร์เฉลยให้ดูข้าง ๆ)
   */
  const [mode, setMode] = useState<"exam" | "reveal">(set.mode ?? "exam");
  /** ข้อที่เปิดดูเฉลยแล้ว ในโหมด reveal */
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  /** จับเวลาหรือไม่ — ในโหมดติวจะไม่จับเวลาโดยค่าเริ่มต้น */
  const [timed, setTimed] = useState(true);
  const topRef = useRef<HTMLDivElement>(null);

  const q = set.questions[i];
  const answered = answers.filter((a) => a.picked !== null).length;
  const isRevealed = mode === "reveal" && revealed.has(i);

  /* ── จับเวลา ── */
  useEffect(() => {
    if (phase !== "running" || !timed) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(id);
          setPhase("done");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase, timed]);

  /* ── เลื่อนขึ้นบนเมื่อเปลี่ยนข้อ ── */
  useEffect(() => {
    if (phase === "running" && topRef.current) {
      const top = topRef.current.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, [i, phase]);

  const pick = useCallback(
    (choice: number) => {
      setAnswers((prev) => {
        const next = [...prev];
        next[i] = { ...next[i], picked: choice };
        return next;
      });
      // ในโหมดติว ให้เฉลยทันทีที่เลือกครั้งแรก เพื่อให้เห็นผลก่อนไปข้อถัดไป
      if (mode === "reveal") {
        setRevealed((prev) => {
          const next = new Set(prev);
          next.add(i);
          return next;
        });
      }
    },
    [i, mode],
  );

  /** เลือกใหม่ในโหมดติว (เมื่อตอบผิดแล้วอยากลองใหม่) */
  const retry = useCallback(() => {
    setAnswers((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], picked: null };
      return next;
    });
    setRevealed((prev) => {
      const next = new Set(prev);
      next.delete(i);
      return next;
    });
  }, [i]);

  const flag = useCallback(() => {
    setAnswers((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], flagged: !next[i].flagged };
      return next;
    });
  }, [i]);

  const score = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    let blank = 0;
    set.questions.forEach((question, qi) => {
      const a = answers[qi];
      if (a.picked === null) blank++;
      else if (a.picked === question.answer) correct++;
      else wrong++;
    });
    return { correct, wrong, blank };
  }, [answers, set.questions]);

  const byTopic = useMemo(() => {
    const map = new Map<string, { correct: number; total: number }>();
    set.questions.forEach((question, qi) => {
      const cur = map.get(question.topic) ?? { correct: 0, total: 0 };
      cur.total++;
      if (answers[qi].picked === question.answer) cur.correct++;
      map.set(question.topic, cur);
    });
    return [...map.entries()].sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total);
  }, [answers, set.questions]);

  /* ── หน้าเริ่ม ── */
  if (phase === "intro") {
    return (
      <div className="mt-8">
        <div className="rounded-2xl border border-ink-100 bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="rounded-md bg-sea-800 px-2 py-0.5 text-[11.5px] font-medium text-white">
              {set.kind}
            </span>
            <span className="text-[12.5px] text-ink-400">
              {set.questions.length} ข้อ · {set.minutes} นาที
            </span>
          </div>

          <h2 className="mt-4 text-[20px] font-bold text-ink-900">{set.title}</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-ink-600">{set.description}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { l: "จำนวนข้อ", v: `${set.questions.length}` },
              { l: "เวลาที่ให้", v: `${set.minutes} นาที` },
              { l: "เวลาเฉลี่ยต่อข้อ", v: `${Math.round((set.minutes * 60) / set.questions.length)} วินาที` },
            ].map((s) => (
              <div key={s.l} className="rounded-lg border border-ink-100 bg-sand-50 px-4 py-3">
                <p className="text-[11.5px] text-ink-400">{s.l}</p>
                <p className="mt-0.5 text-[15px] font-semibold text-ink-800">{s.v}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-sea-200 bg-sea-50/60 p-4">
            <p className="text-[12.5px] font-semibold text-sea-900">เลือกวิธีทำ</p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {(
                [
                  {
                    key: "exam" as const,
                    t: "จำลองห้องสอบ",
                    d: "ทำรวดเดียวจนครบแล้วค่อยดูเฉลย พร้อมจับเวลาจริง เหมือนนั่งในห้องสอบ",
                  },
                  {
                    key: "reveal" as const,
                    t: "ติวทีละข้อ",
                    d: "เลือกคำตอบแล้วเห็นเฉลยกับคำอธิบายทันที เหมาะกับการอ่านทำความเข้าใจครั้งแรก",
                  },
                ] as const
              ).map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => {
                    setMode(m.key);
                    if (m.key === "reveal") setTimed(false);
                    else setTimed(true);
                  }}
                  aria-pressed={mode === m.key}
                  className={`rounded-lg border p-3.5 text-left transition-colors ${
                    mode === m.key
                      ? "border-sea-400 bg-white ring-1 ring-sea-300"
                      : "border-ink-200 bg-white/70 hover:border-sea-300"
                  }`}
                >
                  <span className="flex items-center gap-2 text-[13.5px] font-semibold text-ink-900">
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                        mode === m.key ? "border-sea-500 bg-sea-600" : "border-ink-300"
                      }`}
                    >
                      {mode === m.key && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </span>
                    {m.t}
                  </span>
                  <span className="mt-1.5 block text-[12.5px] leading-relaxed text-ink-600">
                    {m.d}
                  </span>
                </button>
              ))}
            </div>

            <label className="mt-3 flex cursor-pointer items-center gap-2 text-[12.5px] text-ink-600">
              <input
                type="checkbox"
                checked={timed}
                onChange={(e) => setTimed(e.target.checked)}
                className="h-4 w-4 rounded border-ink-300 accent-sea-700"
              />
              จับเวลา {set.minutes} นาที (ปิดได้ถ้าต้องการอ่านช้า ๆ)
            </label>
          </div>

          <div className="mt-4 rounded-lg border border-ink-100 bg-white p-4">
            <p className="text-[12.5px] font-semibold text-ink-800">
              วิธีทำชุดนี้ให้ได้ผลที่สุด
            </p>
            <ul className="mt-2.5 space-y-1.5 text-[13px] leading-relaxed text-ink-600">
              <li>· ครั้งแรกให้ใช้โหมดติวทีละข้อ เพื่อทำความเข้าใจเหตุผลของทุกตัวเลือก</li>
              <li>· ครั้งต่อไปให้สลับเป็นโหมดจำลองห้องสอบ เพื่อฝึกความเร็วและความแม่นยำ</li>
              <li>· ใช้ปุ่มธงทำเครื่องหมายข้อที่ไม่แน่ใจ แล้วกลับมาตรวจหลังทำครบ</li>
              <li>· อ่านเฉลยทุกข้อแม้ตอบถูก เพราะเฉลยอธิบายจุดที่มักเข้าใจผิดด้วย</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => setPhase("running")}
            className="btn-primary mt-6 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white"
          >
            เริ่มทำข้อสอบ
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 10h11M10 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  /* ── หน้าผล ── */
  if (phase === "done") {
    const pct = Math.round((score.correct / set.questions.length) * 100);
    const verdict =
      pct >= 85
        ? { t: "อยู่ในระดับที่ชิงที่หนึ่งได้", c: "emerald" }
        : pct >= 70
          ? { t: "ผ่านเกณฑ์ แต่ยังต้องเก็บจุดที่พลาด", c: "sea" }
          : pct >= 50
            ? { t: "ยังไม่พอสำหรับการชิงอันดับ ต้องทวนหมวดที่ผิด", c: "amber" }
            : { t: "ต้องกลับไปอ่านเนื้อหาก่อนทำชุดนี้อีกครั้ง", c: "rose" };

    const toneCls: Record<string, string> = {
      emerald: "border-emerald-200 bg-emerald-50 text-emerald-900",
      sea: "border-sea-200 bg-sea-50 text-sea-900",
      amber: "border-amber-200 bg-amber-50 text-amber-900",
      rose: "border-rose-200 bg-rose-50 text-rose-900",
    };

    return (
      <div className="mt-8 space-y-6">
        <div className="rounded-2xl border border-ink-100 bg-white p-6 sm:p-8">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-ink-400">
            ผลการทำชุดนี้
          </p>
          <div className="mt-4 flex flex-wrap items-end gap-6">
            <div>
              <p className="text-[52px] font-bold leading-none text-sea-800">
                {pct}
                <span className="text-[22px] text-ink-400">%</span>
              </p>
              <p className="mt-1.5 text-[13px] text-ink-500">
                ตอบถูก {score.correct} จาก {set.questions.length} ข้อ
              </p>
            </div>
            <div className="flex gap-6">
              {[
                { l: "ตอบถูก", v: score.correct, c: "text-emerald-600" },
                { l: "ตอบผิด", v: score.wrong, c: "text-rose-600" },
                { l: "ไม่ได้ตอบ", v: score.blank, c: "text-ink-400" },
              ].map((s) => (
                <div key={s.l}>
                  <p className={`text-[24px] font-bold leading-none ${s.c}`}>{s.v}</p>
                  <p className="mt-1 text-[12px] text-ink-500">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`mt-6 rounded-lg border p-4 ${toneCls[verdict.c]}`}>
            <p className="text-[13.5px] font-semibold">{verdict.t}</p>
          </div>
        </div>

        {/* สรุปตามหมวด */}
        <div className="rounded-2xl border border-ink-100 bg-white p-6 sm:p-8">
          <h3 className="text-[17px] font-bold text-ink-900">สรุปตามหมวดเนื้อหา</h3>
          <p className="mt-2 text-[13px] text-ink-500">
            เรียงจากหมวดที่ทำได้น้อยที่สุด จึงอ่านจากบนลงล่างเพื่อแก้จุดอ่อนก่อน
          </p>
          <ul className="mt-5 space-y-3.5">
            {byTopic.map(([slug, s]) => {
              const t = getTopic(slug);
              const p = s.total ? Math.round((s.correct / s.total) * 100) : 0;
              return (
                <li key={slug}>
                  <div className="flex items-baseline justify-between gap-3">
                    <Link
                      href={`/topics/${slug}`}
                      className="text-[13.5px] font-medium text-ink-800 hover:text-sea-700"
                    >
                      {t?.title ?? slug}
                    </Link>
                    <span className="shrink-0 text-[12.5px] text-ink-500">
                      {s.correct}/{s.total} · {p}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                    <div
                      className={`h-full rounded-full ${
                        p >= 80 ? "bg-emerald-500" : p >= 50 ? "bg-amber-500" : "bg-rose-500"
                      }`}
                      style={{ width: `${p}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* เฉลยทุกข้อ */}
        <div className="rounded-2xl border border-ink-100 bg-white p-6 sm:p-8">
          <h3 className="text-[17px] font-bold text-ink-900">เฉลยและคำอธิบายทุกข้อ</h3>
          <ol className="mt-5 space-y-6">
            {set.questions.map((question, qi) => {
              const a = answers[qi];
              const ok = a.picked === question.answer;
              const topic = getTopic(question.topic);
              return (
                <li key={question.id} className="border-t border-ink-50 pt-5 first:border-0 first:pt-0">
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${
                        a.picked === null ? "bg-ink-300" : ok ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    >
                      {a.picked === null ? "–" : ok ? "✓" : "✕"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-medium leading-snug text-ink-900">
                        <span className="mr-1.5 font-mono text-[12px] text-ink-400">
                          {String(qi + 1).padStart(2, "0")}
                        </span>
                        {question.q}
                      </p>

                      <div className="mt-3 space-y-1.5">
                        {question.choices.map((c, ci) => {
                          const isAnswer = ci === question.answer;
                          const isPicked = a.picked === ci;
                          return (
                            <p
                              key={ci}
                              className={`rounded-md px-2.5 py-1.5 text-[13px] leading-relaxed ${
                                isAnswer
                                  ? "bg-emerald-50 font-medium text-emerald-900"
                                  : isPicked
                                    ? "bg-rose-50 text-rose-900 line-through decoration-rose-300"
                                    : "text-ink-600"
                              }`}
                            >
                              {isAnswer && <span className="mr-1.5 font-bold">✓</span>}
                              {isPicked && !isAnswer && <span className="mr-1.5 font-bold">✕</span>}
                              {c}
                            </p>
                          );
                        })}
                      </div>

                      <div className="mt-3 rounded-lg border border-sea-100 bg-sea-50/50 p-3">
                        <p className="text-[12.5px] leading-relaxed text-ink-700">
                          <span className="font-semibold text-sea-800">อธิบาย: </span>
                          {question.explain}
                        </p>
                        {question.keyPoint && (
                          <p className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[12.5px] leading-relaxed text-amber-900">
                            <span className="font-semibold">จุดที่ต้องจำ: </span>
                            {question.keyPoint}
                          </p>
                        )}
                        {question.trap && (
                          <p className="mt-2 text-[12px] leading-relaxed text-ink-600">
                            <span className="font-semibold text-rose-700">ตัวเลือกหลอก: </span>
                            &ldquo;{question.trap.text}&rdquo; — {question.trap.why}
                          </p>
                        )}
                        {topic && (
                          <Link
                            href={`/read/${question.topic}`}
                            className="mt-2 inline-block text-[11.5px] font-medium text-sea-700 hover:text-sea-900"
                          >
                            อ่านทบทวนหมวด {topic.short} →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setAnswers(set.questions.map(() => ({ picked: null, flagged: false })));
              setRevealed(new Set());
              setI(0);
              setSecondsLeft(set.minutes * 60);
              setPhase("intro");
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-5 py-2.5 text-[13.5px] font-semibold text-ink-800 transition-colors hover:border-sea-300 hover:text-sea-700"
          >
            ทำชุดนี้อีกครั้ง
          </button>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 rounded-lg bg-sea-800 px-5 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-sea-900"
          >
            เลือกชุดอื่น
          </Link>
        </div>
      </div>
    );
  }

  /* ── หน้าทำข้อสอบ ── */
  const a = answers[i];
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const low = secondsLeft <= 60;
  const topic = getTopic(q.topic);

  return (
    <div ref={topRef} className="mt-6">
      {/* แถบสถานะ */}
      <div className="sticky top-16 z-40 -mx-4 border-b border-ink-100 bg-sand-50/95 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-[13px] font-semibold text-ink-800">
            ข้อ {i + 1}
            <span className="text-ink-400"> / {set.questions.length}</span>
          </span>

          <span className="text-[12.5px] text-ink-500">ตอบแล้ว {answered} ข้อ</span>

          <span
            className={`rounded-md border px-2 py-0.5 text-[11.5px] font-medium ${
              mode === "reveal"
                ? "border-sea-300 bg-sea-50 text-sea-700"
                : "border-ink-200 bg-white text-ink-500"
            }`}
          >
            {mode === "reveal" ? "ติวทีละข้อ" : "จำลองห้องสอบ"}
          </span>

          {timed ? (
            <span
              className={`ml-auto inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[13px] font-semibold tabular-nums ${
                low
                  ? "animate-ring border-rose-300 bg-rose-50 text-rose-700"
                  : "border-ink-200 bg-white text-ink-700"
              }`}
              aria-live={low ? "polite" : "off"}
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="8" cy="8.5" r="5.5" />
                <path d="M8 5.5V9l2 1.5M6 1.5h4" strokeLinecap="round" />
              </svg>
              {mm}:{ss}
            </span>
          ) : (
            <span className="ml-auto text-[11.5px] text-ink-400">ไม่จับเวลา</span>
          )}

          <button
            type="button"
            onClick={() => setPhase("done")}
            className="rounded-lg border border-ink-200 bg-white px-3 py-1 text-[12.5px] font-medium text-ink-700 transition-colors hover:border-sea-300 hover:text-sea-700"
          >
            ส่งและดูผล
          </button>
        </div>

        {/* ความคืบหน้า */}
        <div className="mx-auto mt-2 h-1 max-w-3xl overflow-hidden rounded-full bg-ink-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sea-400 to-sea-700 transition-all"
            style={{ width: `${((i + 1) / set.questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mx-auto max-w-3xl">
        {/* ตัวคำถาม */}
        <article key={q.id} className="animate-rise mt-6 rounded-2xl border border-ink-100 bg-white p-6 sm:p-7">
          <div className="flex items-center gap-2.5">
            {topic && (
              <span className="rounded-md border border-ink-200 bg-ink-50 px-2 py-0.5 text-[11.5px] text-ink-600">
                {topic.short}
              </span>
            )}
            <span className="rounded-md border border-ink-200 bg-white px-2 py-0.5 text-[11.5px] text-ink-500">
              {q.level}
            </span>
            <button
              type="button"
              onClick={flag}
              aria-pressed={a.flagged}
              className={`ml-auto inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[12px] font-medium transition-colors ${
                a.flagged
                  ? "border-amber-300 bg-amber-50 text-amber-800"
                  : "border-ink-200 bg-white text-ink-500 hover:border-amber-300 hover:text-amber-700"
              }`}
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 2v12M4 3h8l-1.5 3L12 9H4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {a.flagged ? "ติดธงแล้ว" : "ติดธงไว้ตรวจ"}
            </button>
          </div>

          <h2 className="mt-4 text-[17px] font-semibold leading-[1.7] text-ink-900 sm:text-[18.5px]">
            {q.q}
          </h2>

          {/* ภาพประกอบคำถาม — ข้อสอบจริงมีการถามจากภาพ */}
          {q.figure && showFigure && (
            <figure className="diagram-frame mt-4 overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={q.figure.src}
                alt={q.figure.alt}
                className="mx-auto h-auto w-full max-w-xl bg-white"
              />
              <figcaption className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-ink-100 bg-white px-4 py-2.5 text-[12px] text-ink-500">
                <span className="text-ink-700">{q.figure.alt}</span>
                {q.figure.credit && (
                  <>
                    <span aria-hidden className="text-ink-300">
                      ·
                    </span>
                    {q.figure.creditUrl ? (
                      <a
                        href={q.figure.creditUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sea-700 hover:underline"
                      >
                        {q.figure.credit}
                      </a>
                    ) : (
                      <span>{q.figure.credit}</span>
                    )}
                  </>
                )}
              </figcaption>
            </figure>
          )}

          <div className="mt-5 space-y-2.5">
            {q.choices.map((c, ci) => {
              const selected = a.picked === ci;
              const isAnswer = ci === q.answer;
              // เมื่อเฉลยแล้ว ให้ระบายสีตัวเลือกถูก–ผิดให้เห็นชัด
              const revealedWrong = isRevealed && selected && !isAnswer;
              const revealedRight = isRevealed && isAnswer;
              return (
                <button
                  key={ci}
                  type="button"
                  onClick={() => pick(ci)}
                  disabled={isRevealed}
                  aria-pressed={selected}
                  className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left text-[14px] leading-relaxed transition-all disabled:cursor-default ${
                    revealedRight
                      ? "border-emerald-300 bg-emerald-50 text-ink-900"
                      : revealedWrong
                        ? "border-rose-300 bg-rose-50 text-ink-900"
                        : selected
                          ? "border-sea-400 bg-sea-50 text-ink-900"
                          : "border-ink-200 bg-white text-ink-700 hover:border-sea-300 hover:bg-sea-50/40"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[12px] font-semibold ${
                      revealedRight
                        ? "border-emerald-500 bg-emerald-600 text-white"
                        : revealedWrong
                          ? "border-rose-500 bg-rose-600 text-white"
                          : selected
                            ? "border-sea-500 bg-sea-600 text-white"
                            : "border-ink-300 bg-white text-ink-500"
                    }`}
                  >
                    {revealedRight ? "✓" : revealedWrong ? "✕" : (["ก", "ข", "ค", "ง"][ci] ?? ci + 1)}
                  </span>
                  <span className="min-w-0 flex-1">{c}</span>
                </button>
              );
            })}
          </div>

          {/* ── เฉลยทีละข้อ (โหมดติว) ── */}
          {isRevealed && (
            <div className="animate-rise mt-5">
              <div
                className={`rounded-xl border p-4 ${
                  a.picked === q.answer
                    ? "border-emerald-200 bg-emerald-50/70"
                    : "border-rose-200 bg-rose-50/70"
                }`}
              >
                <p
                  className={`flex items-center gap-2 text-[14px] font-bold ${
                    a.picked === q.answer ? "text-emerald-800" : "text-rose-800"
                  }`}
                >
                  <span aria-hidden>
                    {a.picked === q.answer ? "✓" : "✕"}
                  </span>
                  {a.picked === q.answer ? "ตอบถูก" : "ตอบไม่ถูก"}
                  {a.picked === q.answer && q.level === "ยาก" ? " · ข้อนี้ระดับยาก" : ""}
                </p>

                {a.picked !== q.answer && (
                  <p className="mt-2 text-[13.5px] leading-relaxed text-rose-950/85">
                    <span className="font-semibold">คำตอบที่ถูกคือ </span>
                    {["ก", "ข", "ค", "ง"][q.answer]} — {q.choices[q.answer]}
                  </p>
                )}

                <div className="mt-3 border-t border-black/10 pt-3">
                  <p className="text-[13.5px] leading-[1.85] text-ink-800">
                    <span className="font-semibold text-sea-800">อธิบาย: </span>
                    {q.explain}
                  </p>
                </div>

                {q.keyPoint && (
                  <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[13px] leading-relaxed text-amber-900">
                    <span className="font-semibold">จุดที่ต้องจำ: </span>
                    {q.keyPoint}
                  </p>
                )}

                {q.trap && (
                  <p className="mt-2 text-[12.5px] leading-relaxed text-ink-600">
                    <span className="font-semibold text-rose-700">ตัวเลือกหลอก: </span>
                    &ldquo;{q.trap.text}&rdquo; — {q.trap.why}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={retry}
                    className="rounded-lg border border-ink-300 bg-white px-3 py-1.5 text-[12px] font-medium text-ink-700 hover:border-sea-300 hover:text-sea-700"
                  >
                    ลองตอบใหม่
                  </button>
                  {topic && (
                    <Link
                      href={`/read/${q.topic}`}
                      className="rounded-lg border border-sea-300 bg-white px-3 py-1.5 text-[12px] font-medium text-sea-700 hover:bg-sea-50"
                    >
                      อ่านทบทวนหมวด {topic.short} →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* โหมดจำลองห้องสอบ — ให้ดูคำใบ้ได้แต่ไม่เฉลย */}
          {mode === "exam" && (
            <>
              <button
                type="button"
                onClick={() => setShowHint((v) => !v)}
                className="mt-4 text-[12.5px] font-medium text-ink-400 hover:text-sea-700"
              >
                {showHint ? "ซ่อนคำใบ้" : "ดูคำใบ้"}
              </button>
              {showHint && (
                <p className="animate-sweep mt-2 rounded-lg border border-sand-200 bg-sand-50 p-3 text-[13px] leading-relaxed text-ink-700">
                  หัวข้อของข้อนี้คือ{" "}
                  <span className="font-medium">{topic?.short ?? q.topic}</span> · ตอบโดยยึดหลัก{" "}
                  <span className="font-medium">&ldquo;ตัวเลือกที่แคบและเจาะจงที่สุด&rdquo;</span>{" "}
                  และตัดตัวเลือกที่ขัดกับหลักชีววิทยาที่รู้แน่ก่อน
                  {" "}
                  <span className="text-ink-500">
                    (โหมดนี้ไม่เฉลยให้ ต้องรอส่งคำตอบก่อน — ถ้าอยากเห็นเฉลยทันทีให้สลับเป็นโหมดติวทีละข้อ)
                  </span>
                </p>
              )}
            </>
          )}
        </article>

        {/* ปุ่มเลื่อนข้อ */}
        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setI((v) => Math.max(0, v - 1))}
            disabled={i === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-4 py-2.5 text-[13.5px] font-medium text-ink-700 transition-colors hover:border-sea-300 hover:text-sea-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            ข้อก่อนหน้า
          </button>

          {i < set.questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setI((v) => Math.min(set.questions.length - 1, v + 1))}
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-sea-800 px-5 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-sea-900"
            >
              ข้อถัดไป
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPhase("done")}
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-sea-800 px-5 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-sea-900"
            >
              ส่งคำตอบและดูผล
            </button>
          )}
        </div>

        {/* ตารางข้อ */}
        <div className="mt-8 rounded-xl border border-ink-100 bg-white p-4">
          <p className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-400">
            ตารางข้อ — กดเพื่อข้ามไปข้อนั้น
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {set.questions.map((_, qi) => {
              const ans = answers[qi];
              const isCur = qi === i;
              return (
                <button
                  key={qi}
                  type="button"
                  onClick={() => setI(qi)}
                  aria-label={`ไปข้อ ${qi + 1}`}
                  aria-current={isCur ? "true" : undefined}
                  className={`relative h-8 w-8 rounded-md border text-[12px] font-medium transition-colors ${
                    isCur
                      ? "border-sea-600 bg-sea-800 text-white"
                      : ans.picked !== null
                        ? "border-sea-200 bg-sea-50 text-sea-800"
                        : "border-ink-200 bg-white text-ink-400 hover:border-sea-300"
                  }`}
                >
                  {qi + 1}
                  {ans.flagged && (
                    <span
                      aria-hidden
                      className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-amber-400"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
