import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_TOPICS, getTopic } from "@/data";
import { QUESTION_BANK } from "@/data/questions";
import type { QuizSet } from "@/data/quiz-types";
import { QuizRunner } from "@/components/quiz-runner";

/**
 * ชุดฝึกเฉพาะหมวด — สร้างชุดข้อสอบจากหมวดที่ผู้ใช้เลือกในหน้าอ่านเนื้อหา
 * ใช้คลังข้อสอบเดียวกับชุดจำลอง แต่กรองเหลือเฉพาะข้อของหมวดนั้น
 * ถ้าหมวดใดมีข้อน้อยกว่า 8 ข้อ จะดึงหมวดที่เกี่ยวข้องกันมาช่วยให้ชุดมีขนาดพอฝึก
 */

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
  if (!topic) return { title: "ไม่พบหมวด" };
  return {
    title: `ฝึกเฉพาะหมวด: ${topic.short}`,
    description: `ชุดข้อสอบเฉพาะหมวด ${topic.title} พร้อมเฉลยอธิบายทุกข้อ`,
  };
}

/** หมวดที่มีความใกล้กันทางเนื้อหา ใช้เติมเมื่อหมวดหลักมีข้อไม่พอ */
const NEIGHBORS: Record<string, string[]> = {
  "fish-anatomy": ["taxonomy", "economic-species"],
  taxonomy: ["fish-anatomy", "economic-species"],
  ecology: ["marine-ecology", "water-quality"],
  "marine-ecology": ["ecology", "conservation"],
  "water-quality": ["aquaculture", "toxicology"],
  aquaculture: ["water-quality", "nutrition"],
  nutrition: ["aquaculture", "processing"],
  "fish-disease": ["water-quality", "toxicology"],
  toxicology: ["water-quality", "fish-disease"],
  "economic-species": ["taxonomy", "fishing-gear"],
  "fishing-gear": ["economic-species", "fisheries-law"],
  "fisheries-law": ["conservation", "fishing-gear"],
  conservation: ["fisheries-law", "marine-ecology"],
  "fisheries-stats": ["conservation", "fishing-gear"],
  processing: ["nutrition", "economic-species"],
};

/** จำนวนข้อเป้าหมายของชุดฝึกเฉพาะหมวด */
const TARGET = 12;

export default async function TopicQuizPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  const primary = QUESTION_BANK.filter((q) => q.topic === slug);

  // เติมจากหมวดข้างเคียงเมื่อข้อในหมวดหลักยังไม่ถึงเป้าหมาย
  let questions = [...primary];
  const used = new Set(primary.map((q) => q.id));
  for (const nb of NEIGHBORS[slug] ?? []) {
    if (questions.length >= TARGET) break;
    for (const q of QUESTION_BANK) {
      if (questions.length >= TARGET) break;
      if (q.topic !== nb || used.has(q.id)) continue;
      questions.push(q);
      used.add(q.id);
    }
  }
  // ถ้ายังไม่พอ เติมจากทุกหมวดที่เหลือ
  if (questions.length < TARGET) {
    for (const q of QUESTION_BANK) {
      if (questions.length >= TARGET) break;
      if (used.has(q.id)) continue;
      questions.push(q);
      used.add(q.id);
    }
  }

  const set: QuizSet = {
    id: `topic-${slug}`,
    title: `ฝึกเฉพาะหมวด: ${topic.title}`,
    description: `ชุดข้อสอบที่เน้นหมวด ${topic.short}${questions.length > primary.length ? ` และหมวดที่เกี่ยวข้อง` : ""} พร้อมเฉลยอธิบาย`,
    kind: "เจาะลึก",
    minutes: Math.max(10, Math.round(questions.length * 1.2)),
    mode: "reveal",
    questions,
  };

  const extra = questions.filter((q) => q.topic !== slug).length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav aria-label="เส้นทาง" className="flex flex-wrap items-center gap-2 text-[12.5px] text-ink-400">
        <Link href="/quiz" className="hover:text-sea-700">
          ข้อสอบจำลอง
        </Link>
        <span aria-hidden>/</span>
        <Link href={`/topics/${slug}`} className="hover:text-sea-700">
          {topic.short}
        </Link>
        <span aria-hidden>/</span>
        <span className="text-ink-600">ฝึกเฉพาะหมวด</span>
      </nav>

      <h1 className="mt-4 text-[24px] font-bold leading-snug tracking-tight text-ink-900">
        ฝึกเฉพาะหมวด: {topic.short}
      </h1>
      <p className="mt-2 text-[13.5px] leading-relaxed text-ink-600">
        ชุดนี้มี {questions.length} ข้อ แยกเป็นข้อของหมวดนี้ {primary.length} ข้อ
        {extra > 0 && ` และข้อจากหมวดที่เกี่ยวข้องอีก ${extra} ข้อ`}
        {" "}เริ่มที่โหมดติวทีละข้อเพื่อให้เห็นเฉลยทันทีหลังเลือกคำตอบ
      </p>

      {primary.length < TARGET && (
        <div className="mt-4 rounded-lg border border-sea-200 bg-sea-50/60 px-4 py-3">
          <p className="text-[13px] leading-relaxed text-sea-950/85">
            หมวดนี้มีข้อในคลัง {primary.length} ข้อ จึงเติมข้อจากหมวด
            {NEIGHBORS[slug]?.length ? " ที่ใช้หลักการร่วมกัน" : " อื่น"}ให้ครบพอฝึกต่อเนื่อง
            ถ้าต้องการเจาะเฉพาะหมวดนี้จริง ๆ ให้อ่านโหมดอ่านไล่คู่กับชุดนี้
          </p>
        </div>
      )}

      <QuizRunner set={set} />
    </div>
  );
}
