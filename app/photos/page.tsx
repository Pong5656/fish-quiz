import type { Metadata } from "next";
import Link from "next/link";
import { ALL_TOPICS } from "@/data";
import { PHOTOS, photosOfTopic, shortLicense } from "@/data/photos";
import { Reveal } from "@/components/reveal";
import { SectionLabel } from "@/components/ui";
import { PhotoGallery } from "@/components/photo-gallery";

export const metadata: Metadata = {
  title: "คลังภาพสัตว์น้ำ",
  description:
    "ภาพถ่ายจริงของปลา สัตว์น้ำ อุปกรณ์ประมง และระบบเพาะเลี้ยง จาก Wikimedia Commons ใช้ประกอบการอ่านและข้อสอบถามจากภาพ พร้อมเครดิตและสัญญาอนุญาตครบถ้วน",
};

export default function PhotosPage() {
  const byTopic = ALL_TOPICS.map((t) => ({
    topic: t,
    photos: photosOfTopic(t.slug),
  })).filter((g) => g.photos.length > 0);

  const licenses = new Set(PHOTOS.map((p) => shortLicense(p.license)));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <Reveal>
        <SectionLabel>ภาพประกอบ</SectionLabel>
        <h1 className="rule-draw text-[30px] font-bold tracking-tight text-ink-900 sm:text-[38px]">
          คลังภาพสัตว์น้ำและอุปกรณ์ประมง
        </h1>
        <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-ink-600">
          รวมภาพถ่ายจริง {PHOTOS.length} ภาพ จาก Wikimedia Commons
          คัดเฉพาะที่สัญญาอนุญาตเปิดให้ใช้ต่อได้ ({[...licenses].join(" · ")})
          ใช้ประกอบการอ่านเนื้อหา และใช้เป็นโจทย์ในข้อสอบถามจากภาพ
          ทุกภาพระบุชื่อผู้สร้าง สัญญาอนุญาต และลิงก์ต้นทางครบถ้วนก
        </p>
      </Reveal>

      <Reveal>
        <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-ink-100 bg-ink-100 sm:grid-cols-3">
          {[
            { n: PHOTOS.length, l: "ภาพถ่ายจริง" },
            { n: byTopic.length, l: "หมวดที่มีภาพ" },
            { n: licenses.size, l: "ประเภทสัญญาอนุญาต" },
          ].map((s) => (
            <div key={s.l} className="bg-white px-5 py-4">
              <p className="text-[24px] font-bold leading-none text-sea-800">{s.n}</p>
              <p className="mt-1.5 text-[12.5px] text-ink-500">{s.l}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-8 rounded-xl border border-sea-200 bg-sea-50/60 p-5">
          <p className="text-[13px] font-semibold text-sea-900">
            ใช้ภาพเหล่านี้อย่างไรให้ได้คะแนน
          </p>
          <ul className="mt-2.5 grid gap-1.5 text-[12.5px] leading-relaxed text-sea-950/80 sm:grid-cols-2">
            <li>· ดูภาพแล้วลองเรียกชื่อชนิดและชื่อวิทยาศาสตร์ก่อนเปิดเฉลย</li>
            <li>· สังเกตรูปร่างครีบ หาง และสี เพื่อแยกกลุ่มปลาให้ออก</li>
            <li>· ข้อสอบจริงมีการถามจากภาพ ให้ฝึกอ่านภาพบ่อย ๆ</li>
            <li>· ทุกภาพมีลิงก์ต้นทาง เปิดดูคำบรรยายเต็มได้</li>
          </ul>
          <Link
            href="/quiz/photo-set"
            className="btn-primary mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-semibold text-white"
          >
            ทำข้อสอบถามจากภาพ
          </Link>
        </div>
      </Reveal>

      {byTopic.map((g, gi) => (
        <Reveal key={g.topic.slug} delay={gi * 30}>
          <PhotoGallery
            photos={g.photos}
            heading={`${g.topic.title} (${g.photos.length})`}
            note={g.topic.tagline}
          />
        </Reveal>
      ))}
    </div>
  );
}
