import type { Metadata } from "next";
import Link from "next/link";
import { ALL_TOPICS, countHotPoints, totalMinutes } from "@/data";
import { Reveal } from "@/components/reveal";
import { SectionLabel, WeightBadge } from "@/components/ui";

export const metadata: Metadata = {
  title: "เส้นทางอ่าน",
  description:
    "ลำดับการอ่านความรู้ทางการประมงทีละขั้น ตั้งแต่วันแรกถึงวันสอบ จัดตามน้ำหนักคะแนนของแต่ละหมวด พร้อมเป้าหมายที่ต้องทำได้ในแต่ละวัน",
};

/** แบ่งลำดับอ่านเป็นด่าน แต่ละด่านมีเป้าหมายชัดเจน */
type Stage = {
  n: number;
  name: string;
  when: string;
  why: string;
  goal: string;
  slugs: string[];
};

export default function PathPage() {
  const bySlug = new Map(ALL_TOPICS.map((t) => [t.slug, t]));

  const stages: Stage[] = [
    {
      n: 1,
      name: "วางพื้นก่อนลงเนื้อหา",
      when: "วันแรก · ประมาณ 1 ชั่วโมง",
      why: "เริ่มจากสิ่งที่โจทย์ถามตรง ๆ และเป็นพื้นฐานของทุกหมวดที่เหลือ ถ้าข้ามด่านนี้จะจำหมวดอื่นแบบท่องจำไม่เข้าใจ",
      goal: "อธิบายได้ว่าปลาต่างจากสัตว์มีกระดูกสันหลังกลุ่มอื่นอย่างไร และเรียกชื่ออวัยวะภายนอกได้ครบ",
      slugs: ["fish-anatomy", "taxonomy"],
    },
    {
      n: 2,
      name: "หัวข้อที่โจทย์ประกาศไว้",
      when: "วันที่ 2–4 · ประมาณ 2.5 ชั่วโมง",
      why: "รอบที่สองของข้อสอบมี 40 ข้อและมีคะแนนมากกว่ารอบแรก หมวดนิเวศวิทยาและอนุกรมวิธานคือใจกลางของหัวข้อนั้น",
      goal: "จัดจำแนกชั้นปลาได้ถึงอันดับ และอธิบายความสัมพันธ์ของปลากับสิ่งแวดล้อมในน้ำได้",
      slugs: ["ecology", "marine-ecology"],
    },
    {
      n: 3,
      name: "ของที่ต้องเลี้ยงให้รอด",
      when: "วันที่ 5–8 · ประมาณ 3 ชั่วโมง",
      why: "คุณภาพน้ำและการเพาะเลี้ยงเป็นหมวดที่ออกทุกปี และเป็นหมวดที่เด็กสายชีววิทยาต่อยอดได้เร็วที่สุด",
      goal: "อธิบายวัฏจักรไนโตรเจนในบ่อได้ครบ พร้อมบอกค่าที่ทำให้ปลาตาย และเลือกระบบเลี้ยงให้ตรงกับโจทย์ได้",
      slugs: ["water-quality", "aquaculture", "nutrition"],
    },
    {
      n: 4,
      name: "โรค อาหาร และพิษในน้ำ",
      when: "วันที่ 9–12 · ประมาณ 2.5 ชั่วโมง",
      why: "โจทย์ชอบถามว่า 'สาเหตุคืออะไร' และ 'ต้องแก้ที่ไหนก่อน' ซึ่งต้องเข้าใจกลไก ไม่ใช่ท่องชื่อโรค",
      goal: "แยกสาเหตุการป่วยสามทางได้ และอธิบายกลไกความเป็นพิษของแอมโมเนียกับสารพิษในสัตว์น้ำได้",
      slugs: ["fish-disease", "toxicology"],
    },
    {
      n: 5,
      name: "เครื่องมือและชนิดพันธุ์เศรษฐกิจ",
      when: "วันที่ 13–17 · ประมาณ 3 ชั่วโมง",
      why: "สองหมวดนี้เป็นข้อสอบเชิงจำแนกและจับคู่ เก็บคะแนนได้แน่นอนถ้าจำชื่อและคุณลักษณะได้",
      goal: "จับคู่เครื่องมือประมงกับชนิดสัตว์น้ำที่จับได้ และเรียกชื่อวิทยาศาสตร์ของชนิดเศรษฐกิจหลักได้",
      slugs: ["economic-species", "fishing-gear"],
    },
    {
      n: 6,
      name: "กฎหมาย สถิติ และการอนุรักษ์",
      when: "วันที่ 18–22 · ประมาณ 2.5 ชั่วโมง",
      why: "เป็นหมวดที่ตัวเลขและชื่อกฎหมายออกชัดเจนที่สุด จำแม่นแล้วได้คะแนนเต็มโดยไม่ต้องตีความ",
      goal: "บอกปีที่ประกาศใช้ ข้อห้ามสำคัญ และตัวเลขสถิติที่โจทย์ชอบถามได้",
      slugs: ["fisheries-law", "conservation", "fisheries-stats"],
    },
    {
      n: 7,
      name: "แปรรูปและของที่เหลือ",
      when: "วันที่ 23–25 · ประมาณ 1.5 ชั่วโมง",
      why: "หมวดนี้คะแนนไม่มากและข้อสอบถามเป็นหลักการกว้าง ๆ อ่านให้ตอบได้ก็พอ ไม่ต้องลงลึก",
      goal: "บอกหลักการถนอมอาหารแต่ละวิธี และยกตัวอย่างผลิตภัณฑ์ได้",
      slugs: ["processing"],
    },
  ];

  const covered = new Set(stages.flatMap((s) => s.slugs));
  const leftovers = ALL_TOPICS.filter((t) => !covered.has(t.slug));

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Reveal>
        <SectionLabel>อ่านตามลำดับ</SectionLabel>
        <h1 className="rule-draw text-[30px] font-bold tracking-tight text-ink-900 sm:text-[38px]">
          เส้นทางอ่าน
        </h1>
        <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-ink-600">
          ถ้าไม่รู้จะเริ่มตรงไหน ให้ไล่ตามด่านทั้ง {stages.length} ด่านนี้จากบนลงล่าง
          แต่ละด่านบอกว่าควรอ่านวันไหน ทำไมต้องอ่านตอนนั้น
          และอ่านจบแล้วต้องทำอะไรได้ — ทั้งหมด {ALL_TOPICS.length} หมวด{" "}
          {countHotPoints()} จุดที่มักออกสอบ รวมเวลาอ่านประมาณ {totalMinutes()} นาที
        </p>
      </Reveal>

      <Reveal>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            { n: stages.length, l: "ด่านการอ่าน" },
            { n: ALL_TOPICS.length, l: "หมวดเนื้อหา" },
            { n: `${Math.round(totalMinutes() / 60)} ชม.`, l: "เวลาอ่านรวม" },
          ].map((s) => (
            <div key={s.l} className="rounded-xl border border-ink-100 bg-white px-5 py-4">
              <p className="text-[24px] font-bold leading-none text-sea-800">{s.n}</p>
              <p className="mt-1.5 text-[12.5px] text-ink-500">{s.l}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ── ด่านทั้งหมด ── */}
      <ol className="mt-12 space-y-0">
        {stages.map((stage, si) => (
          <Reveal key={stage.n} delay={si * 40}>
            <li className="relative flex gap-5 pb-9 last:pb-0">
              {/* เส้นเชื่อมด่าน */}
              <div className="flex flex-col items-center">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-sea-200 bg-white text-[15px] font-bold text-sea-700">
                  {stage.n}
                </span>
                {si < stages.length - 1 && (
                  <span className="mt-1 w-px flex-1 bg-gradient-to-b from-sea-200 to-ink-100" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-[19px] font-bold text-ink-900">{stage.name}</h2>
                  <span className="rounded-md border border-ink-200 bg-white px-2 py-0.5 text-[11.5px] text-ink-500">
                    {stage.when}
                  </span>
                </div>

                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-600">
                  <span className="font-medium text-ink-800">ทำไมต้องอ่านตอนนี้: </span>
                  {stage.why}
                </p>

                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50/60 px-4 py-3">
                  <p className="text-[13px] leading-relaxed text-emerald-900">
                    <span className="font-semibold">อ่านจบแล้วต้องทำได้: </span>
                    {stage.goal}
                  </p>
                </div>

                {/* หมวดในด่านนี้ */}
                <div className="mt-3 space-y-2">
                  {stage.slugs.map((slug) => {
                    const t = bySlug.get(slug);
                    if (!t) return null;
                    return (
                      <div
                        key={slug}
                        className="card-surface card-surface-hover rounded-xl p-4"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/read/${t.slug}`}
                            className="text-[15px] font-semibold text-ink-900 hover:text-sea-700"
                          >
                            {t.title}
                          </Link>
                          <WeightBadge weight={t.weight} />
                          <span className="text-[11.5px] text-ink-400">
                            {t.sections.length} ช่วง · {t.minutes} นาที
                          </span>
                        </div>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-ink-600">
                          {t.tagline}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Link
                            href={`/read/${t.slug}`}
                            className="rounded-lg bg-sea-800 px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-sea-900"
                          >
                            อ่านไล่ทีละช่วง
                          </Link>
                          <Link
                            href={`/topics/${t.slug}`}
                            className="rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-[12px] font-medium text-ink-700 transition-colors hover:border-sea-300 hover:text-sea-700"
                          >
                            ดูเต็มหน้า
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>

      {/* ── หมวดที่เหลือ ── */}
      {leftovers.length > 0 && (
        <Reveal>
          <section className="mt-12 rounded-xl border border-amber-200 bg-amber-50/50 p-5">
            <h2 className="text-[16px] font-bold text-amber-900">
              หมวดที่ยังไม่อยู่ในด่านไหน ({leftovers.length} หมวด)
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-amber-950/80">
              หมวดเหล่านี้จะอ่านเมื่อไหร่ก็ได้ แต่ควรอ่านหลังจบด่านที่ตรงกับมัน
              เพราะใช้ศัพท์และหลักการร่วมกัน
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {leftovers.map((t) => (
                <Link
                  key={t.slug}
                  href={`/read/${t.slug}`}
                  className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-amber-900 transition-colors hover:border-amber-400"
                >
                  {t.title}
                </Link>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* ── หลังอ่านจบทุกด่าน ── */}
      <Reveal>
        <section className="mt-12 rounded-xl border border-sea-200 bg-sea-50/60 p-6">
          <h2 className="text-[18px] font-bold text-sea-900">
            หลังอ่านจบครบทุกด่านแล้ว ให้ทำอะไรต่อ
          </h2>
          <ol className="mt-4 space-y-3">
            {[
              {
                t: "ทำข้อสอบจำลองแบบจับเวลา",
                d: "เริ่มจากชุดรอบแรก 30 ข้อ แล้วต่อด้วยรอบที่สอง 40 ข้อ ทำครั้งเดียวไม่หยุด ไม่เปิดเนื้อหาระหว่างทำ",
                href: "/quiz",
                cta: "ไปหน้าข้อสอบ",
              },
              {
                t: "เก็บข้อที่ตอบผิดทั้งหมด",
                d: "หน้าเฉลยจะบอกว่าข้อที่ผิดตรงกับหมวดใด ให้กลับไปอ่านเฉพาะช่วงนั้นในโหมดอ่านไล่",
                href: "/read/fish-anatomy",
                cta: "ดูตัวอย่างโหมดอ่านไล่",
              },
              {
                t: "ทวนบัตรคำทุกวันจนถึงวันสอบ",
                d: "ใช้ตัวกรองเฉพาะใบที่ยังไม่แม่น ทบทวนวันละ 10 นาที ต่อเนื่องกว่าอัดครั้งเดียว",
                href: "/flashcards",
                cta: "ไปทวนบัตรคำ",
              },
              {
                t: "อ่านทริกการแข่งก่อนวันสอบ 2 วัน",
                d: "โดยเฉพาะการบริหารเวลาในห้องสอบ และการแบ่งงานกับเพื่อนร่วมทีม",
                href: "/tricks",
                cta: "ดูทริกทั้งหมด",
              },
            ].map((s, i) => (
              <li key={s.t} className="flex gap-3.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-sea-800 text-[11.5px] font-semibold text-white">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold text-ink-900">{s.t}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink-600">{s.d}</p>
                  <Link
                    href={s.href}
                    className="mt-2 inline-block text-[12.5px] font-semibold text-sea-700 hover:text-sea-900"
                  >
                    {s.cta} →
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </Reveal>
    </div>
  );
}
