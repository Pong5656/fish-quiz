import type { ReactNode } from "react";

/**
 * ไฮไลต์คำสำคัญในข้อความไทยโดยอัตโนมัติ
 *
 * หลักการ: ไม่แก้ข้อความต้นฉบับ แต่แยกข้อความออกเป็นชิ้น ๆ แล้วหุ้มเฉพาะ
 * ช่วงที่เข้าเงื่อนไขด้วย <mark> โดยตรวจ 4 ชนิดตามลำดับความสำคัญ
 *   1. คำสำคัญที่ผู้เขียนระบุเอง (keywords) — สีทอง
 *   2. ชื่อวิทยาศาสตร์ (ตัวเอียงละติน) — สีเขียวน้ำทะเล
 *   3. ตัวเลขและหน่วยวัด — สีน้ำเงิน
 *   4. คำเตือน/คำที่มักเข้าใจผิด — สีแดงอ่อน
 *
 * ใช้การจับแบบไม่สนตัวพิมพ์แต่รักษาตัวอักษรเดิมไว้ และตัดคำที่ยาวกว่าก่อน
 * เพื่อไม่ให้คำสั้นไปตัดกลางคำยาว
 */

/* คำที่บอกว่าเป็นข้อควรระวัง — ไฮไลต์แดง
   เลือกเฉพาะวลีที่ไม่มีโอกาสไปอยู่กลางคำอื่น เพราะภาษาไทยไม่มีเว้นวรรค
   จึงหลีกเลี่ยงคำสั้นอย่าง "ตาย" หรือ "ห้าม" เดี่ยว ๆ */
const WARN_WORDS = [
  "มักเข้าใจผิด",
  "ข้อควรระวัง",
  "ระวัง",
  "ห้ามใช้",
  "ไม่ใช่",
  "เป็นพิษ",
  "พิษสูง",
  "สับสน",
  "คลาดเคลื่อน",
  "ไม่ถูกต้อง",
  "ตรงกันข้าม",
  "ตายได้",
  "ตายเป็นจำนวนมาก",
];

/* คำสั้นที่ต้องมีบริบทกำกับก่อนจึงจะไฮไลต์ เพื่อไม่ให้ไปตัดกลางคำอื่น */
const QUALIFIED_WARN = [
  { word: "ห้าม", before: /(?<![\u0E00-\u0E7F])/ },
  { word: "ตาย", before: /(?<![\u0E00-\u0E7F])/ },
  { word: "พิษ", before: /(?<![\u0E00-\u0E7F])/ },
];

/* มาตราวัดและหน่วยที่ต้องจำ */
const UNIT_PATTERN =
  /(\d[\d,.]*\s*(?:–|-|ถึง)?\s*\d*[\d,.]*\s*(?:%|องศาเซลเซียส|°C|ppt|ppm|mg\/L|มก\.\/ล\.|ล้านตัน|ตัน|ล้านบาท|บาท|ล้านปี|ปี|เมตร|ซม\.|มม\.|กก\.|กิโลกรัม|กรัม|นาที|ชั่วโมง|วัน|เดือน|ข้อ|คน|เท่า|ช่อง|ครีบ|ชนิด|ตัว))/g;

/* ชื่อวิทยาศาสตร์แบบทวินาม — ตัวเอียงละติน ขึ้นต้นด้วยตัวใหญ่ */
const BINOMIAL_PATTERN = /\b([A-Z][a-z]{3,})\s([a-z]{3,})\b/g;

type Piece = { text: string; kind: "plain" | "key" | "sci" | "num" | "warn" };

/** สร้างช่วงที่ต้องไฮไลต์จากข้อความหนึ่งช่วง */
function markPieces(text: string, keywords: string[]): Piece[] {
  // เก็บเป็นช่วง [start, end) บนข้อความต้นฉบับ แล้วค่อยประกอบเป็นชิ้นทีเดียว
  const ranges: { start: number; end: number; kind: Piece["kind"] }[] = [];

  const push = (kind: Piece["kind"], start: number, end: number) => {
    if (end > start) ranges.push({ start, end, kind });
  };

  // 1. keywords ที่ผู้เขียนระบุ (ค้นแบบไม่สนตัวพิมพ์)
  const lower = text.toLowerCase();
  for (const kw of [...keywords].sort((a, b) => b.length - a.length)) {
    const k = kw.toLowerCase();
    let at = lower.indexOf(k);
    while (at !== -1) {
      push("key", at, at + kw.length);
      at = lower.indexOf(k, at + kw.length);
    }
  }

  // 2. ชื่อวิทยาศาสตร์แบบทวินาม
  for (const m of text.matchAll(BINOMIAL_PATTERN)) {
    if (m.index === undefined) continue;
    push("sci", m.index, m.index + m[0].length);
  }

  // 3. ตัวเลขและหน่วยวัด
  for (const m of text.matchAll(UNIT_PATTERN)) {
    if (m.index === undefined) continue;
    push("num", m.index, m.index + m[0].length);
  }

  // 4. คำเตือน
  for (const w of WARN_WORDS) {
    const wl = w.toLowerCase();
    let at = lower.indexOf(wl);
    while (at !== -1) {
      push("warn", at, at + w.length);
      at = lower.indexOf(wl, at + w.length);
    }
  }

  // 4.1 คำเตือนสั้น ต้องมีขอบเขตให้แน่ใจว่าไม่ใช่ส่วนหนึ่งของคำยาว
  for (const { word, before } of QUALIFIED_WARN) {
    const wl = word.toLowerCase();
    let at = lower.indexOf(wl);
    while (at !== -1) {
      const prev = at > 0 ? lower[at - 1] : "";
      const next = lower[at + wl.length] ?? "";
      // ต้องไม่มีอักษรไทยติดหน้าหรือติดหลัง จึงถือว่าเป็นคำเดี่ยว
      const prevThai = /[\u0E00-\u0E7F]/.test(prev);
      const nextThai = /[\u0E00-\u0E7F]/.test(next);
      if (!prevThai && !nextThai && before.test(prev)) {
        push("warn", at, at + word.length);
      }
      at = lower.indexOf(wl, at + wl.length);
    }
  }

  if (!ranges.length) return [{ text, kind: "plain" }];

  // เรียงตามตำแหน่ง แล้วให้ช่วงที่มาถึงก่อนมีสิทธิ์ก่อน (ตามลำดับความสำคัญที่ push ไว้)
  ranges.sort((a, b) => a.start - b.start || b.end - a.end);

  // รวมช่วงที่ทับกัน โดยยึดชนิดของช่วงที่เริ่มก่อน
  const taken: { start: number; end: number; kind: Piece["kind"] }[] = [];
  for (const r of ranges) {
    const last = taken[taken.length - 1];
    if (last && r.start < last.end) {
      // ทับกัน — ขยายปลายและคงชนิดเดิมไว้
      last.end = Math.max(last.end, r.end);
      continue;
    }
    taken.push({ ...r });
  }

  // ประกอบเป็นชิ้น
  const pieces: Piece[] = [];
  let cursor = 0;
  for (const r of taken) {
    if (r.start > cursor) pieces.push({ text: text.slice(cursor, r.start), kind: "plain" });
    pieces.push({ text: text.slice(r.start, r.end), kind: r.kind });
    cursor = r.end;
  }
  if (cursor < text.length) pieces.push({ text: text.slice(cursor), kind: "plain" });

  return pieces;
}

const KIND_CLASS: Record<Piece["kind"], string> = {
  plain: "",
  key: "hl-key",
  sci: "hl-sci",
  num: "hl-num",
  warn: "hl-warn",
};

/**
 * แสดงข้อความพร้อมไฮไลต์
 * @param text ข้อความต้นฉบับ
 * @param keywords คำที่ต้องการเน้นเป็นพิเศษ
 */
export function Highlight({
  text,
  keywords = [],
}: {
  text: string;
  keywords?: string[];
}): ReactNode {
  if (!text) return null;
  const pieces = markPieces(text, keywords);
  // ถ้าไม่มีอะไรถูกไฮไลต์เลย ส่งข้อความเดิมกลับไปเพื่อไม่ให้ DOM บวม
  if (pieces.length === 1 && pieces[0].kind === "plain") return text;

  return (
    <>
      {pieces.map((p, i) =>
        p.kind === "plain" ? (
          <span key={i}>{p.text}</span>
        ) : (
          <mark key={i} className={KIND_CLASS[p.kind]}>
            {p.text}
          </mark>
        ),
      )}
    </>
  );
}

/** ไฮไลต์ทั้งรายการพร้อมกัน ใช้กับ bullets */
export function HighlightList({
  items,
  keywords = [],
}: {
  items: string[];
  keywords?: string[];
}): ReactNode {
  return (
    <>
      {items.map((it, i) => (
        <span key={i}>
          {i > 0 ? "\n" : ""}
          <Highlight text={it} keywords={keywords} />
        </span>
      ))}
    </>
  );
}

/** เปิด/ปิดไฮไลต์ทั้งหน้าได้ด้วยคลาสนี้ที่ container */
export const HIGHLIGHT_CONTAINER = "hl-host";
