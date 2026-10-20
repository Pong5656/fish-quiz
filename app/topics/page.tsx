import type { Metadata } from "next";
import Link from "next/link";
import { ALL_TOPICS, countSections } from "@/data";
import { Reveal } from "@/components/reveal";
import { SectionLabel, WeightBadge } from "@/components/ui";

export const metadata: Metadata = {
  title: "เนื้อหาทั้งหมด",
  description:
    "เนื้อหาความรู้ทางการประมงครบทุกหมวดตามขอบเขตของคณะประมง มก. วิทยาเขตกำแพงแสน ตั้งแต่กายวิภาคปลา อนุกรมวิธาน นิเวศวิทยา คุณภาพน้ำ การเพาะเลี้ยง ไปจนถึงกฎหมายประมงและพิษวิทยาทางน้ำ",
};

export default function TopicsPage() {
  const groups = [
    {
      title: "ชั้นที่ 1 — ต้องได้เต็ม",
      desc: "ตรงกับหัวข้อสอบรอบที่สอง หรือออกทั้งสองรอบ",
      items: ALL_TOPICS.filter((t) => t.weight === 5),
    },
    {
      title: "ชั้นที่ 2 — สำคัญสูง",
      desc: "ออกในรอบแรกเป็นหลัก มักถามเป็นนิยามและตัวเลข",
      items: ALL_TOPICS.filter((t) => t.weight === 4),
    },
    {
      title: "ชั้นที่ 3 — อ่านให้ตอบได้",
      desc: "คะแนนไม่มาก อ่านให้เข้าใจหลักการพอ ไม่ต้องท่องละเอียด",
      items: ALL_TOPICS.filter((t) => t.weight <= 3),
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <Reveal>
        <SectionLabel>เนื้อหา</SectionLabel>
        <h1 className="rule-draw text-[30px] font-bold tracking-tight text-ink-900 sm:text-[38px]">
          เนื้อหาครบทุกหมวด
        </h1>
        <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-ink-600">
          ทั้งหมด {ALL_TOPICS.length} หมวด {countSections()} หัวข้อย่อย
          เรียบเรียงจากคำอธิบายรายวิชาในหลักสูตรประมงของมหาวิทยาลัยเกษตรศาสตร์
          เอกสารบรรยายของคณะ และฐานข้อมูลสากลที่ตรวจสอบได้
          แต่ละหัวข้อย่อยมีส่วน <span className="font-medium text-ink-800">จุดที่มักออกสอบ</span>{" "}
          และแหล่งอ้างอิงกำกับไว้ท้ายหัวข้อ
        </p>
      </Reveal>

      <Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { n: ALL_TOPICS.length, l: "หมวดเนื้อหา" },
            { n: countSections(), l: "หัวข้อย่อย" },
            { n: ALL_TOPICS.filter((t) => t.weight === 5).length, l: "หมวดที่ต้องได้เต็ม" },
          ].map((s) => (
            <div key={s.l} className="rounded-xl border border-ink-100 bg-white px-5 py-4">
              <p className="text-[24px] font-bold leading-none text-sea-800">{s.n}</p>
              <p className="mt-1.5 text-[12.5px] text-ink-500">{s.l}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {groups.map((g, gi) => (
        <section key={g.title} className="mt-12">
          <Reveal>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-[19px] font-bold text-ink-900">{g.title}</h2>
              <span className="text-[12.5px] text-ink-400">{g.items.length} หมวด</span>
            </div>
            <p className="mt-1.5 text-[13px] text-ink-500">{g.desc}</p>
          </Reveal>

          <div className="mt-5 space-y-3">
            {g.items.map((t, i) => (
              <Reveal key={t.slug} delay={i * 40}>
                <div className="card-surface card-surface-hover group rounded-xl p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-[16.5px] font-semibold text-ink-900">
                          <Link
                            href={`/topics/${t.slug}`}
                            className="transition-colors hover:text-sea-700"
                          >
                            {t.title}
                          </Link>
                        </h3>
                        <WeightBadge weight={t.weight} />
                      </div>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-ink-600">
                        {t.tagline}
                      </p>
                    </div>
                    <span className="shrink-0 text-[12px] text-ink-400">
                      {t.sections.length} หัวข้อย่อย · {t.minutes} นาที
                    </span>
                  </div>
                  <p className="mt-3 border-t border-ink-50 pt-3 text-[12.5px] leading-relaxed text-ink-500">
                    <span className="font-medium text-sea-700">พื้นฐานชีววิทยาที่ใช้: </span>
                    {t.bioBridge}
                  </p>
                  <div className="mt-3.5 flex flex-wrap gap-2">
                    <Link
                      href={`/read/${t.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-sea-800 px-3.5 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-sea-900"
                    >
                      อ่านไล่ทีละช่วง
                    </Link>
                    <Link
                      href={`/topics/${t.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3.5 py-2 text-[12.5px] font-medium text-ink-700 transition-colors hover:border-sea-300 hover:text-sea-700"
                    >
                      ดูเต็มหน้า
                    </Link>
                    <Link
                      href={`/quiz/topic/${t.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3.5 py-2 text-[12.5px] font-medium text-ink-700 transition-colors hover:border-sea-300 hover:text-sea-700"
                    >
                      ทดสอบหมวดนี้
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {gi < groups.length - 1 && (
            <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-ink-200 to-transparent" />
          )}
        </section>
      ))}
    </div>
  );
}
