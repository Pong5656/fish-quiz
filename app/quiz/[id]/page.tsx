import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { QUIZ_SETS, getQuizSet } from "@/data/quiz-sets";
import { QuizRunner } from "@/components/quiz-runner";

export function generateStaticParams() {
  return QUIZ_SETS.map((s) => ({ id: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const set = getQuizSet(id);
  if (!set) return { title: "ไม่พบชุดข้อสอบ" };
  return {
    title: set.title,
    description: set.description,
  };
}

export default async function QuizSetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const set = getQuizSet(id);
  if (!set) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav aria-label="เส้นทาง" className="flex items-center gap-2 text-[12.5px] text-ink-400">
        <Link href="/quiz" className="hover:text-sea-700">
          ข้อสอบจำลอง
        </Link>
        <span aria-hidden>/</span>
        <span className="truncate text-ink-600">{set.kind}</span>
      </nav>

      <h1 className="mt-4 text-[24px] font-bold leading-snug tracking-tight text-ink-900 sm:text-[28px]">
        {set.title}
      </h1>

      <QuizRunner set={set} />
    </div>
  );
}
