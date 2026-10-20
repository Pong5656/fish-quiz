import type { Metadata } from "next";
import Link from "next/link";
import { QUIZ_SETS, TOTAL_QUESTIONS } from "@/data/quiz-sets";
import { QUESTION_BANK } from "@/data/questions";
import { FIGURE_QUESTION_COUNT } from "@/data/questions-figure";
import { PHOTO_QUESTION_COUNT } from "@/data/questions-photos";
import { ALL_TOPICS } from "@/data";
import { Reveal } from "@/components/reveal";
import { SectionLabel } from "@/components/ui";

export const metadata: Metadata = {
  title: "ข้อสอบจำลอง",
  description:
    "ชุดข้อสอบจำลองการแข่งขันความรู้ทางการประมง แยกรอบแรกและรอบที่สองตามกติกาจริง พร้อมชุดเจาะลึกเฉพาะหมวด เฉลยอธิบายทุกข้อ และจับเวลาได้",
};

export default function QuizIndexPage() {
  const counts = new Map<string, number>();
  for (const q of QUESTION_BANK) {
    counts.set(q.topic, (counts.get(q.topic) ?? 0) + 1);
  }
  const covered = ALL_TOPICS.filter((t) => counts.has(t.slug));
  const uncovered = ALL_TOPICS.filter((t) => !counts.has(t.slug));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <Reveal>
        <SectionLabel>ฝึกทำข้อสอบ</SectionLabel>
        <h1 className="rule-draw text-[30px] font-bold tracking-tight text-ink-900 sm:text-[38px]">
          ข้อสอบจำลอง
        </h1>
        <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-ink-600">
          {QUIZ_SETS.length} ชุด รวม {TOTAL_QUESTIONS} ข้อ ครอบคลุม {covered.length} หมวดเนื้อหา
          ชุดที่ 1 และ 2 จำลองรูปแบบการแข่งขันจริง คือรอบแรก 30 ข้อ ความรู้ทั่วไป
          และรอบที่สอง 40 ข้อ เรื่องปลา ความรู้พื้นฐาน อนุกรมวิธาน และนิเวศวิทยา
          ชุดที่ 4 และ 5 เป็นชุดเจาะลึกเฉพาะหมวด
          ชุดที่ 6–7 ถามจากภาพวาด และชุดที่ 8–9 ถามจากภาพถ่ายจริง
          เลือกทำได้สองแบบ คือโหมดติวที่เฉลยทันทีทีละข้อ กับโหมดจำลองห้องสอบที่จับเวลา
        </p>
      </Reveal>

      <Reveal>
        <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-ink-100 bg-ink-100 sm:grid-cols-4">
          {[
            { n: QUIZ_SETS.length, l: "ชุดข้อสอบ" },
            { n: TOTAL_QUESTIONS, l: "ข้อทั้งหมด" },
            { n: covered.length, l: "หมวดที่ครอบคลุม" },
            { n: FIGURE_QUESTION_COUNT + PHOTO_QUESTION_COUNT, l: "ข้อที่ต้องดูภาพ" },
          ].map((s) => (
            <div key={s.l} className="bg-white px-5 py-4">
              <p className="text-[24px] font-bold leading-none text-sea-800">{s.n}</p>
              <p className="mt-1.5 text-[12.5px] text-ink-500">{s.l}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <section className="mt-10 space-y-5">
        {QUIZ_SETS.map((set, i) => (
          <Reveal key={set.id} delay={i * 50}>
            <Link
              href={`/quiz/${set.id}`}
              className="card-surface card-surface-hover group block rounded-2xl p-6"
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="rounded-md bg-sea-800 px-2 py-0.5 text-[11.5px] font-medium text-white">
                  {set.kind}
                </span>
                <span className="text-[12.5px] text-ink-400">
                  {set.questions.length} ข้อ · {set.minutes} นาที
                </span>
              </div>

              <div className="mt-4 flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-[18px] font-semibold text-ink-900 group-hover:text-sea-800">
                    {set.title}
                  </h2>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-600">
                    {set.description}
                  </p>
                </div>
                <span
                  aria-hidden
                  className="mt-1 shrink-0 text-ink-300 transition-transform group-hover:translate-x-1 group-hover:text-sea-600"
                >
                  <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M7 4l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>

              {/* หมวดที่ครอบคลุมในชุดนี้ */}
              <div className="mt-4 flex flex-wrap gap-1.5 border-t border-ink-50 pt-4">
                {[...new Set(set.questions.map((q) => q.topic))].map((slug) => {
                  const t = ALL_TOPICS.find((x) => x.slug === slug);
                  if (!t) return null;
                  const n = set.questions.filter((q) => q.topic === slug).length;
                  return (
                    <span
                      key={slug}
                      className="rounded-md border border-ink-200 bg-ink-50 px-2 py-0.5 text-[11.5px] text-ink-600"
                    >
                      {t.short} <span className="text-ink-400">×{n}</span>
                    </span>
                  );
                })}
              </div>
            </Link>
          </Reveal>
        ))}
      </section>

      <Reveal>
        <section className="mt-12 rounded-xl border border-ink-100 bg-white p-6">
          <h2 className="text-[17px] font-bold text-ink-900">
            ข้อสอบจำลองชุดนี้คืออะไร และไม่ใช่อะไร
          </h2>
          <p className="mt-3 text-[13.5px] leading-relaxed text-ink-600">
            ชุดข้อสอบทั้งหมดในเว็บนี้ จัดทำขึ้นใหม่โดยอ้างขอบเขตเนื้อหาที่คณะประมงประกาศ
            และคำอธิบายรายวิชาในหลักสูตรประมงของมหาวิทยาลัยเกษตรศาสตร์
            จึงใช้ฝึกความแม่นยำและความเร็วได้จริง
            แต่ไม่ใช่ข้อสอบจริงของปีใด และไม่ใช่ข้อสอบที่รั่วไหลมาจากการแข่งขัน
            เนื้อหาที่ถามจึงเป็นข้อเท็จจริงที่ยืนยันได้จากแหล่งอ้างอิงเสมอ
          </p>

          {uncovered.length > 0 && (
            <div className="mt-5">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-ink-400">
                หมวดที่ยังไม่มีข้อในชุดจำลอง
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {uncovered.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/topics/${t.slug}`}
                    className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11.5px] text-amber-800 hover:border-amber-300"
                  >
                    {t.short}
                  </Link>
                ))}
              </div>
              <p className="mt-2.5 text-[12.5px] leading-relaxed text-ink-500">
                หมวดเหล่านี้มีเนื้อหาให้อ่านครบแล้ว แต่ข้อสอบจะถามน้อยกว่า
                จึงอ่านเพื่อตอบได้แบบปรนัยก็พอ
              </p>
            </div>
          )}
        </section>
      </Reveal>
    </div>
  );
}
