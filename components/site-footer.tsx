import Link from "next/link";
import { ALL_TOPICS, SOURCES } from "@/data";
import { TRICKS } from "@/data/tricks";
import { TOTAL_QUESTIONS } from "@/data/quiz-sets";
import { FLASHCARDS } from "@/data/flashcards";

function FishMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M2.6 12c2.2-3.6 5.9-6 10.1-6 3 0 5.8 1.1 8 3l-.1-3.5c0-.6.5-1 1-1s1 .4 1 1V8c0 .5-.3.9-.8 1-.3 0-.5 0-.7-.1-1.9-1.9-4.5-3-7.4-3C10.2 6 6.4 8.4 4.2 12c2.2 3.6 6 6 10.5 6 2.9 0 5.5-1.1 7.4-3-.3-.1-.6-.4-.6-.8V11c0-.6.5-1 1-1s1 .4 1 1v3.4c0 .2 0 .3-.1.5-.1.5-.4.8-.9 1-2.2 1.9-5 3-8 3-4.2 0-7.9-2.4-10.1-6-.1 0-.2-.1-.3-.2-.2-.2-.3-.5-.3-.8s.1-.6.3-.8c.1-.1.2-.2.3-.2z" />
      <circle cx="16.5" cy="10.5" r="1.4" fill="#0f2836" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="no-print mt-20 border-t border-ink-100 bg-white">
      <div className="h-0.5 w-full bg-gradient-to-r from-sea-400 via-sea-700 to-sand-400" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sea-600 to-sea-950 text-white">
              <FishMark className="h-4 w-4" />
            </span>
            ติวความรู้ทางการประมง
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-ink-500">
            แหล่งติวสำหรับการแข่งขันความรู้ทางการประมง งานเกษตรกำแพงแสน
            คณะประมง มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน
            เรียบเรียงจากเอกสารของคณะและแหล่งอ้างอิงที่ตรวจสอบได้
          </p>
        </div>

        <div>
          <p className="text-[13px] font-semibold uppercase tracking-wide text-ink-400">
            เนื้อหา
          </p>
          <ul className="mt-3 space-y-2 text-[13px]">
            <li>
              <Link href="/path" className="text-ink-600 hover:text-sea-700">
                เส้นทางอ่าน 7 ด่าน
              </Link>
            </li>
            <li>
              <Link href="/topics" className="text-ink-600 hover:text-sea-700">
                เนื้อหาทั้งหมด {ALL_TOPICS.length} หมวด
              </Link>
            </li>
            <li>
              <Link href="/tricks" className="text-ink-600 hover:text-sea-700">
                ทริกการแข่ง {TRICKS.length} ข้อ
              </Link>
            </li>
            <li>
              <Link href="/quiz" className="text-ink-600 hover:text-sea-700">
                ข้อสอบจำลอง {TOTAL_QUESTIONS} ข้อ
              </Link>
            </li>
            <li>
              <Link href="/photos" className="text-ink-600 hover:text-sea-700">
                คลังภาพสัตว์น้ำ
              </Link>
            </li>
            <li>
              <Link href="/species" className="text-ink-600 hover:text-sea-700">
                รายชื่อสัตว์น้ำคลองกาพวน
              </Link>
            </li>
            <li>
              <Link href="/quiz/photo-set" className="text-ink-600 hover:text-sea-700">
                ข้อสอบถามจากภาพ
              </Link>
            </li>
            <li>
              <Link href="/flashcards" className="text-ink-600 hover:text-sea-700">
                บัตรคำ {FLASHCARDS.length} ใบ
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-[13px] font-semibold uppercase tracking-wide text-ink-400">
            เตรียมตัว
          </p>
          <ul className="mt-3 space-y-2 text-[13px]">
            <li>
              <Link href="/competition" className="text-ink-600 hover:text-sea-700">
                ข้อมูลการแข่งขัน
              </Link>
            </li>
            <li>
              <Link href="/plan" className="text-ink-600 hover:text-sea-700">
                แผนติว 30 วัน
              </Link>
            </li>
            <li>
              <Link href="/sources" className="text-ink-600 hover:text-sea-700">
                แหล่งอ้างอิง {SOURCES.length} รายการ
              </Link>
            </li>
            <li>
              <Link href="/img-credits" className="text-ink-600 hover:text-sea-700">
                ที่มาของภาพประกอบ
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-[13px] font-semibold uppercase tracking-wide text-ink-400">
            ติดตามประกาศ
          </p>
          <ul className="mt-3 space-y-2 text-[13px]">
            <li>
              <a
                href="https://www.facebook.com/fishkps/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-600 hover:text-sea-700"
              >
                เพจการแข่งขัน (fishkps)
              </a>
            </li>
            <li>
              <a
                href="https://www4.fisheries.go.th/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-600 hover:text-sea-700"
              >
                กรมประมง
              </a>
            </li>
            <li>
              <a
                href="https://www.ku.ac.th/th/faculty-of-fisheries"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-600 hover:text-sea-700"
              >
                คณะประมง มก.
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-100">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <p className="text-[12px] leading-relaxed text-ink-400">
            เว็บนี้จัดทำขึ้นเพื่อการเตรียมตัวสอบเป็นการส่วนตัว
            ไม่ใช่เว็บไซต์ทางการของคณะประมงหรือมหาวิทยาลัยเกษตรศาสตร์
            กำหนดการและกติกาของการแข่งขันให้ยึดประกาศจากเพจทางการเป็นหลัก
            ข้อสอบจำลองทั้งหมดจัดทำขึ้นใหม่ตามขอบเขตที่คณะประกาศ ไม่ใช่ข้อสอบจริง
          </p>
        </div>
      </div>
    </footer>
  );
}
