import type { Metadata } from "next";
import { TRICKS, type TrickCategory } from "@/data/tricks";
import { TrickExplorer } from "@/components/trick-explorer";
import { Reveal } from "@/components/reveal";
import { SectionLabel } from "@/components/ui";

export const metadata: Metadata = {
  title: "ทริกการแข่งขัน",
  description:
    "ทริกและเทคนิคการแข่งขันความรู้ทางการประมง กลยุทธ์การแข่งแบบทีมละ 2 คน เทคนิคการจำ การอ่าน การเดา และการบริหารเวลา แสดงทีละข้อแยกตามหมวด",
};

const CATEGORIES: TrickCategory[] = [
  "กลยุทธ์การแข่งขัน",
  "เทคนิคการอ่าน",
  "เทคนิคการจำ",
  "เทคนิคการเดา",
  "การบริหารเวลา",
  "การเตรียมทีม",
];

export default function TricksPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <Reveal>
        <SectionLabel>เทคนิค</SectionLabel>
        <h1 className="rule-draw text-[30px] font-bold tracking-tight text-ink-900 sm:text-[38px]">
          ทริกการแข่งขัน
        </h1>
        <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-ink-600">
          ทั้งหมด {TRICKS.length} ทริก แยกเป็น {CATEGORIES.length} หมวด
          แต่ละข้ออธิบายหลักการที่มาที่ไป แล้วตามด้วยวิธีทำจริงเป็นขั้นตอน
          เลือกหมวดด้านซ้ายแล้วไล่อ่านทีละข้อได้เลย
          ทุกทริกอ้างอิงจากกติกาการแข่งขันที่คณะประมงประกาศ หรือจากรูปแบบข้อสอบจริงของรายการนี้
          ไม่ใช่คำแนะนำทั่วไป
        </p>

        {/* สิ่งที่ทริกทำได้และทำไม่ได้ */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5">
            <p className="text-[13px] font-semibold text-emerald-800">
              ทริกช่วยเรื่องนี้
            </p>
            <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-emerald-950/80">
              <li>· จัดลำดับว่าอ่านหมวดไหนก่อนหลังเมื่อเวลามีจำกัด</li>
              <li>· ทำให้จำตัวเลข ชื่อวิทยาศาสตร์ และนิยามกฎหมายได้แม่นขึ้น</li>
              <li>· ทำให้ทำข้อสอบทันและได้คะแนนจากข้อที่รู้จริงมากขึ้น</li>
              <li>· ทำให้ทีมสองคนแบ่งงานติวได้โดยไม่ซ้ำซ้อน</li>
            </ul>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5">
            <p className="text-[13px] font-semibold text-amber-900">
              ทริกช่วยเรื่องนี้ไม่ได้
            </p>
            <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-amber-950/80">
              <li>· แทนการอ่านเนื้อหา เพราะข้อสอบถามข้อเท็จจริงที่ต้องรู้จริง</li>
              <li>· ทำนายข้อสอบปีถัดไปได้ เพราะหัวข้อรอบที่สองเปลี่ยนทุกปี</li>
              <li>· แทนการซ้อมทำข้อสอบแบบจับเวลา</li>
            </ul>
          </div>
        </div>
      </Reveal>

      <TrickExplorer tricks={TRICKS} categories={CATEGORIES} />
    </div>
  );
}
