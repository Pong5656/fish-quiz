import type { Metadata } from "next";
import { COMPETITION_FACTS, PREP_TIMELINE } from "@/data/competition";
import { SourceChip, CautionNote } from "@/components/ui";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "ข้อมูลการแข่งขัน",
  description:
    "ข้อมูลการแข่งขันความรู้ทางการประมง งานเกษตรกำแพงแสน คณะประมง มก. วิทยาเขตกำแพงแสน รูปแบบการแข่งขัน จำนวนข้อ และหัวข้อที่ประกาศ พร้อมระบุว่าข้อมูลใดยืนยันแล้ว",
};

export default function CompetitionPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Reveal>
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-sea-600">
          ก่อนเริ่มติว
        </p>
        <h1 className="rule-draw mt-2 text-[30px] font-bold tracking-tight text-ink-900 sm:text-[38px]">
          ข้อมูลการแข่งขัน
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-ink-600">
          หน้านี้รวบรวมข้อเท็จจริงของการแข่งขันที่ตรวจสอบจากประกาศของคณะประมง
          มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน โดยแยกชัดเจนว่าข้อใด
          <strong className="font-semibold text-ink-800"> ยืนยันแล้ว</strong> และข้อใด
          <strong className="font-semibold text-ink-800"> ยังไม่เปิดเผยต่อสาธารณะ</strong>{" "}
          เพื่อไม่ให้เข้าใจผิดว่าสิ่งที่ไม่มีหลักฐานคือข้อเท็จจริง
        </p>
      </Reveal>

      <div className="mt-10 space-y-8">
        {COMPETITION_FACTS.map((block, bi) => (
          <Reveal key={block.title} delay={bi * 50}>
            <section className="overflow-hidden rounded-xl border border-ink-100 bg-white">
              <div className="border-b border-ink-100 bg-ink-50/60 px-5 py-3.5">
                <h2 className="text-[15.5px] font-semibold text-ink-900">{block.title}</h2>
              </div>

              <dl className="divide-y divide-ink-50">
                {block.rows.map((row) => (
                  <div
                    key={row.label}
                    className="grid gap-1.5 px-5 py-4 sm:grid-cols-[190px_1fr] sm:gap-5"
                  >
                    <dt className="text-[13px] font-medium text-ink-500">{row.label}</dt>
                    <dd className="text-[14px] leading-relaxed text-ink-800">
                      <span>{row.value}</span>
                      <span className="mt-1.5 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium ${
                            row.confirmed
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-amber-200 bg-amber-50 text-amber-800"
                          }`}
                        >
                          <span aria-hidden>{row.confirmed ? "✓" : "?"}</span>
                          {row.confirmed ? "ยืนยันแล้ว" : "ยังไม่ยืนยัน"}
                        </span>
                        {row.sourceId && <SourceChip id={row.sourceId} />}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>

              {block.note && (
                <div className="border-t border-ink-100 bg-sand-50 px-5 py-4">
                  <p className="text-[13px] leading-relaxed text-ink-600">{block.note}</p>
                </div>
              )}
            </section>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-8">
          <CautionNote>
            <strong className="font-semibold">สิ่งที่ต้องทำเองทุกครั้ง:</strong>{" "}
            กำหนดการ จำนวนข้อ และหัวข้อของแต่ละปีเปลี่ยนได้
            ให้เปิดเพจ <span className="font-medium">facebook.com/fishkps</span>{" "}
            และระบบรับสมัคร <span className="font-medium">sites.google.com/ku.th/studentcontest</span>{" "}
            ของมหาวิทยาลัยเกษตรศาสตร์ เพื่อตรวจประกาศของปีที่คุณจะแข่งขันก่อนเสมอ
            เนื้อหาบนเว็บนี้ใช้ได้ทุกปี แต่กำหนดการไม่คงที่
          </CautionNote>
        </div>
      </Reveal>

      <Reveal>
        <section className="mt-14">
          <h2 className="rule-draw text-[24px] font-bold text-ink-900">
            ลำดับการเตรียมตัวก่อนวันสอบ
          </h2>
          <p className="mt-4 text-[14px] leading-relaxed text-ink-600">
            ลำดับนี้จัดตามน้ำหนักคะแนนของแต่ละหมวด ไม่ได้แบ่งเวลาที่ละเท่ากัน
            เพราะหัวข้อรอบที่สองมีคะแนนมากกว่าและถูกประกาศล่วงหน้า
          </p>

          <ol className="mt-8 space-y-0">
            {PREP_TIMELINE.map((item, i) => (
              <Reveal key={item.date} delay={i * 45}>
                <li className="relative flex gap-5 pb-8 last:pb-0">
                  <div className="flex flex-col items-center">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-sea-200 bg-white text-[12px] font-bold text-sea-700">
                      {i + 1}
                    </span>
                    {i < PREP_TIMELINE.length - 1 && (
                      <span className="mt-1 w-px flex-1 bg-gradient-to-b from-sea-200 to-ink-100" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 pt-1">
                    <p className="text-[12px] font-semibold uppercase tracking-wide text-sea-600">
                      {item.date}
                    </p>
                    <h3 className="mt-1 text-[16px] font-semibold leading-snug text-ink-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-ink-600">
                      {item.detail}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>
      </Reveal>
    </div>
  );
}
