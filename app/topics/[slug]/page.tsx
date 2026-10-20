import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_TOPICS, getTopic } from "@/data";
import { photosOfTopic } from "@/data/photos";
import { PhotoGallery } from "@/components/photo-gallery";
import { TopicContent } from "@/components/topic-content";
import { Reveal } from "@/components/reveal";
import { WeightBadge } from "@/components/ui";

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
  if (!topic) return { title: "ไม่พบหัวข้อ" };
  return {
    title: topic.title,
    description: topic.tagline,
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  const idx = ALL_TOPICS.findIndex((t) => t.slug === slug);
  const prev = idx > 0 ? ALL_TOPICS[idx - 1] : null;
  const next = idx < ALL_TOPICS.length - 1 ? ALL_TOPICS[idx + 1] : null;
  const photos = photosOfTopic(slug);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {/* ── หัวเรื่อง ── */}
      <Reveal>
        <nav aria-label="เส้นทาง" className="flex items-center gap-2 text-[12.5px] text-ink-400">
          <Link href="/topics" className="hover:text-sea-700">
            เนื้อหา
          </Link>
          <span aria-hidden>/</span>
          <span className="text-ink-600">{topic.short}</span>
        </nav>

        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <span className="rounded-md bg-sea-800 px-2 py-0.5 text-[11.5px] font-medium text-white">
            หมวดที่ {topic.order}
          </span>
          <WeightBadge weight={topic.weight} />
          <span className="text-[12px] text-ink-400">
            {topic.sections.length} หัวข้อย่อย · ประมาณ {topic.minutes} นาที
          </span>
        </div>

        <h1 className="rule-draw mt-4 text-[30px] font-bold leading-tight tracking-tight text-ink-900 sm:text-[36px]">
          {topic.title}
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-ink-600">{topic.tagline}</p>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <Link
            href={`/read/${topic.slug}`}
            className="btn-primary inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-[13.5px] font-semibold text-white"
          >
            อ่านไล่ทีละช่วง พร้อมไฮไลต์
          </Link>
          <Link
            href={`/quiz/topic/${topic.slug}`}
            className="inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-5 py-2.5 text-[13.5px] font-semibold text-ink-800 transition-colors hover:border-sea-300 hover:text-sea-700"
          >
            ทดสอบหมวดนี้
          </Link>
        </div>
      </Reveal>

      {/* ── เป้าหมายการเรียนรู้ ── */}
      <Reveal>
        <section className="mt-8 rounded-xl border border-ink-100 bg-white p-6">
          <h2 className="text-[15px] font-semibold text-ink-900">
            เมื่ออ่านจบหมวดนี้ คุณจะทำได้
          </h2>
          <ul className="mt-4 space-y-2.5">
            {topic.goals.map((g, i) => (
              <li key={i} className="flex gap-3 text-[13.5px] leading-relaxed text-ink-700">
                <span
                  aria-hidden
                  className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border border-emerald-300 bg-emerald-50 text-[10px] font-bold text-emerald-700"
                >
                  ✓
                </span>
                {g}
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      {/* ── สะพานจากชีววิทยา ── */}
      <Reveal>
        <section className="mt-4 rounded-xl border border-sea-200 bg-sea-50/60 p-6">
          <h2 className="text-[15px] font-semibold text-sea-900">
            พื้นฐานชีววิทยาที่คุณมีอยู่แล้วนำมาใช้ตรงไหน
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-sea-950/80">
            {topic.bioBridge}
          </p>
        </section>
      </Reveal>

      {/* ── สารบัญหัวข้อย่อย ── */}
      <Reveal>
        <nav className="mt-8 rounded-xl border border-ink-100 bg-ink-50/50 p-5">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-ink-400">
            หัวข้อย่อยในหน้านี้
          </p>
          <ol className="mt-3 grid gap-1.5 sm:grid-cols-2">
            {topic.sections.map((s, i) => (
              <li key={s.heading}>
                <a
                  href={`#sec-${i + 1}`}
                  className="flex gap-2.5 rounded-md px-2 py-1.5 text-[13px] text-ink-600 transition-colors hover:bg-white hover:text-sea-700"
                >
                  <span className="font-mono text-[11.5px] text-ink-400">{i + 1}</span>
                  <span className="min-w-0 flex-1 truncate">{s.heading}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </Reveal>

      {/* ── เนื้อหา ── */}
      <TopicContent sections={topic.sections} />

      {/* ── ภาพถ่ายจริงประจำหมวด ── */}
      {photos.length > 0 && (
        <Reveal>
          <PhotoGallery
            photos={photos}
            heading="ภาพถ่ายจริงประจำหมวดนี้"
            note="ภาพทั้งหมดมาจาก Wikimedia Commons ภายใต้สัญญาอนุญาตเปิด ทุกภาพระบุผู้สร้างและลิงก์ต้นทาง ใช้ทบทวนชนิดและลักษณะสำคัญก่อนสอบ"
          />
        </Reveal>
      )}

      {/* ── ไปหมวดอื่น ── */}
      <Reveal>
        <nav className="mt-16 grid gap-4 border-t border-ink-100 pt-8 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/topics/${prev.slug}`}
              className="group rounded-xl border border-ink-100 bg-white p-5 transition-colors hover:border-sea-200"
            >
              <p className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-400">
                ← หมวดก่อนหน้า
              </p>
              <p className="mt-1.5 text-[14.5px] font-semibold text-ink-900 group-hover:text-sea-700">
                {prev.title}
              </p>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/topics/${next.slug}`}
              className="group rounded-xl border border-ink-100 bg-white p-5 text-right transition-colors hover:border-sea-200"
            >
              <p className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-400">
                หมวดถัดไป →
              </p>
              <p className="mt-1.5 text-[14.5px] font-semibold text-ink-900 group-hover:text-sea-700">
                {next.title}
              </p>
            </Link>
          )}
        </nav>
      </Reveal>
    </div>
  );
}
