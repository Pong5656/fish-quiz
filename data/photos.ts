import raw from "./photos.json";

/**
 * รูปจริงที่ดึงจาก Wikimedia Commons
 *
 * ทุกรูปผ่านการกรองลิขสิทธิ์แล้ว (CC หรือ public domain) และเก็บข้อมูลที่มาไว้
 * เพื่อให้หน้าเว็บแสดงเครดิตได้ครบตามเงื่อนไขของสัญญาอนุญาต
 */
export type Photo = {
  /** คีย์สั้น ๆ ใช้อ้างในเนื้อหา */
  key: string;
  /** เส้นทางไฟล์ในโปรเจกต์ */
  file: string;
  /** หมวดเนื้อหาที่รูปนี้ใช้ */
  topic: string;
  /** ชื่อเรื่องของรูป */
  title: string;
  /** คำบรรยายจากต้นทาง */
  description: string;
  /** ผู้สร้าง */
  author: string;
  /** สัญญาอนุญาต */
  license: string;
  /** หน้าต้นทางบน Commons */
  pageUrl: string;
  /** ขนาดไฟล์เป็นไบต์ */
  bytes: number;
};

export const PHOTOS: Photo[] = raw as Photo[];

export const PHOTO_BY_KEY = new Map(PHOTOS.map((p) => [p.key, p]));

export function getPhoto(key: string): Photo | undefined {
  return PHOTO_BY_KEY.get(key);
}

/** รูปรวมของหมวดหนึ่ง ๆ */
export function photosOfTopic(topic: string): Photo[] {
  return PHOTOS.filter((p) => p.topic === topic);
}

/** สรุปสัญญาอนุญาตแบบสั้น อ่านง่าย */
export function shortLicense(license: string): string {
  const l = license.toLowerCase();
  if (l.includes("public domain") || l.includes("pd")) return "สาธารณสมบัติ (Public domain)";
  if (l.includes("cc0")) return "CC0";
  if (l.includes("by-sa")) return "CC BY-SA";
  if (l.includes("by-nc")) return "CC BY-NC";
  if (l.includes("cc by") || l.includes("cc-by")) return "CC BY";
  return license;
}
