/**
 * ตรวจข้อความในไฟล์ข้อมูลและคอมโพเนนต์ ว่ามีอักขระแปลกปลอมหลุดเข้ามาหรือไม่
 *
 * ปัญหาที่พบได้บ่อยคืออักขระจากภาษาอื่น (จีน อาหรับ ฮีบรู ฯลฯ)
 * หรืออักขระแทนที่ (U+FFFD) หลุดเข้ามาในสตริงภาษาไทย
 * ทำให้ผู้ใช้อ่านแล้วเห็นเป็นตัวประหลาด จึงต้องตรวจจับก่อน deploy
 *
 * วิธีใช้: node scripts/check-text.cjs
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DIRS = ["app", "components", "data"];

// ช่วงอักขระที่อนุญาตในเนื้อหาเว็บนี้
const ALLOWED = [
  [0x0000, 0x007f], // ASCII
  [0x00a0, 0x00ff], // Latin-1 (เช่น ą, í ในชื่อวิทยาศาสตร์)
  [0x0100, 0x017f], // Latin Extended-A
  [0x0180, 0x024f], // Latin Extended-B
  [0x0300, 0x036f], // combining diacritics
  [0x1e00, 0x1eff], // Latin Extended Additional (เวียดนาม)
  [0x2010, 0x2027], // ขีด เครื่องหมาย และเครื่องหมายคำพูด
  [0x2030, 0x205e], // เครื่องหมายเพิ่มเติม
  [0x2070, 0x209f], // ตัวห้อย ตัวยก (เชน ₃)
  [0x20a0, 0x20bf], // สกุลเงิน
  [0x2100, 0x214f], // letterlike
  [0x2190, 0x21ff], // ลูกศร
  [0x2200, 0x22ff], // คณิตศาสตร์ (เช่น ≈)
  [0x2500, 0x257f], // เส้นตาราง
  [0x25a0, 0x25ff], // รูปทรง
  [0x2600, 0x27bf], // สัญลักษณ์
  [0x3000, 0x30ff], // ญี่ปุ่น (ใช้ในคำบรรยายภาพ)
  [0x4e00, 0x9fff], // CJK (ใช้ในคำบรรยายภาพ)
  [0x0e00, 0x0e7f], // ไทย
  [0xfe0f, 0xfe0f], // variation selector
  [0x1f300, 0x1faff], // อีโมจิ
];

function allowed(cp) {
  return ALLOWED.some(([a, b]) => cp >= a && cp <= b);
}

const BAD = [];
const files = [];

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full);
    else if (/\.(tsx?|json|css)$/.test(name) && name !== "kampuan-species.json") files.push(full);
  }
}

for (const d of DIRS) walk(path.join(ROOT, d));

for (const f of files) {
  const lines = fs.readFileSync(f, "utf8").split("\n");
  lines.forEach((line, i) => {
    for (const ch of line) {
      const cp = ch.codePointAt(0);
      if (!allowed(cp)) {
        BAD.push({
          file: path.relative(ROOT, f),
          line: i + 1,
          cp: "U+" + cp.toString(16).toUpperCase().padStart(4, "0"),
          ch,
        });
      }
    }
  });
}

if (BAD.length === 0) {
  console.log(`ตรวจ ${files.length} ไฟล์: ไม่พบอักขระแปลกปลอม`);
} else {
  console.log(`พบอักขระแปลกปลอม ${BAD.length} จุด:`);
  for (const b of BAD.slice(0, 60)) {
    console.log(`  ${b.file}:${b.line} ${b.cp} [${b.ch}]`);
  }
  process.exitCode = 1;
}
