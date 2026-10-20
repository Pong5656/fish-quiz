export type Choice = {
  /** ข้อความตัวเลือก */
  text: string;
};

export type Question = {
  id: string;
  /** slug ของหมวดเนื้อหาที่ข้อนี้ทดสอบ */
  topic: string;
  /** คำถาม */
  q: string;
  choices: string[];
  /** ดัชนีคำตอบที่ถูก (เริ่มที่ 0) */
  answer: number;
  /** คำอธิบายเฉลย */
  explain: string;
  /** ระดับความยาก */
  level: "ง่าย" | "ปานกลาง" | "ยาก";
  /** ภาพประกอบคำถาม — ใช้กับข้อสอบแบบถามจากภาพ เหมือนข้อสอบจริงในห้องสอบ */
  figure?: {
    src: string;
    alt: string;
    credit?: string;
    creditUrl?: string;
  };
  /** จุดสำคัญที่ต้องเข้าใจในข้อนี้ ใช้ไฮไลต์ในหน้าเฉลย */
  keyPoint?: string;
  /** ตัวเลือกที่มักทำให้เข้าใจผิด พร้อมเหตุผลที่ผิด */
  trap?: {
    text: string;
    why: string;
  };
};

export type QuizSet = {
  id: string;
  title: string;
  description: string;
  /** จำนวนข้อที่จำลอง ตามกติกาจริง */
  kind: "รอบแรก" | "รอบที่สอง" | "รวม" | "เจาะลึก";
  minutes: number;
  questions: Question[];
  /** โหมดทำข้อสอบ — เฉลยทีละข้อ เหมือนกรรมการเฉลยในห้องสอบ */
  mode?: "reveal" | "exam";
};
