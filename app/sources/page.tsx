import type { Metadata } from "next";
import { SOURCES, ALL_TOPICS, SOURCE_BY_ID } from "@/data";
import { Reveal } from "@/components/reveal";
import { CautionNote, SectionLabel } from "@/components/ui";

export const metadata: Metadata = {
  title: "แหล่งอ้างอิง",
  description:
    "ทะเบียนแหล่งอ้างอิงทั้งหมดที่ใช้เรียบเรียงเนื้อหาความรู้ทางการประมงบนเว็บนี้ พร้อมระบุว่าข้อมูลจากแต่ละแหล่งใช้ยืนยันเรื่องใด",
};

/** นับว่าแต่ละแหล่งถูกอ้างในหมวดใดบ้าง */
function usage(): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const t of ALL_TOPICS) {
    for (const s of t.sections) {
      for (const id of s.sources ?? []) {
        const arr = map.get(id) ?? [];
        if (!arr.includes(t.slug)) arr.push(t.slug);
        map.set(id, arr);
      }
    }
  }
  return map;
}

export default function SourcesPage() {
  const used = usage();
  const kinds = [...new Set(SOURCES.map((s) => s.kind))];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Reveal>
        <SectionLabel>ตรวจสอบได้</SectionLabel>
        <h1 className="rule-draw text-[30px] font-bold tracking-tight text-ink-900 sm:text-[38px]">
          แหล่งอ้างอิง
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-ink-600">
          ทั้งหมด {SOURCES.length} รายการ จาก {kinds.length} ประเภท
          ทุกหัวข้อเนื้อหาบนเว็บนี้มีป้ายแหล่งอ้างอิงกำกับไว้ท้ายหัวข้อ
          และหน้านี้รวมทุกแหล่งไว้ในที่เดียว พร้อมบอกว่าแหล่งนั้นใช้ยืนยันเรื่องใด
          เพื่อให้ตรวจสอบย้อนกลับได้เอง
        </p>
      </Reveal>

      <Reveal>
        <div className="mt-8 flex flex-wrap gap-2">
          {kinds.map((k) => (
            <span
              key={k}
              className="rounded-md border border-ink-200 bg-white px-2.5 py-1 text-[12px] text-ink-600"
            >
              {k}{" "}
              <span className="text-ink-400">
                {SOURCES.filter((s) => s.kind === k).length}
              </span>
            </span>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-8">
          <CautionNote>
            <strong className="font-semibold">หลักการเลือกแหล่งอ้างอิงบนเว็บนี้:</strong>{" "}
            ยึดสามกลุ่มก่อนเสมอ คือ (1) เอกสารและหลักสูตรของคณะประมง
            มหาวิทยาลัยเกษตรศาสตร์ (2) เอกสารและฐานข้อมูลของกรมประมง
            และ (3) ฐานข้อมูลสากลที่แก้ไขโดยผู้เชี่ยวชาญ (FishBase, WoRMS, IUCN)
            ถ้าข้อมูลจากเว็บติวหรือชีทขายให้ค่าต่างออกไป จะไม่นำมาใช้เป็นหลัก
            และถ้าตัวเลขต่างกันตามแหล่ง จะระบุหลักการไว้แทนการยืนยันค่าตายตัว
          </CautionNote>
        </div>
      </Reveal>

      <div className="mt-10 space-y-4">
        {kinds.map((kind, ki) => (
          <Reveal key={kind} delay={ki * 40}>
            <section className="overflow-hidden rounded-xl border border-ink-100 bg-white">
              <div className="border-b border-ink-100 bg-ink-50/60 px-5 py-3">
                <h2 className="text-[14.5px] font-semibold text-ink-900">{kind}</h2>
              </div>

              <ul className="divide-y divide-ink-50">
                {SOURCES.filter((s) => s.kind === kind).map((s) => {
                  const topics = used.get(s.id) ?? [];
                  return (
                    <li key={s.id} className="px-5 py-4">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block"
                      >
                        <p className="text-[14.5px] font-semibold leading-snug text-ink-900 group-hover:text-sea-700">
                          {s.title}
                        </p>
                        <p className="mt-1 text-[12.5px] text-ink-500">{s.org}</p>
                        <p className="mt-0.5 break-all font-mono text-[11.5px] text-sea-600 group-hover:underline">
                          {s.url}
                        </p>
                      </a>

                      <p className="mt-2.5 text-[13px] leading-relaxed text-ink-600">
                        <span className="font-medium text-ink-700">ใช้ยืนยัน: </span>
                        {s.note}
                      </p>

                      {topics.length > 0 && (
                        <p className="mt-2 text-[11.5px] text-ink-400">
                          อ้างในหมวด:{" "}
                          {topics
                            .map((slug) => ALL_TOPICS.find((t) => t.slug === slug)?.short ?? slug)
                            .join(" · ")}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <section className="mt-12 rounded-xl border border-ink-100 bg-white p-6">
          <h2 className="text-[17px] font-bold text-ink-900">
            สิ่งที่ยังตรวจสอบจากต้นทางโดยตรงไม่ได้
          </h2>
          <p className="mt-3 text-[13.5px] leading-relaxed text-ink-600">
            เพื่อความโปร่งใส รายการต่อไปนี้ถูกระบุไว้อย่างชัดเจนว่า
            <span className="font-medium text-ink-800"> ยังไม่ยืนยัน</span>{" "}
            และไม่ได้นำมาใช้เป็นข้อเท็จจริงในเนื้อหา
          </p>
          <ul className="mt-4 space-y-2.5 text-[13px] leading-relaxed text-ink-600">
            <li>
              · ข้อสอบจริงฉบับเต็มและเฉลยอย่างเป็นทางการของการแข่งขัน
              — มีเฉพาะในรูปภาพโพสต์ของเพจ อ่านเป็นข้อความไม่ได้
            </li>
            <li>
              · ไฟล์คะแนนและไฟล์รายชื่อทีม — อยู่ใน Google Drive ที่ต้องเข้าสู่ระบบ
            </li>
            <li>
              · เอกสารบรรยายฉบับเต็มที่ตรงกับหัวข้อรอบที่สอง — หน้าเข้าถึงถูกจำกัดสิทธิ์
            </li>
            <li>
              · ค่า pH และค่าคุณภาพน้ำที่เจาะจงสำหรับสัตว์น้ำแต่ละชนิดเป็นรายชนิด
              — ใช้ช่วงมาตรฐานกว้างของกรมประมงแทน
            </li>
          </ul>
          <p className="mt-4 text-[13px] leading-relaxed text-ink-600">
            ค่าที่ไม่ยืนยันจะไม่ถูกใส่ในเนื้อหา ถ้าจำเป็นต้องกล่าวถึง
            จะกล่าวเป็นหลักการและบอกช่วงค่าที่แหล่งหลักระบุ
            เพื่อไม่ให้จำค่าผิดติดไปในห้องสอบ
          </p>
        </section>
      </Reveal>

      <Reveal>
        <p className="mt-8 text-[12.5px] leading-relaxed text-ink-400">
          หมายเหตุ: แหล่งข้อมูลทั้งหมดข้างต้นเป็นของผู้จัดทำแต่ละราย
          เว็บนี้เพียงรวบรวมและอ้างอิงเพื่อการเตรียมตัวสอบเป็นการส่วนตัว
          ไม่ได้เป็นตัวแทนของคณะประมงหรือมหาวิทยาลัยเกษตรศาสตร์
          และไม่ได้เผยแพร่เนื้อหาของแหล่งต้นทางซ้ำทั้งฉบับ
        </p>
      </Reveal>
    </div>
  );
}
