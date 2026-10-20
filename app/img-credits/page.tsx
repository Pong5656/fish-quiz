import type { Metadata } from "next";
import Link from "next/link";
import { ALL_TOPICS, getTopic } from "@/data";
import { PHOTOS, shortLicense } from "@/data/photos";
import { Reveal } from "@/components/reveal";
import { SectionLabel } from "@/components/ui";

export const metadata: Metadata = {
  title: "ที่มาของภาพประกอบ",
  description:
    "รายการภาพประกอบทั้งหมดที่ใช้บนเว็บติว ความรู้ทางการประมง ทั้งภาพถ่ายจริงและแผนภาพ พร้อมระบุที่มา ผู้สร้าง และสัญญาอนุญาตครบถ้วน",
};

function collectDiagrams() {
  const out: {
    src: string;
    alt: string;
    credit: string;
    creditUrl: string;
    topic: string;
    slug: string;
  }[] = [];
  for (const t of ALL_TOPICS) {
    for (const s of t.sections) {
      if (s.image) {
        out.push({ ...s.image, topic: t.title, slug: t.slug });
      }
    }
  }
  return out;
}

export default function ImgCreditsPage() {
  const diagrams = collectDiagrams();
  const licenses = new Set(PHOTOS.map((p) => shortLicense(p.license)));

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Reveal>
        <SectionLabel>ความโปร่งใส</SectionLabel>
        <h1 className="rule-draw text-[30px] font-bold tracking-tight text-ink-900 sm:text-[36px]">
          ที่มาของภาพประกอบ
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-ink-600">
          เว็บนี้ใช้ภาพประกอบสองประเภท คือ{" "}
          <strong className="font-medium">ภาพถ่ายจริง</strong> จาก Wikimedia Commons
          ซึ่งคัดเฉพาะภาพที่สัญญาอนุญาตเปิดให้ใช้ซ้ำได้ จำนวน {PHOTOS.length} ภาพ
          และ <strong className="font-medium">แผนภาพที่วาดขึ้นเอง</strong> จำนวน{" "}
          {diagrams.length} ภาพ สำหรับอธิบายโครงสร้างที่ภาพถ่ายแสดงไม่ชัด
          ทุกภาพระบุที่มา ผู้สร้าง และสัญญาอนุญาตไว้ในหน้านี้
          รวมทั้งในแคปชันใต้ภาพของแต่ละหัวข้อ
        </p>
      </Reveal>

      {/* ── ภาพถ่ายจริง ── */}
      <section className="mt-10">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-[18px] font-bold text-ink-900">ภาพถ่ายจริง ({PHOTOS.length})</h2>
          <Link
            href="/photos"
            className="text-[12.5px] font-medium text-sea-700 hover:underline"
          >
            ดูคลังภาพทั้งหมด ↗
          </Link>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-500">
          ภาพทุกภาพมาจาก Wikimedia Commons ภายใต้สัญญาอนุญาต{" "}
          {[...licenses].join(" · ")} ซึ่งอนุญาตให้ใช้ซ้ำได้โดยต้องระบุที่มา
          และสัญญาอนุญาตตามเงื่อนไข
        </p>

        <ul className="mt-5 space-y-4">
          {PHOTOS.map((p) => {
            const t = getTopic(p.topic);
            return (
              <Reveal key={p.key}>
                <li className="overflow-hidden rounded-xl border border-ink-100 bg-white">
                  <div className="bg-sand-50 p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.file}
                      alt={p.title}
                      loading="lazy"
                      className="mx-auto h-auto max-h-64 w-auto rounded-lg border border-ink-100 bg-white"
                    />
                  </div>
                  <div className="border-t border-ink-100 px-5 py-4">
                    <p className="text-[14px] font-semibold text-ink-900">{p.title}</p>
                    {p.description && (
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-600">
                        {p.description}
                      </p>
                    )}
                    <dl className="mt-3 space-y-1 text-[12.5px]">
                      <div className="flex gap-2">
                        <dt className="w-24 shrink-0 text-ink-400">ผู้สร้าง</dt>
                        <dd className="text-ink-700">{p.author}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="w-24 shrink-0 text-ink-400">สัญญาอนุญาต</dt>
                        <dd className="text-ink-700">{shortLicense(p.license)}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="w-24 shrink-0 text-ink-400">ใช้ในหมวด</dt>
                        <dd className="text-ink-700">{t ? t.title : p.topic}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="w-24 shrink-0 text-ink-400">ไฟล์</dt>
                        <dd className="break-all font-mono text-ink-600">{p.file}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="w-24 shrink-0 text-ink-400">ต้นทาง</dt>
                        <dd>
                          <a
                            href={p.pageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="break-all text-sea-700 hover:underline"
                          >
                            {p.pageUrl}
                          </a>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </li>
              </Reveal>
            );
          })}
        </ul>
      </section>

      {/* ── แผนภาพวาดเอง ── */}
      <section className="mt-12">
        <h2 className="text-[18px] font-bold text-ink-900">
          แผนภาพวาดขึ้นเอง ({diagrams.length})
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-500">
          แผนภาพเหล่านี้วาดขึ้นสำหรับเว็บนี้โดยเฉพาะ เพื่อชี้ตำแหน่งอวัยวะ
          และโครงสร้างที่ข้อสอบถามบ่อย แต่ภาพถ่ายจริงแสดงไม่ชัด
          ใช้ได้อย่างเสรีภายในเว็บนี้
        </p>

        <ul className="mt-5 space-y-4">
          {diagrams.map((img) => (
            <Reveal key={img.src}>
              <li className="overflow-hidden rounded-xl border border-ink-100 bg-white">
                <div className="bg-sand-50 p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="mx-auto h-auto max-h-64 w-auto rounded-lg border border-ink-100 bg-white"
                  />
                </div>
                <div className="border-t border-ink-100 px-5 py-4">
                  <p className="text-[14px] font-semibold text-ink-900">{img.alt}</p>
                  <dl className="mt-2.5 space-y-1 text-[12.5px]">
                    <div className="flex gap-2">
                      <dt className="w-24 shrink-0 text-ink-400">ที่มา</dt>
                      <dd className="text-ink-700">{img.credit}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-24 shrink-0 text-ink-400">ไฟล์</dt>
                      <dd className="break-all font-mono text-ink-600">{img.src}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-24 shrink-0 text-ink-400">ใช้ในหมวด</dt>
                      <dd className="text-ink-700">{img.topic}</dd>
                    </div>
                  </dl>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      <Reveal>
        <section className="mt-10 rounded-xl border border-ink-100 bg-white p-6">
          <h2 className="text-[16.5px] font-bold text-ink-900">การใช้ภาพต่อจากเว็บนี้</h2>
          <p className="mt-3 text-[13.5px] leading-relaxed text-ink-600">
            ภาพถ่ายจริงทุกภาพมีสัญญาอนุญาตเปิดที่อนุญาตให้ใช้ซ้ำได้
            แต่เงื่อนไขของแต่ละภาพไม่เหมือนกัน ถ้าต้องการนำภาพไปใช้ต่อ
            ให้เปิดลิงก์ต้นทางที่ให้ไว้กับภาพนั้น แล้วปฏิบัติตามเงื่อนไขของเจ้าของภาพ
            ส่วนแผนภาพวาดขึ้นเองใช้ได้อย่างเสรีภายในเว็บนี้
          </p>
          <p className="mt-3 text-[13.5px] leading-relaxed text-ink-600">
            หากพบว่ามีภาพใดที่ที่มาไม่ถูกต้องหรือไม่ควรใช้
            แจ้งผ่านเพจทางการของการแข่งขันได้ และภาพนั้นจะถูกนำออกทันที
          </p>
        </section>
      </Reveal>
    </div>
  );
}
