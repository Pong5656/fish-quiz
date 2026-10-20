import type { Metadata } from "next";
import { FLASHCARDS, FLASHCARD_GROUPS } from "@/data/flashcards";
import { FlashcardDeck } from "@/components/flashcard-deck";
import { Reveal } from "@/components/reveal";
import { SectionLabel } from "@/components/ui";

export const metadata: Metadata = {
  title: "บัตรคำ",
  description:
    "บัตรคำท่องจำความรู้ทางการประมง ชื่อวิทยาศาสตร์สัตว์น้ำเศรษฐกิจ คำศัพท์เทคนิค ตัวเลขที่ต้องจำ และนิยามกฎหมายประมง พร้อมระบบทบทวนใบที่ยังไม่แม่น",
};

export default function FlashcardsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Reveal>
        <SectionLabel>ท่องจำ</SectionLabel>
        <h1 className="rule-draw text-[30px] font-bold tracking-tight text-ink-900 sm:text-[38px]">
          บัตรคำ
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-ink-600">
          ทั้งหมด {FLASHCARDS.length} ใบ แยกเป็น {FLASHCARD_GROUPS.length} กลุ่ม
          เนื้อหาคัดเฉพาะสิ่งที่ต้องจำแบบแยกส่วนได้จริง คือชื่อวิทยาศาสตร์
          คำศัพท์เทคนิค ตัวเลขที่ออกสอบบ่อย และนิยามกฎหมาย
          เรียงจากการ์ดที่ต้องรู้บ่อยที่สุดก่อน
        </p>
      </Reveal>

      <Reveal>
        <div className="mt-8 rounded-xl border border-sea-200 bg-sea-50/60 p-5">
          <p className="text-[13px] font-semibold text-sea-900">วิธีใช้ให้ได้ผล</p>
          <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-sea-950/80">
            <li>· อ่านคำถาม แล้วพยายามนึกคำตอบก่อนกดการ์ด อย่ากดดูทันที</li>
            <li>· ตอบได้จริงจึงกด “จำได้แล้ว” ถ้ายังลังเลให้กด “ไว้ทวน” เสมอ</li>
            <li>· ทบทวนวันละ 10 นาทีต่อเนื่อง ดีกว่าใช้เวลาสองชั่วโมงครั้งเดียว</li>
            <li>· ก่อนสอบ 1–2 วัน ให้เปิดตัวกรอง “เฉพาะใบที่ยังไม่แม่น” แล้วทวนให้ครบ</li>
          </ul>
        </div>
      </Reveal>

      <FlashcardDeck cards={FLASHCARDS} groups={FLASHCARD_GROUPS} />
    </div>
  );
}
