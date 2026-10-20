import type { Question, QuizSet } from "./quiz-types";
import { QUESTION_BANK } from "./questions";
import { FIGURE_QUESTIONS } from "./questions-figure";
import { PHOTO_QUESTIONS } from "./questions-photos";

const shuffleWithSeed = <T,>(arr: T[], seed: number): T[] => {
  const out = [...arr];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const byTopic = (topics: string[]) =>
  QUESTION_BANK.filter((q) => topics.includes(q.topic));

const ROUND2_TOPICS = ["taxonomy", "fish-anatomy", "ecology", "economic-species"];
const GENERAL_TOPICS = [
  "water-quality",
  "aquaculture",
  "nutrition",
  "fish-disease",
  "fishing-gear",
  "fisheries-law",
  "toxicology",
  "conservation",
  "marine-ecology",
];

/** ชุดที่ 1 — จำลองรอบแรก: ความรู้ทางการประมงทั่วไป */
const set1: QuizSet = {
  id: "round-1",
  title: "ชุดที่ 1 — รอบแรก: ความรู้ทางการประมงทั่วไป",
  description:
    "จำลองรอบแรกของการแข่งขัน ตามกติกาจริงคือ 30 ข้อ เนื้อหาความรู้ประมงทั่วไป ครอบคลุมคุณภาพน้ำ การเพาะเลี้ยง โภชนาการ โรค เครื่องมือประมง กฎหมาย และการอนุรักษ์",
  kind: "รอบแรก",
  minutes: 30,
  questions: shuffleWithSeed(byTopic(GENERAL_TOPICS), 11),
};

/** ชุดที่ 2 — จำลองรอบที่สอง: หัวข้อเฉพาะ */
const set2: QuizSet = {
  id: "round-2",
  title: "ชุดที่ 2 — รอบที่สอง: ปลา ความรู้พื้นฐาน อนุกรมวิธาน และนิเวศวิทยา",
  description:
    "จำลองรอบที่สอง ตามหัวข้อที่คณะประมงประกาศไว้ เนื้อหาเน้นอนุกรมวิธาน กายวิภาคพื้นฐาน สัตว์น้ำเศรษฐกิจ และนิเวศวิทยา เป็นชุดที่ควรทำให้ได้คะแนนสูงสุด",
  kind: "รอบที่สอง",
  minutes: 40,
  questions: shuffleWithSeed(byTopic(ROUND2_TOPICS), 23),
};

/** ชุดที่ 3 — รวมทุกหมวด เรียงตามลำดับความยาก */
const set3: QuizSet = {
  id: "full",
  title: "ชุดที่ 3 — รวมทุกหมวด (ฝึกความเร็ว)",
  description:
    "รวมข้อสอบทุกหมวดไว้ในชุดเดียว เรียงจากข้อง่ายไปข้อยาก เหมาะสำหรับซ้อมทำข้อสอบแบบต่อเนื่องเพื่อฝึกความเร็วและความแม่นยำ",
  kind: "รวม",
  minutes: 60,
  questions: [...QUESTION_BANK].sort((a, b) => {
    const rank = { ง่าย: 0, ปานกลาง: 1, ยาก: 2 };
    return rank[a.level] - rank[b.level];
  }),
};

/** ชุดที่ 4 — เฉพาะอนุกรมวิธานและกายวิภาค (จุดที่ต้องได้เต็ม) */
const set4: QuizSet = {
  id: "taxonomy-anatomy",
  title: "ชุดที่ 4 — เจาะลึก: อนุกรมวิธานและกายวิภาค",
  description:
    "เจาะเฉพาะสองหมวดที่ตรงกับหัวข้อสอบรอบที่สองมากที่สุด เหมาะกับผู้ที่ต้องการเพิ่มคะแนนในส่วนที่แยกอันดับ",
  kind: "รอบที่สอง",
  minutes: 35,
  questions: shuffleWithSeed(byTopic(["taxonomy", "fish-anatomy"]), 37),
};

/** ชุดที่ 5 — กฎหมายและเครื่องมือประมง (จุดที่คนมักทิ้ง) */
const set5: QuizSet = {
  id: "law-gear",
  title: "ชุดที่ 5 — เจาะลึก: กฎหมายและเครื่องมือประมง",
  description:
    "เจาะหมวดกฎหมายประมงและเครื่องมือประมง ซึ่งเป็นหมวดที่ผู้เข้าแข่งขันมักทิ้ง แต่เป็นคะแนนที่เก็บได้ง่ายถ้าจำนิยามได้",
  kind: "รอบแรก",
  minutes: 25,
  questions: shuffleWithSeed(byTopic(["fisheries-law", "fishing-gear"]), 53),
};

/** ชุดที่ 6 — ข้อสอบถามจากภาพ เฉลยทีละข้อ */
const set6: QuizSet = {
  id: "figure-set",
  title: "ชุดที่ 6 — ถามจากภาพ (ติวทีละข้อพร้อมเฉลย)",
  description:
    "ชุดข้อสอบที่ให้ดูภาพแล้วตอบ เหมือนข้อสอบจริงในห้องสอบที่มักให้ชี้ตำแหน่งอวัยวะหรืออ่านแผนภาพ แต่ละข้อมีเฉลยและจุดที่ต้องจำทันทีหลังเลือกคำตอบ เหมาะกับการอ่านครั้งแรก",
  kind: "เจาะลึก",
  minutes: 20,
  mode: "reveal",
  questions: FIGURE_QUESTIONS,
};

/** ชุดที่ 7 — รวมข้อสอบถามจากภาพและโจทย์วิเคราะห์แผนภาพแบบจับเวลา */
const set7: QuizSet = {
  id: "figure-timed",
  title: "ชุดที่ 7 — ภาพและแผนภาพ (จับเวลาเหมือนห้องสอบ)",
  description:
    "ใช้ชุดข้อสอบถามจากภาพเดียวกัน แต่ปิดเฉลยระหว่างทำและจับเวลา เหมาะกับการซ้อมครั้งที่สองหลังอ่านเฉลยของชุดที่ 6 แล้ว เพื่อทดสอบว่าจำได้จริงหรือจำจากคำอธิบาย",
  kind: "เจาะลึก",
  minutes: 15,
  mode: "exam",
  questions: shuffleWithSeed(FIGURE_QUESTIONS, 71),
};

/** ชุดที่ 8 — ข้อสอบถามจากภาพถ่ายจริง เฉลยทีละข้อ */
const set8: QuizSet = {
  id: "photo-set",
  title: "ชุดที่ 8 — ถามจากภาพถ่ายจริง (ติวทีละข้อพร้อมเฉลย)",
  description:
    "ชุดข้อสอบที่ใช้ภาพถ่ายจริงของปลา สัตว์น้ำ อุปกรณ์ประมง และระบบเพาะเลี้ยง แทนภาพวาด ฝึกอ่านรายละเอียดจากตัวสัตว์จริง ทั้งสี รูปร่างครีบ และสภาพแวดล้อม แต่ละข้อมีเฉลยและจุดที่ต้องจำทันทีหลังเลือก",
  kind: "เจาะลึก",
  minutes: 25,
  mode: "reveal",
  questions: PHOTO_QUESTIONS,
};

/** ชุดที่ 9 — ภาพถ่ายจริงแบบจับเวลาเหมือนห้องสอบ */
const set9: QuizSet = {
  id: "photo-timed",
  title: "ชุดที่ 9 — ภาพถ่ายจริง (จับเวลาเหมือนห้องสอบ)",
  description:
    "ใช้ข้อสอบถามจากภาพถ่ายจริงชุดเดียวกัน แต่ปิดเฉลยระหว่างทำและจับเวลา เหมาะกับการซ้อมครั้งที่สองหลังอ่านเฉลยของชุดที่ 8 เพื่อทดสอบว่าจำชนิดและลักษณะสำคัญได้จริง",
  kind: "เจาะลึก",
  minutes: 20,
  mode: "exam",
  questions: shuffleWithSeed(PHOTO_QUESTIONS, 97),
};

export const QUIZ_SETS: QuizSet[] = [set1, set2, set3, set4, set5, set6, set7, set8, set9];

export function getQuizSet(id: string): QuizSet | undefined {
  return QUIZ_SETS.find((s) => s.id === id);
}

export const TOTAL_QUESTIONS = QUESTION_BANK.length;
export type { Question, QuizSet };
