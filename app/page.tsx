import Link from "next/link";
import { ALL_TOPICS, SOURCES, countHotPoints, totalMinutes } from "@/data";
import { TRICKS } from "@/data/tricks";
import { QUIZ_SETS, TOTAL_QUESTIONS } from "@/data/quiz-sets";
import { FLASHCARDS } from "@/data/flashcards";
import { PHOTOS } from "@/data/photos";
import { PHOTO_QUESTIONS } from "@/data/questions-photos";
import { COMPETITION_FACTS } from "@/data/competition";
import { Counter, Reveal } from "@/components/reveal";
import { LinkCard, SectionLabel } from "@/components/ui";

export default function HomePage() {
  const hot = countHotPoints();
  const minutes = totalMinutes();
  const round2 = COMPETITION_FACTS.find((f) =>
    f.title.includes("รูปแบบการแข่งขัน"),
  );

  return (
    <>
      {/* ── ฮีโร่ ── */}
      <section className="sea-wash relative overflow-hidden border-b border-ink-100">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="animate-rise inline-flex items-center gap-2 rounded-full border border-sea-200 bg-white/70 px-3 py-1 text-[12px] font-medium text-sea-700">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ring absolute inline-flex h-full w-full rounded-full bg-sea-400" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sea-600" />
                </span>
                คณะประมง มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน
              </p>

              <h1
                className="animate-rise mt-5 text-[34px] font-bold leading-[1.18] tracking-tight text-ink-900 sm:text-[46px]"
                style={{ animationDelay: "60ms" }}
              >
                ติวให้ครบทุกหมวด
                <br />
                <span className="text-sea-700">เพื่อชิงที่หนึ่ง</span> การแข่งขัน
                <br className="hidden sm:block" />
                ความรู้ทางการประมง
              </h1>

              <p
                className="animate-rise mt-5 max-w-xl text-[15px] leading-relaxed text-ink-600"
                style={{ animationDelay: "120ms" }}
              >
                เนื้อหาครบทั้ง 15 หมวดตามขอบเขตที่คณะประมงใช้จริง
                พร้อมข้อสอบจำลอง {QUIZ_SETS.length} ชุด บัตรคำ ทริกการแข่งขัน
                และแหล่งอ้างอิงที่ตรวจสอบย้อนกลับได้ทุกหัวข้อ
                ออกแบบสำหรับคนที่เก่งชีววิทยาแต่ยังไม่เคยเรียนประมง
              </p>

              <div
                className="animate-rise mt-8 flex flex-wrap gap-3"
                style={{ animationDelay: "180ms" }}
              >
                <Link
                  href="/path"
                  className="btn-primary inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white"
                >
                  เริ่มอ่านตามเส้นทางที่จัดไว้ให้
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 10h11M10 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link
                  href="/quiz"
                  className="inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-5 py-3 text-sm font-semibold text-ink-800 transition-colors hover:border-sea-300 hover:text-sea-700"
                >
                  ทำข้อสอบจำลองทันที
                </Link>
              </div>

              <p
                className="animate-rise mt-4 text-[12.5px] text-ink-500"
                style={{ animationDelay: "200ms" }}
              >
                มีโหมด <span className="font-medium text-ink-700">อ่านไล่ทีละช่วง</span> พร้อมไฮไลต์คำสำคัญ
                และโหมด <span className="font-medium text-ink-700">ติวทีละข้อ</span> ที่เฉลยทันทีหลังเลือกคำตอบ
              </p>
            </div>

            {/* การ์ดสรุปบนฮีโร่ */}
            <div className="animate-rise" style={{ animationDelay: "220ms" }}>
              <div className="animate-float card-surface rounded-2xl p-6">
                <SectionLabel>ภาพรวมการแข่งขัน</SectionLabel>
                <ul className="space-y-3">
                  {round2?.rows.map((row) => (
                    <li key={row.label} className="border-b border-ink-50 pb-3 last:border-0 last:pb-0">
                      <p className="text-[12px] text-ink-400">{row.label}</p>
                      <p className="mt-0.5 text-[13.5px] font-medium leading-snug text-ink-800">
                        {row.value}
                      </p>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/competition"
                  className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-sea-700 hover:text-sea-900"
                >
                  ดูข้อมูลการแข่งขันทั้งหมด
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* แถบสถิติ */}
          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-ink-100 bg-ink-100 shadow-[0_18px_44px_-30px_rgba(31,87,118,0.5)] sm:grid-cols-3 lg:grid-cols-5">
            {[
              { label: "หมวดเนื้อหา", value: ALL_TOPICS.length, suffix: "" },
              { label: "จุดที่มักออกสอบ", value: hot, suffix: "" },
              { label: "ข้อสอบจำลอง", value: TOTAL_QUESTIONS, suffix: " ข้อ" },
              { label: "ภาพถ่ายจริง", value: PHOTOS.length, suffix: " ภาพ" },
              { label: "นาทีอ่านรวม", value: minutes, suffix: " นาที" },
            ].map((s) => (
              <div key={s.label} className="bg-white px-5 py-5">
                <p className="bg-gradient-to-br from-sea-600 to-sea-900 bg-clip-text text-[26px] font-bold leading-none text-transparent">
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1.5 text-[12.5px] text-ink-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── สิ่งที่ต้องรู้ก่อนเริ่ม ── */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <Reveal>
          <SectionLabel>อ่านตรงจุดก่อน</SectionLabel>
          <h2 className="rule-draw text-[26px] font-bold text-ink-900 sm:text-[30px]">
            สามข้อที่กำหนดว่าควรอ่านอะไรก่อน
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "รอบที่สองมีคะแนนมากกว่ารอบแรก",
              d: "รอบแรก 30 ข้อ ความรู้ทั่วไป รอบที่สอง 40 ข้อ หัวข้อเฉพาะ และนำคะแนนรวมทุกรอบมาตัดสินอันดับ จึงควรถ่วงเวลาไปที่หัวข้อรอบที่สองก่อน",
            },
            {
              n: "02",
              t: "หัวข้อรอบที่สองถูกประกาศล่วงหน้า",
              d: "การแข่งขันครั้งที่ 10 ประกาศหัวข้อว่า ปลา: ความรู้พื้นฐาน อนุกรมวิธาน และนิเวศวิทยา จึงติวให้ตรงหัวข้อได้ ไม่ต้องเดา",
            },
            {
              n: "03",
              t: "พื้นฐานชีววิทยาเดิมช่วยได้มาก",
              d: "กายวิภาค นิเวศวิทยา และอนุกรมวิธานปลาต่อยอดจากชีววิทยา ม.ปลาย ตรง ๆ ต้องเพิ่มเพียงศัพท์เทคนิคและตัวเลขที่ต้องจำ",
            },
          ].map((c, i) => (
            <Reveal key={c.n} delay={i * 70} as="article">
              <div className="flex h-full flex-col rounded-xl border border-ink-100 bg-white p-6">
                <span className="text-[13px] font-bold tracking-widest text-sea-500">{c.n}</span>
                <h3 className="mt-3 text-[16px] font-semibold leading-snug text-ink-900">{c.t}</h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-600">{c.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── ทางเข้าหลัก ── */}
      <section className="border-y border-ink-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Reveal>
            <SectionLabel>ทางเข้าใช้งาน</SectionLabel>
            <h2 className="rule-draw text-[26px] font-bold text-ink-900 sm:text-[30px]">
              ใช้อะไร อยู่ตรงไหน
            </h2>
          </Reveal>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                href: "/path",
                title: "เส้นทางอ่าน",
                desc: "ถ้าไม่รู้จะเริ่มตรงไหน ไล่ตามด่านทั้ง 7 ด่าน บอกว่าวันไหนอ่านอะไร ทำไมต้องอ่านตอนนั้น และอ่านจบแล้วต้องทำอะไรได้",
                meta: "7 ด่าน · ตั้งแต่เริ่มถึงวันสอบ",
              },
              {
                href: "/topics",
                title: "เนื้อหาทั้งหมด",
                desc: "ครบทุกหมวดตามขอบเขตของคณะประมง ตั้งแต่กายวิภาคปลาถึงกฎหมายและพิษวิทยา แต่ละหัวข้อมีจุดที่มักออกสอบและแหล่งอ้างอิงกำกับ",
                meta: `${ALL_TOPICS.length} หมวด · ${hot} จุดที่มักออกสอบ`,
              },
              {
                href: "/quiz",
                title: "ข้อสอบจำลอง",
                desc: "ชุดจำลองแยกรอบแรก–รอบที่สอง ชุดถามจากภาพวาดและภาพถ่ายจริง ชุดเจาะลึกเฉพาะหมวด พร้อมโหมดติวที่เฉลยทีละข้อกับโหมดจับเวลาเหมือนห้องสอบ",
                meta: `${QUIZ_SETS.length} ชุด · ${TOTAL_QUESTIONS} ข้อ`,
              },
              {
                href: "/photos",
                title: "คลังภาพสัตว์น้ำ",
                desc: "ภาพถ่ายจริงของปลา สัตว์น้ำ อุปกรณ์ประมง และระบบเพาะเลี้ยง ที่มีสัญญาอนุญาตเปิด พร้อมเครดิตและลิงก์ต้นทางครบ ใช้ฝึกอ่านชนิดและลักษณะจากตัวจริง",
                meta: `${PHOTOS.length} ภาพ · ${PHOTO_QUESTIONS.length} ข้อสอบจากภาพ`,
              },
              {
                href: "/tricks",
                title: "ทริกการแข่งขัน",
                desc: "กลยุทธ์การแข่งแบบทีมละ 2 คน เทคนิคการจำ การบริหารเวลา และวิธีเดาที่ใช้ได้จริง แยกเป็นหมวดทีละข้อ",
                meta: `${TRICKS.length} ทริก`,
              },
              {
                href: "/flashcards",
                title: "บัตรคำ",
                desc: "ท่องชื่อวิทยาศาสตร์ คำศัพท์ ตัวเลข และนิยามกฎหมายแบบพลิกการ์ด พร้อมระบบทบทวนเฉพาะใบที่ยังไม่แม่น",
                meta: `${FLASHCARDS.length} ใบ`,
              },
              {
                href: "/sources",
                title: "แหล่งอ้างอิง",
                desc: "ทะเบียนแหล่งข้อมูลทั้งหมดที่ใช้เรียบเรียงเนื้อหา พร้อมระบุว่าข้อมูลจากแหล่งนั้นใช้ยืนยันเรื่องใด",
                meta: `${SOURCES.length} รายการ`,
              },
            ].map((c, i) => (
              <Reveal key={c.href} delay={i * 55}>
                <LinkCard {...c} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── แถบภาพถ่ายจริง ── */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <SectionLabel>ภาพถ่ายจริง</SectionLabel>
              <h2 className="rule-draw text-[26px] font-bold text-ink-900 sm:text-[30px]">
                เห็นของจริง ไม่ใช่แค่คำบรรยาย
              </h2>
              <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-ink-600">
                ข้อสอบจริงมีการให้ดูภาพแล้วถามชนิดหรือลักษณะสำคัญ
                เว็บนี้จึงรวบรวมภาพถ่ายจริง {PHOTOS.length} ภาพ
                จาก Wikimedia Commons ที่สัญญาอนุญาตเปิดให้ใช้ได้
                พร้อมเครดิตผู้ถ่ายและลิงก์ต้นทางครบทุกภาพ
                และมีข้อสอบถามจากภาพถ่ายจริงอีก {PHOTO_QUESTIONS.length} ข้อ
              </p>
            </div>
            <Link
              href="/photos"
              className="shrink-0 rounded-lg border border-ink-200 bg-white px-4 py-2 text-[12.5px] font-medium text-ink-700 transition-colors hover:border-sea-300 hover:text-sea-700"
            >
              ดูคลังภาพทั้งหมด →
            </Link>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {["tilapia", "shrimp", "seabass", "gill", "coral-reef", "gillnet"].map((key) => {
              const p = PHOTOS.find((x) => x.key === key);
              if (!p) return null;
              return (
                <Link
                  key={key}
                  href="/photos"
                  className="group relative overflow-hidden rounded-xl border border-ink-100 bg-white"
                  title={p.title}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.file}
                    alt={p.title}
                    loading="lazy"
                    className="h-28 w-full object-cover transition-transform duration-500 group-hover:scale-[1.06] sm:h-32"
                  />
                  <span className="block truncate px-2.5 py-2 text-[11.5px] font-medium text-ink-700">
                    {p.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </Reveal>
      </section>

      {/* ── หมวดที่ต้องได้เต็ม ── */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <Reveal>
          <SectionLabel>ลำดับความสำคัญ</SectionLabel>
          <h2 className="rule-draw text-[26px] font-bold text-ink-900 sm:text-[30px]">
            หมวดที่ให้คะแนนมากที่สุด
          </h2>
          <p className="mt-4 max-w-3xl text-[14px] leading-relaxed text-ink-600">
            จัดเรียงตามน้ำหนักที่ตรงกับกติกาการแข่งขัน ไม่ใช่ตามความยาวของเนื้อหา
            ห้าหมวดแรกควรอ่านให้จบก่อนหมวดอื่นทั้งหมด
          </p>
        </Reveal>

        <div className="mt-8 overflow-hidden rounded-xl border border-ink-100">
          {ALL_TOPICS.filter((t) => t.weight >= 4)
            .slice(0, 6)
            .map((t, i) => (
              <Reveal key={t.slug} delay={i * 45}>
                <Link
                  href={`/topics/${t.slug}`}
                  className="group flex items-center gap-5 border-b border-ink-50 bg-white px-5 py-4 transition-colors last:border-0 hover:bg-sea-50"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sea-800 text-[13px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold text-ink-900">{t.title}</span>
                    <span className="mt-0.5 block text-[13px] text-ink-500">{t.tagline}</span>
                  </span>
                  <span className="hidden shrink-0 text-[12px] font-medium text-ink-400 sm:block">
                    {t.minutes} นาที
                  </span>
                  <span aria-hidden className="shrink-0 text-ink-300 transition-transform group-hover:translate-x-1 group-hover:text-sea-600">
                    →
                  </span>
                </Link>
              </Reveal>
            ))}
        </div>

        <div className="mt-6">
          <Link
            href="/topics"
            className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-sea-700 hover:text-sea-900"
          >
            ดูเนื้อหาทั้ง {ALL_TOPICS.length} หมวด
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
