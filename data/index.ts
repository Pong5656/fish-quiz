import type { Topic, Section } from "./types";
import { TOPICS } from "./topics";
import { TOPICS_B } from "./topics-b";
import { TOPICS_C } from "./topics-c";
import { SOURCES } from "./sources";

/** รวมทุกหมวด เรียงตามลำดับที่แนะนำให้อ่าน */
export const ALL_TOPICS: Topic[] = [...TOPICS, ...TOPICS_B, ...TOPICS_C].sort(
  (a, b) => a.order - b.order,
);

export const SOURCE_BY_ID = new Map(SOURCES.map((s) => [s.id, s]));

export function getTopic(slug: string): Topic | undefined {
  return ALL_TOPICS.find((t) => t.slug === slug);
}

export function getSource(id: string) {
  return SOURCE_BY_ID.get(id);
}

/** นับจำนวนจุดที่มักออกสอบทั้งเว็บ ใช้แสดงบนหน้าแรก */
export function countHotPoints(): number {
  return ALL_TOPICS.reduce(
    (sum, t) => sum + t.sections.reduce((s, sec) => s + (sec.hot?.length ?? 0), 0),
    0,
  );
}

/** จำนวนหัวข้อย่อยทั้งหมด */
export function countSections(): number {
  return ALL_TOPICS.reduce((sum, t) => sum + t.sections.length, 0);
}

/** เวลาอ่านรวมโดยประมาณ */
export function totalMinutes(): number {
  return ALL_TOPICS.reduce((sum, t) => sum + t.minutes, 0);
}

export type { Topic, Section };
export { SOURCES };

/** คำที่พบบ่อยเกินไปในเนื้อหาประมง จึงไม่ควรใช้เป็นคำสำคัญ */
const GENERIC_TERMS = new Set([
  "ปลา", "น้ำ", "การ", "ของ", "ใน", "และ", "ที่", "เป็น", "ได้", "ให้", "จาก",
  "กับ", "หรือ", "นี้", "นั้น", "ซึ่ง", "โดย", "เมื่อ", "แล้ว", "จะ", "ต้อง",
  "มี", "ไม่มี", "มาก", "น้อย", "สูง", "ต่ำ", "ค่า", "ส่วน", "ชนิด", "ชนิดนี้",
  "สัตว์น้ำ", "ประมง", "ระบบ", "วิธี", "หลัก", "กลุ่ม", "ตัว", "ข้อ",
]);

/**
 * ดึงคำสำคัญของช่วงเนื้อหาจากข้อมูลที่มีอยู่แล้วในตัวช่วงนั้น
 * ใช้ชื่อวิทยาศาสตร์ คำศัพท์เทคนิค และตัวเลขจากจุดที่มักออกสอบ
 * เพื่อให้ไฮไลต์คำสำคัญทำงานได้จริงโดยไม่ต้องเขียนคำซ้ำอีกรอบ
 */
export function deriveKeywords(section: Section): string[] {
  if (section.keywords?.length) return section.keywords;

  const found = new Set<string>();

  const scan = (text: string) => {
    // คำที่อยู่ในวงเล็บ เช่น "(gill raker)" ถือเป็นศัพท์เทคนิค
    for (const m of text.matchAll(/\(([A-Za-z][A-Za-z\s-]{3,30})\)/g)) {
      const term = m[1].trim();
      if (term.length >= 5) found.add(term);
    }
    // คำผสมที่คั่นด้วยเครื่องหมายทับ เช่น "NH3/NH4+"
    for (const m of text.matchAll(/\b[A-Z]{2,}\d?[+-]?\b/g)) {
      found.add(m[0]);
    }
  };

  scan(section.heading);
  section.body?.forEach(scan);
  section.bullets?.forEach(scan);
  section.hot?.forEach((h) => {
    scan(h.q);
    scan(h.a);
  });
  section.table?.rows.forEach((r) => r.forEach(scan));

  // ตัดคำที่พบบ่อยเกินไปจนไม่มีประโยชน์ในการเน้น
  return [...found].filter((w) => !GENERIC_TERMS.has(w) && w.length <= 32);
}
