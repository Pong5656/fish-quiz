import type { Metadata } from "next";
import Link from "next/link";
import { ALL_TOPICS } from "@/data";
import { PREP_TIMELINE } from "@/data/competition";
import { TRICKS } from "@/data/tricks";
import { Reveal } from "@/components/reveal";
import { SectionLabel, WeightBadge } from "@/components/ui";

export const metadata: Metadata = {
  title: "แผนติว 30 วัน",
  description:
    "ตารางติวความรู้ทางการประมง 30 วันก่อนสอบ จัดลำดับตามน้ำหนักคะแนนของแต่ละหมวด พร้อมเกณฑ์ตัดสินว่าอ่านจบหรือยัง",
};

export default function PlanPage() {
  const sorted = [...ALL_TOPICS].sort(
    (a, b) => b.weight - a.weight || a.order - b.order,
  );
  const priority = sorted.filter((t) => t.weight >= 4);
  const secondary = sorted.filter((t) => t.weight === 3);
  const light = sorted.filter((t) => t.weight <= 2);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Reveal>
        <SectionLabel>วางแผนก่อนอ่าน</SectionLabel>
        <h1 className="rule-draw text-[30px] font-bold tracking-tight text-ink-900 sm:text-[38px]">
          แผนติว 30 วัน
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-ink-600">
          แผนนี้จัดลำดับจากน้ำหนักคะแนน ไม่ใช่จากจำนวนหน้าที่อ่าน
          โดยดึงเอาหมวดที่ตรงกับหัวข้อรอบที่สองและหมวดที่ออกทั้งสองรอบขึ้นก่อน
          แล้วค่อยอ่านหมวดความรู้ทั่วไปแบบรวบรัด เนื้อหาทุกหมวดอยู่ในเว็บนี้แล้ว
          จึงอ่านไล่ตามลำดับได้เลยโดยไม่ต้องเปิดแหล่งอื่นประกอบ
        </p>
      </Reveal>

      {/* สามชั้นของความสำคัญ */}
      <Reveal>
        <section className="mt-10 grid gap-px overflow-hidden rounded-xl border border-ink-100 bg-ink-100 sm:grid-cols-3">
          {[
            {
              t: "ชั้นที่ 1 — ต้องได้เต็ม",
              n: priority.length,
              d: "ตรงกับหัวข้อรอบที่สอง หรือออกทั้งสองรอบ",
              cls: "text-rose-700",
            },
            {
              t: "ชั้นที่ 2 — สำคัญปานกลาง",
              n: secondary.length,
              d: "ออกในรอบแรกเป็นหลัก จำหลักการและตัวเลข",
              cls: "text-sea-700",
            },
            {
              t: "ชั้นที่ 3 — อ่านพอเข้าใจ",
              n: light.length,
              d: "คะแนนไม่มาก อ่านให้ตอบได้โดยไม่ต้องท่องละเอียด",
              cls: "text-ink-500",
            },
          ].map((s) => (
            <div key={s.t} className="bg-white px-5 py-5">
              <p className={`text-[22px] font-bold leading-none ${s.cls}`}>{s.n}</p>
              <p className="mt-2 text-[13.5px] font-semibold text-ink-800">{s.t}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-ink-500">{s.d}</p>
            </div>
          ))}
        </section>
      </Reveal>

      {/* ตารางเวลา */}
      <Reveal>
        <section className="mt-14">
          <h2 className="rule-draw text-[24px] font-bold text-ink-900">
            ตารางเวลา 30 วัน
          </h2>
          <p className="mt-4 text-[14px] leading-relaxed text-ink-600">
            กำหนดเวลาต่อวันเป็นค่าประมาณสำหรับคนที่ติววันละ 1–1.5 ชั่วโมง
            ถ้ามีเวลามากกว่านี้ให้เพิ่มเวลาทบทวน ไม่ใช่เพิ่มเนื้อหาใหม่
          </p>

          <div className="mt-8 space-y-5">
            {PREP_TIMELINE.map((item, i) => (
              <Reveal key={item.date} delay={i * 45}>
                <article className="flex gap-5 rounded-xl border border-ink-100 bg-white p-5">
                  <div className="shrink-0">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-sea-800 px-2.5 py-1.5 text-[12px] font-semibold text-white">
                      ช่วงที่ {i + 1}
                    </span>
                    <p className="mt-2 text-center text-[11.5px] text-ink-400">
                      {item.date.replace("ก่อนสอบ ", "")}
                    </p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[16px] font-semibold leading-snug text-ink-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-ink-600">
                      {item.detail}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ลำดับหมวดที่แนะนำ */}
      <Reveal>
        <section className="mt-14">
          <h2 className="rule-draw text-[24px] font-bold text-ink-900">
            ลำดับหมวดที่แนะนำให้อ่าน
          </h2>
          <p className="mt-4 text-[14px] leading-relaxed text-ink-600">
            ตัวเลขหน้าชื่อคือลำดับที่ควรอ่านตามแผน ส่วนป้ายด้านขวาบอกว่าหมวดนั้น
            ต้องอ่านลึกแค่ไหนตามน้ำหนักคะแนน
          </p>

          <ol className="mt-8 overflow-hidden rounded-xl border border-ink-100 bg-white">
            {sorted.map((t, i) => (
              <li key={t.slug} className="border-b border-ink-50 last:border-0">
                <Link
                  href={`/topics/${t.slug}`}
                  className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-sea-50"
                >
                  <span className="w-6 shrink-0 text-[13px] font-semibold text-ink-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold text-ink-900">
                      {t.title}
                    </span>
                    <span className="mt-0.5 block text-[12.5px] leading-snug text-ink-500">
                      {t.tagline}
                    </span>
                  </span>
                  <span className="hidden shrink-0 sm:block">
                    <WeightBadge weight={t.weight} />
                  </span>
                  <span className="shrink-0 text-[12px] text-ink-400">{t.minutes}′</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </Reveal>

      {/* เกณฑ์ว่าอ่านจบหรือยัง */}
      <Reveal>
        <section className="mt-14 rounded-xl border border-ink-100 bg-white p-6">
          <h2 className="text-[20px] font-bold text-ink-900">
            เกณฑ์ตัดสินว่า “อ่านจบ” จริง
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-ink-600">
            การอ่านจบไม่ได้หมายถึงอ่านผ่านตา แต่หมายถึงตอบคำถามเหล่านี้ได้โดยไม่เปิดดู
            ถ้าข้อไหนตอบไม่ได้ ให้กลับไปอ่านเฉพาะหัวข้อนั้นก่อนไปหมวดต่อไป
          </p>
          <ul className="mt-5 space-y-3">
            {[
              "อธิบายหัวข้อนั้นด้วยคำของตัวเองได้ใน 3 ประโยค โดยไม่เปิดเอกสาร",
              "ตอบคำถามในส่วน “จุดที่มักออกสอบ” ของหมวดนั้นได้ทุกข้อ",
              "วาดแผนภาพของหัวข้อนั้นได้ ถ้าหัวข้อนั้นเป็นกระบวนการ (วัฏจักรไนโตรเจน เหงือก ห่วงโซ่อาหาร)",
              "ยกตัวอย่างพร้อมชื่อวิทยาศาสตร์ได้ ถ้าหัวข้อนั้นเป็นเรื่องชนิดพันธุ์",
              "รู้ว่าหัวข้อนั้นเชื่อมกับชีววิทยาที่เรียนมาแล้วตรงไหน จึงจะจำได้นานกว่าเดิม",
            ].map((g, i) => (
              <li key={g} className="flex gap-3 text-[13.5px] leading-relaxed text-ink-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sea-50 text-[11px] font-bold text-sea-700">
                  {i + 1}
                </span>
                {g}
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      {/* ทริกที่ต้องอ่านคู่กัน */}
      <Reveal>
        <section className="mt-14">
          <h2 className="rule-draw text-[24px] font-bold text-ink-900">
            ทริกที่ควรอ่านก่อนเริ่ม 4 ข้อ
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {TRICKS.filter((t) =>
              [
                "two-round-strategy",
                "spaced-repeat",
                "team-split",
                "mock-under-time",
              ].includes(t.id),
            ).map((t, i) => (
              <Reveal key={t.id} delay={i * 50}>
                <article className="flex h-full flex-col rounded-xl border border-ink-100 bg-white p-5">
                  <span className="text-[11.5px] font-semibold uppercase tracking-wide text-sea-600">
                    {t.category}
                  </span>
                  <h3 className="mt-2 text-[15.5px] font-semibold leading-snug text-ink-900">
                    {t.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[13px] leading-relaxed text-ink-600">
                    {t.principle}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
          <div className="mt-6">
            <Link
              href="/tricks"
              className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-sea-700 hover:text-sea-900"
            >
              ดูทริกทั้งหมด {TRICKS.length} ข้อ
              <span aria-hidden>→</span>
            </Link>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
