import raw from "./kampuan-species.json";

/**
 * รายชื่อชนิดสัตว์น้ำที่สำรวจพบในป่าชายเลนคลองกาพวน จังหวัดระนอง
 *
 * ข้อมูลมาจากเอกสารเผยแพร่ของสถานีวิจัยเพื่อการพัฒนาชายฝั่งอันดามัน
 * คณะประมง มหาวิทยาลัยเกษตรศาสตร์ (ISBN 978-616-278-174-2)
 * แยกเป็นสัตว์ไม่มีกระดูกสันหลังและปลา พร้อมชื่อวิทยาศาสตร์ ชื่ออังกฤษ และชื่อไทย
 */

export type KampuanSpecies = {
  /** ชื่อวงศ์ */
  family: string | null;
  /** ชื่อวิทยาศาสตร์ */
  sci: string;
  /** ชื่อภาษาอังกฤษ */
  en: string;
  /** ชื่อภาษาไทย */
  th: string;
};

type RawFile = {
  source: string;
  isbn: string;
  invertebrates: KampuanSpecies[];
  fish: KampuanSpecies[];
  invertebrateCount: number;
  fishCount: number;
};

const data = raw as RawFile;

export const KAMPUAN_SOURCE = data.source;
export const KAMPUAN_ISBN = data.isbn;

/** สัตว์ไม่มีกระดูกสันหลังที่สำรวจพบ */
export const KAMPUAN_INVERTEBRATES: KampuanSpecies[] = data.invertebrates;

/** ปลาที่สำรวจพบ */
export const KAMPUAN_FISH: KampuanSpecies[] = data.fish;

/** จำนวนชนิดสัตว์ไม่มีกระดูกสันหลัง */
export const KAMPUAN_INVERTEBRATE_COUNT = KAMPUAN_INVERTEBRATES.length;

/** จำนวนชนิดปลา */
export const KAMPUAN_FISH_COUNT = KAMPUAN_FISH.length;

/** จำนวนชนิดรวม */
export const KAMPUAN_SPECIES_TOTAL =
  KAMPUAN_INVERTEBRATE_COUNT + KAMPUAN_FISH_COUNT;

/** จำนวนวงศ์ของปลาที่พบ */
export const KAMPUAN_FISH_FAMILY_COUNT = new Set(
  KAMPUAN_FISH.map((s) => s.family).filter(Boolean),
).size;

/** จำนวนวงศ์ของสัตว์ไม่มีกระดูกสันหลังที่พบ */
export const KAMPUAN_INVERT_FAMILY_COUNT = new Set(
  KAMPUAN_INVERTEBRATES.map((s) => s.family).filter(Boolean),
).size;

/** กลุ่มสัตว์ไม่มีกระดูกสันหลัง จัดตามชื่อไทยเป็นหมวดกว้าง ๆ เพื่อใช้แสดงผล */
export function groupInvertebrates(): { group: string; items: KampuanSpecies[] }[] {
  const pick = (test: (th: string) => boolean) =>
    KAMPUAN_INVERTEBRATES.filter((s) => test(s.th));
  return [
    { group: "หอยฝาเดียว", items: pick((t) => t.startsWith("หอย")) },
    { group: "กุ้งและเพรียง", items: pick((t) => t.startsWith("กุ้ง") || t.startsWith("เพรียง") || t.startsWith("แมงดา") || t.startsWith("แม่หอบ")) },
    { group: "ปูและปูเสฉวน", items: pick((t) => t.startsWith("ปู")) },
    { group: "อื่น ๆ", items: pick((t) => !t.startsWith("หอย") && !t.startsWith("กุ้ง") && !t.startsWith("เพรียง") && !t.startsWith("แมงดา") && !t.startsWith("แม่หอบ") && !t.startsWith("ปู")) },
  ].filter((g) => g.items.length > 0);
}
