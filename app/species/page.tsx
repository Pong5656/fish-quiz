import type { Metadata } from "next";
import Link from "next/link";
import {
  KAMPUAN_FISH_COUNT,
  KAMPUAN_INVERTEBRATE_COUNT,
  KAMPUAN_SPECIES_TOTAL,
  KAMPUAN_SOURCE,
  KAMPUAN_ISBN,
  KAMPUAN_FISH_FAMILY_COUNT,
  KAMPUAN_INVERT_FAMILY_COUNT,
} from "@/data/kampuan";
import { SOURCE_BY_ID } from "@/data";
import { Reveal } from "@/components/reveal";
import { SectionLabel, SourceChip } from "@/components/ui";
import { SpeciesCatalog } from "@/components/species-catalog";

export const metadata: Metadata = {
  title: "รายชื่อสัตว์น้ำในป่าชายเลนคลองกาพวน",
  description:
    "รายชื่อชนิดสัตว์น้ำที่สำรวจพบในป่าชายเลนคลองกาพวน จังหวัดระนอง จากเอกสารเผยแพร่ของสถานีวิจัยเพื่อการพัฒนาชายฝั่งอันดามัน คณะประมง มหาวิทยาลัยเกษตรศาสตร์ — สัตว์ไม่มีกระดูกสันหลัง 53 ชนิด และปลา 58 ชนิด",
};

export default function SpeciesPage() {
  const source = SOURCE_BY_ID.get("kampuan-guidebook");

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <Reveal>
        <SectionLabel>เอกสารอ้างอิง</SectionLabel>
        <h1 className="rule-draw text-[30px] font-bold tracking-tight text-ink-900 sm:text-[38px]">
          รายชื่อสัตว์น้ำในป่าชายเลนคลองกาพวน
        </h1>
        <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-ink-600">
          รายชื่อชนิดสัตว์น้ำที่สำรวจพบในป่าชายเลนคลองกาพวน จังหวัดระนอง
          จากเอกสารเผยแพร่ของสถานีวิจัยเพื่อการพัฒนาชายฝั่งอันดามัน คณะประมง มหาวิทยาลัยเกษตรศาสตร์
          รวม {KAMPUAN_SPECIES_TOTAL} ชนิด แยกเป็นสัตว์ไม่มีกระดูกสันหลัง{" "}
          {KAMPUAN_INVERTEBRATE_COUNT} ชนิด และปลา {KAMPUAN_FISH_COUNT} ชนิด
          แต่ละชนิดระบุชื่อวิทยาศาสตร์ ชื่ออังกฤษ และชื่อไทย ค้นหาและกรองตามวงศ์ได้
        </p>
      </Reveal>

      <Reveal>
        <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-ink-100 bg-ink-100 sm:grid-cols-4">
          {[
            { n: KAMPUAN_SPECIES_TOTAL, l: "ชนิดที่สำรวจพบทั้งหมด" },
            { n: KAMPUAN_INVERTEBRATE_COUNT, l: "สัตว์ไม่มีกระดูกสันหลัง" },
            { n: KAMPUAN_FISH_COUNT, l: "ปลา" },
            { n: KAMPUAN_FISH_FAMILY_COUNT + KAMPUAN_INVERT_FAMILY_COUNT, l: "วงศ์รวม" },
          ].map((s) => (
            <div key={s.l} className="bg-white px-5 py-4">
              <p className="text-[26px] font-bold leading-none text-sea-800">{s.n}</p>
              <p className="mt-1.5 text-[12.5px] leading-snug text-ink-500">{s.l}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {source && (
        <Reveal>
          <div className="mt-6 rounded-xl border border-sea-200 bg-sea-50/60 p-5">
            <p className="text-[13px] font-semibold text-sea-900">ที่มาของข้อมูล</p>
            <p className="mt-2 text-[13px] leading-relaxed text-sea-950/80">
              {source.org} — {source.title} (ISBN {KAMPUAN_ISBN}) เป็นเอกสารเผยแพร่ทางวิชาการ
              ที่รวบรวมผลสำรวจชนิดสัตว์น้ำในพื้นที่ป่าชายเลนคลองกาพวน ใช้เป็นแหล่งอ้างอิงหลักของหัวข้อ{" "}
              <Link
                href="/topics/kampuan-fauna"
                className="font-medium text-sea-800 underline decoration-dotted underline-offset-2"
              >
                สัตว์น้ำในป่าชายเลนคลองกาพวน ระนอง
              </Link>
            </p>
            <div className="mt-3">
              <SourceChip id="kampuan-guidebook" />
            </div>
          </div>
        </Reveal>
      )}

      <Reveal>
        <div className="mt-6 rounded-xl border border-sand-200 bg-sand-50 p-5">
          <p className="text-[13px] font-semibold text-ink-800">
            ใช้รายชื่อนี้ทบทวนอย่างไรให้ได้คะแนน
          </p>
          <ul className="mt-2.5 grid gap-1.5 text-[12.5px] leading-relaxed text-ink-600 sm:grid-cols-2">
            <li>· จำชื่อไทยคู่กับชื่อวิทยาศาสตร์ของชนิดที่พบมาก เช่น ปลากะพงขาว Lates calcarifer</li>
            <li>· สังเกตว่าชนิดใดอยู่ในวงศ์เดียวกัน จะช่วยเดาคำตอบข้อที่ไม่คุ้นได้</li>
            <li>· จำชนิดที่เกี่ยวกับเศรษฐกิจ เพราะข้อสอบมักถามถึงความสำคัญทางเศรษฐกิจ</li>
            <li>· อย่าจำทั้งตารางแบบเรียงตัวอักษร ให้จำตามกลุ่มสัตว์และถิ่นที่อยู่</li>
          </ul>
        </div>
      </Reveal>

      <SpeciesCatalog />

      <Reveal>
        <div className="mt-10 flex flex-wrap gap-3 border-t border-ink-100 pt-6">
          <Link
            href="/topics/kampuan-fauna"
            className="rounded-lg bg-sea-800 px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-sea-700"
          >
            ไปอ่านเนื้อหาหมวดนี้
          </Link>
          <Link
            href="/quiz/kampuan-set"
            className="rounded-lg border border-ink-200 bg-white px-5 py-3 text-[14px] font-semibold text-ink-700 transition-colors hover:border-sea-300"
          >
            ทำชุดข้อสอบหมวดนี้
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
