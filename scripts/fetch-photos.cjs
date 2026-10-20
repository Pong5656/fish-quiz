#!/usr/bin/env node
/**
 * ดึงรูปจริงจาก Wikimedia Commons มาเก็บไว้ในโปรเจกต์
 *
 * หลักการ:
 *   1. ค้นรูปตามคำค้นที่กำหนด (ชื่อวิทยาศาสตร์ หรือ โครงสร้างอวัยวะ)
 *   2. กรองเอาเฉพาะไฟล์ที่ลิขสิทธิ์อนุญาตให้ใช้ต่อได้ (CC / public domain)
 *   3. กรองเอาเฉพาะไฟล์ภาพนิ่ง (jpg/png) ขนาดพอเหมาะ
 *   4. ดาวน์โหลดเวอร์ชันย่อความกว้างไม่เกิน 1200px เพื่อไม่ให้เว็บหนัก
 *   5. บันทึกข้อมูลที่มาและลิขสิทธิ์ลง data/photos.json ให้หน้าเว็บอ้างได้
 *
 * ไม่ใช้ไลบรารีภายนอก เรียก REST API ของ Commons ตรง ๆ
 */

const fs = require("node:fs");
const path = require("node:path");

const OUT_DIR = path.join(__dirname, "..", "public", "photos");
const META_FILE = path.join(__dirname, "..", "data", "photos.json");

/** ลิขสิทธิ์ที่ยอมรับได้ (ต้องใช้ต่อและดัดแปลงได้) */
const OK_LICENSE = [
  "cc0", "cc-zero", "public domain", "pd-", "cc-by", "cc by",
  "attribution", "cc-by-sa", "cc by-sa",
];

/** คำค้นที่ต้องการ พร้อมชื่อไฟล์เป้าหมายและหมวดที่ใช้
 *  หมายเหตุ: เลือกคำค้นให้เจอ "ภาพถ่ายของจริง" มากกว่าภาพวาดโบราณหรือแผนภาพ
 *  และคัดคำที่เสี่ยงได้ของไม่ตรง เช่น คำว่า carp ที่มักได้ภาพพิมพ์ญี่ปุ่น */
const WANTED = [
  // ── ชนิดพันธุ์เศรษฐกิจไทย ──
  { key: "tilapia", q: "Oreochromis niloticus live fish", topic: "economic-species" },
  { key: "snakehead", q: "Channa striata", topic: "economic-species" },
  { key: "catfish", q: "Pangasianodon hypophthalmus", topic: "economic-species" },
  { key: "shrimp", q: "Penaeus monodon", topic: "economic-species" },
  { key: "carp", q: "Cyprinus carpio live carp pond", topic: "economic-species", replace: true },
  { key: "milkfish", q: "Chanos chanos swimming", topic: "economic-species" },
  { key: "grouper", q: "Epinephelus live grouper reef", topic: "economic-species" },
  { key: "seabass", q: "Lates calcarifer", topic: "economic-species" },

  // ── กายวิภาค ──
  { key: "gill", q: "fish gills anatomy", topic: "fish-anatomy" },
  { key: "scales", q: "fish scales closeup", topic: "fish-anatomy", replace: true },
  { key: "skeleton", q: "fish skeleton anatomy", topic: "fish-anatomy" },

  // ── อนุกรมวิธาน ──
  { key: "shark", q: "Carcharhinus shark", topic: "taxonomy" },
  { key: "ray", q: "Himantura stingray", topic: "taxonomy" },
  { key: "lamprey", q: "lamprey Petromyzon", topic: "taxonomy" },
  { key: "coelacanth", q: "Latimeria coelacanth", topic: "taxonomy" },
  { key: "seahorse", q: "Hippocampus seahorse underwater", topic: "taxonomy", replace: true },

  // ── นิเวศวิทยา ──
  { key: "coral-reef", q: "coral reef fish Thailand", topic: "marine-ecology" },
  { key: "mangrove", q: "mangrove forest roots", topic: "marine-ecology" },
  { key: "plankton", q: "phytoplankton microscope", topic: "ecology" },
  { key: "seagrass", q: "seagrass bed underwater", topic: "marine-ecology" },

  // ── การเพาะเลี้ยง ──
  { key: "cage-farm", q: "fish cage aquaculture floating", topic: "aquaculture" },
  { key: "hatchery", q: "fish hatchery tanks", topic: "aquaculture" },
  { key: "pond", q: "fish pond farm aeration", topic: "aquaculture" },

  // ── โรคและปรสิต ──
  { key: "parasite", q: "fish parasite Lernaea", topic: "fish-disease" },
  { key: "fin-rot", q: "fin rot fish disease", topic: "fish-disease" },

  // ── เครื่องมือประมง ──
  { key: "trawl", q: "fishing trawler net", topic: "fishing-gear" },
  { key: "gillnet", q: "gillnet fishing", topic: "fishing-gear" },
  { key: "longtail", q: "Thai fishing boat longtail", topic: "fishing-gear" },

  // ── แปรรูป ──
  { key: "fish-market", q: "fish market fresh Thailand", topic: "processing" },
  { key: "dried-fish", q: "dried fish market", topic: "processing" },
];

const API = "https://commons.wikimedia.org/w/api.php";

/**
 * หน่วงเวลาระหว่างคำขอ เพราะ Commons จำกัดอัตราการเรียก
 * และลองใหม่แบบถอยเวลาขึ้นเมื่อโดน 429
 */
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function search(q, attempt = 0) {
  const url = `${API}?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=20&prop=imageinfo&iiprop=url|extmetadata|size|mime&iiurlwidth=1200&format=json&origin=*`;
  const res = await fetch(url, {
    headers: { "User-Agent": "fish-quiz-study-site/1.0 (educational; contact: local)" },
  });
  if (res.status === 429 && attempt < 5) {
    const wait = 3000 * (attempt + 1);
    console.warn(`   … โดนจำกัดอัตรา รอ ${wait / 1000}s แล้วลองใหม่`);
    await sleep(wait);
    return search(q, attempt + 1);
  }
  if (!res.ok) throw new Error(`search ${q}: ${res.status}`);
  const json = await res.json();
  return Object.values(json.query?.pages ?? {});
}

function licenseOf(meta) {
  const raw = (meta?.LicenseShortName?.value ?? "") + " " + (meta?.License?.value ?? "");
  return raw.trim();
}

function isOkLicense(lic) {
  const l = lic.toLowerCase();
  if (!l) return false;
  // ปฏิเสธลิขสิทธิ์แบบไม่เสรีชัดเจน
  if (/fair use|non-free|all rights reserved|nolicense/.test(l)) return false;
  return OK_LICENSE.some((k) => l.includes(k));
}

function stripHtml(s) {
  return (s ?? "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf.length;
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const out = [];
  const used = new Set();

  // โหลดข้อมูลเดิมที่มีอยู่แล้ว เพื่อรันซ้ำได้โดยไม่ต้องดึงใหม่ทั้งหมด
  if (fs.existsSync(META_FILE)) {
    try {
      for (const p of JSON.parse(fs.readFileSync(META_FILE, "utf8"))) {
        if (fs.existsSync(path.join(__dirname, "..", "public", p.file.replace(/^\//, "")))) {
          out.push(p);
        }
      }
      console.log(`พบรูปเดิม ${out.length} รูป จะเติมเฉพาะที่ยังขาด\n`);
    } catch {
      /* ไฟล์เสียก็เริ่มใหม่ */
    }
  }
  const have = new Set(out.map((p) => p.key));

  for (const w of WANTED) {
    // รูปที่สั่ง replace ให้ดึงใหม่ทับของเดิม
    if (have.has(w.key) && !w.replace) {
      console.log(`· ${w.key} มีอยู่แล้ว ข้าม`);
      continue;
    }
    if (have.has(w.key) && w.replace) {
      console.log(`↻ ${w.key} สั่งดึงใหม่`);
      out.splice(out.findIndex((p) => p.key === w.key), 1);
      have.delete(w.key);
    }
    let pages = [];
    try {
      pages = await search(w.q);
    } catch (e) {
      console.warn(`⚠ ค้นไม่สำเร็จ: ${w.key} — ${e.message}`);
      continue;
    }

    const pick = pages.find((p) => {
      const info = p.imageinfo?.[0];
      if (!info) return false;
      const mime = info.mime ?? "";
      if (!/image\/(jpeg|png)/.test(mime)) return false;
      if ((info.width ?? 0) < 500) return false;
      // ปฏิเสธภาพแนวตั้งสูงมาก ซึ่งมักเป็นภาพพิมพ์หรือแผนที่ ไม่ใช่ภาพถ่ายสัตว์น้ำ
      const ratio = (info.width ?? 0) / (info.height ?? 1);
      if (ratio < 0.8) return false;
      // ปฏิเสธภาพวาดโบราณ/แผนภาพ ที่มักมีคำเหล่านี้ในชื่อเรื่อง
      const title = (p.title ?? "").toLowerCase();
      if (/drawing|illustration|engraving|print|plate|stamp|painting|sketch|map|diagram/.test(title)) {
        return false;
      }
      const lic = licenseOf(info.extmetadata);
      if (!isOkLicense(lic)) return false;
      if (used.has(p.title)) return false;
      return true;
    });

    if (!pick) {
      console.warn(`⚠ ไม่พบรูปที่ใช้ได้: ${w.key}`);
      continue;
    }

    const info = pick.imageinfo[0];
    const meta = info.extmetadata ?? {};
    const srcUrl = info.thumburl || info.url;
    const ext = /png/.test(info.mime) ? "png" : "jpg";
    const file = `${w.key}.${ext}`;
    const dest = path.join(OUT_DIR, file);

    // ลบไฟล์เดิมที่มีนามสกุลต่างออกก่อน เพื่อไม่ให้เหลือไฟล์ค้าง
    for (const other of ["jpg", "png"]) {
      const p = path.join(OUT_DIR, `${w.key}.${other}`);
      if (other !== ext && fs.existsSync(p)) fs.unlinkSync(p);
    }

    try {
      const bytes = await download(srcUrl, dest);
      used.add(pick.title);
      out.push({
        key: w.key,
        file: `/photos/${file}`,
        topic: w.topic,
        title: stripHtml(meta.ObjectName?.value) || pick.title.replace(/^File:/, ""),
        description: stripHtml(meta.ImageDescription?.value).slice(0, 300),
        author: stripHtml(meta.Artist?.value) || "ไม่ระบุ",
        license: licenseOf(meta),
        pageUrl: info.descriptionurl,
        bytes,
      });
      console.log(`✓ ${w.key} (${Math.round(bytes / 1024)} kB) — ${licenseOf(meta)}`);
    } catch (e) {
      console.warn(`⚠ ดาวน์โหลดไม่สำเร็จ: ${w.key} — ${e.message}`);
    }

    // เว้นจังหวะก่อนค้นคำถัดไป เพื่อไม่ให้โดนจำกัดอัตรา
    await sleep(1200);
  }

  out.sort((a, b) => WANTED.findIndex((w) => w.key === a.key) - WANTED.findIndex((w) => w.key === b.key));
  fs.writeFileSync(META_FILE, JSON.stringify(out, null, 2) + "\n");
  console.log(`\nได้รูปทั้งหมด ${out.length} จาก ${WANTED.length} รายการ`);
})();
