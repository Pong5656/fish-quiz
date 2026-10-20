/** คำถามที่พบบ่อยในหัวข้อนั้น พร้อมคำตอบสั้นแบบที่ใช้ตอบในห้องสอบ */
export type HotPoint = {
  q: string;
  a: string;
};

export type Section = {
  heading: string;
  /** ย่อหน้าอธิบาย */
  body?: string[];
  /** ตารางเทียบข้อมูล */
  table?: {
    caption?: string;
    head: string[];
    rows: string[][];
  };
  /** รายการที่ต้องจำแบบสั้น */
  bullets?: string[];
  /** จุดที่มักออกสอบ — เขียนแบบติวเตอร์ ไม่ใช่แบบตำรา */
  hot?: HotPoint[];
  /** ภาพประกอบจาก Wikimedia Commons */
  image?: {
    src: string;
    alt: string;
    credit: string;
    creditUrl: string;
  };
  /** id ของแหล่งอ้างอิงจาก data/sources.ts */
  sources?: string[];
  /**
   * วลีที่ต้องเน้นเป็นพิเศษ ระบบจะไฮไลต์คำเหล่านี้ในย่อหน้าโดยอัตโนมัติ
   * ใช้กับคำศัพท์ ตัวเลข หรือชื่อวิทยาศาสตร์ที่ต้องจำให้แม่น
   */
  keywords?: string[];
};

export type Topic = {
  slug: string;
  /** ลำดับที่แนะนำให้อ่าน */
  order: number;
  title: string;
  /** ชื่อหัวข้อแบบสั้น ใช้ในเมนู */
  short: string;
  /** หนึ่งบรรทัดบอกว่าหมวดนี้ว่าด้วยอะไร */
  tagline: string;
  /** คะแนนความสำคัญโดยประมาณ 1–5 ใช้จัดลำดับการอ่าน */
  weight: 1 | 2 | 3 | 4 | 5;
  /** เวลาอ่านโดยประมาณ (นาที) */
  minutes: number;
  /** ความเชื่อมโยงกับชีววิทยามัธยม ที่เด็กสายวิทย์มีอยู่แล้ว */
  bioBridge: string;
  /** เป้าหมายการเรียนรู้ */
  goals: string[];
  sections: Section[];
};
