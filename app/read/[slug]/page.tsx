import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_TOPICS, getTopic } from "@/data";
import { photosOfTopic } from "@/data/photos";
import { ReadAlong } from "@/components/read-along";

export function generateStaticParams() {
  return ALL_TOPICS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return { title: "ไม่พบบทอ่าน" };
  return {
    title: `อ่านไล่: ${topic.title}`,
    description: `${topic.tagline} — โหมดอ่านไล่ทีละช่วง พร้อมไฮไลต์คำสำคัญ`,
  };
}

export default async function ReadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  const list = ALL_TOPICS.map((t) => ({
    slug: t.slug,
    short: t.short,
    title: t.title,
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <nav
        aria-label="เส้นทาง"
        className="flex flex-wrap items-center gap-2 text-[12.5px] text-ink-400"
      >
        <Link href="/topics" className="hover:text-sea-700">
          เนื้อหา
        </Link>
        <span aria-hidden>/</span>
        <Link href={`/topics/${topic.slug}`} className="hover:text-sea-700">
          {topic.short}
        </Link>
        <span aria-hidden>/</span>
        <span className="text-ink-600">อ่านไล่</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-[26px] font-bold leading-snug tracking-tight text-ink-900 sm:text-[30px]">
            {topic.title}
          </h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink-600">
            {topic.sections.length} ช่วง · ประมาณ {topic.minutes} นาที ·
            อ่านไล่ทีละช่วงพร้อมไฮไลต์คำสำคัญ
          </p>
        </div>
        <Link
          href={`/topics/${topic.slug}`}
          className="shrink-0 rounded-lg border border-ink-200 bg-white px-4 py-2 text-[12.5px] font-medium text-ink-700 transition-colors hover:border-sea-300 hover:text-sea-700"
        >
          ดูแบบเต็มหน้า
        </Link>
      </div>

      {/* คำอธิบายโหมดอ่านไล่ */}
      <div className="mt-5 rounded-xl border border-sea-200 bg-sea-50/60 p-4">
        <p className="text-[12.5px] font-semibold text-sea-900">โหมดอ่านไล่ทำงานอย่างไร</p>
        <ul className="mt-2 grid gap-1.5 text-[12.5px] leading-relaxed text-sea-950/80 sm:grid-cols-2">
          <li>· แสดงทีละช่วง ไม่ต้องเลื่อนหาตำแหน่งที่อ่านค้างไว้</li>
          <li>· จำตำแหน่งที่อ่านไว้ในแท็บนี้ ปิดแล้วเปิดใหม่กลับมาที่เดิม</li>
          <li>· คำสำคัญ ตัวเลข และจุดที่มักเข้าใจผิดถูกไฮไลต์ให้อัตโนมัติ</li>
          <li>· สลับโหมดไฮไลต์ได้ 3 ระดับ ตามความถนัดของแต่ละคน</li>
        </ul>
      </div>

      <ReadAlong topic={topic} topics={list} photos={photosOfTopic(topic.slug)} />
    </div>
  );
}
