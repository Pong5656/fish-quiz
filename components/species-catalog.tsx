"use client";

import { useMemo, useState } from "react";
import {
  KAMPUAN_FISH,
  KAMPUAN_INVERTEBRATES,
  type KampuanSpecies,
} from "@/data/kampuan";

type Tab = "fish" | "invertebrates";

/** แสดงรายชื่อชนิดสัตว์น้ำแบบค้นหาและกรองได้ ใช้กับหน้าเอกสารอ้างอิง */
export function SpeciesCatalog() {
  const [tab, setTab] = useState<Tab>("fish");
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState<string>("ทั้งหมด");

  const list = tab === "fish" ? KAMPUAN_FISH : KAMPUAN_INVERTEBRATES;

  const families = useMemo(() => {
    const set = new Set(list.map((s) => s.family).filter(Boolean) as string[]);
    return ["ทั้งหมด", ...[...set].sort()];
  }, [list]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.filter((s) => {
      if (family !== "ทั้งหมด" && s.family !== family) return false;
      if (!q) return true;
      return (
        s.sci.toLowerCase().includes(q) ||
        s.th.toLowerCase().includes(q) ||
        s.en.toLowerCase().includes(q) ||
        (s.family ?? "").toLowerCase().includes(q)
      );
    });
  }, [list, query, family]);

  // จัดกลุ่มผลลัพธ์ตามวงศ์ เพื่อให้อ่านง่าย
  const grouped = useMemo(() => {
    const map = new Map<string, KampuanSpecies[]>();
    for (const s of filtered) {
      const key = s.family ?? "ไม่ระบุวงศ์";
      const arr = map.get(key) ?? [];
      arr.push(s);
      map.set(key, arr);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  return (
    <div className="mt-8">
      {/* แท็บเลือกกลุ่ม */}
      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            { k: "fish" as const, l: `ปลา (${KAMPUAN_FISH.length} ชนิด)` },
            {
              k: "invertebrates" as const,
              l: `สัตว์ไม่มีกระดูกสันหลัง (${KAMPUAN_INVERTEBRATES.length} ชนิด)`,
            },
          ] as const
        ).map((t) => (
          <button
            key={t.k}
            type="button"
            onClick={() => {
              setTab(t.k);
              setFamily("ทั้งหมด");
            }}
            aria-pressed={tab === t.k}
            className={`rounded-lg border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
              tab === t.k
                ? "border-sea-400 bg-sea-50 text-sea-800"
                : "border-ink-200 bg-white text-ink-600 hover:border-sea-300"
            }`}
          >
            {t.l}
          </button>
        ))}
      </div>

      {/* ช่องค้นหาและตัวกรองวงศ์ */}
      <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหาชื่อไทย ชื่ออังกฤษ ชื่อวิทยาศาสตร์ หรือวงศ์"
          aria-label="ค้นหารายชื่อชนิด"
          className="w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-[13.5px] text-ink-800 placeholder:text-ink-400 focus:border-sea-400 focus:outline-none"
        />
        <select
          value={family}
          onChange={(e) => setFamily(e.target.value)}
          aria-label="กรองตามวงศ์"
          className="rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-[13.5px] text-ink-700 focus:border-sea-400 focus:outline-none"
        >
          {families.map((f) => (
            <option key={f} value={f}>
              {f === "ทั้งหมด" ? "ทุกวงศ์" : f}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-3 text-[12.5px] text-ink-500">
        พบ {filtered.length} ชนิด จากทั้งหมด {list.length} ชนิด
      </p>

      {/* ตารางผลลัพธ์ */}
      {filtered.length === 0 ? (
        <p className="mt-6 rounded-xl border border-ink-200 bg-sand-50 px-4 py-6 text-center text-[13.5px] text-ink-500">
          ไม่พบชนิดที่ตรงกับเงื่อนไข ลองลบคำค้นหรือเลือกวงศ์ใหม่
        </p>
      ) : (
        <div className="mt-4 space-y-6">
          {grouped.map(([fam, items]) => (
            <section key={fam}>
              <h3 className="text-[13px] font-bold uppercase tracking-wide text-sea-700">
                {fam}
                <span className="ml-2 font-normal normal-case text-ink-400">
                  {items.length} ชนิด
                </span>
              </h3>
              <div className="mt-2 overflow-x-auto rounded-xl border border-ink-100">
                <table className="w-full border-collapse text-left text-[13px]">
                  <thead>
                    <tr className="bg-sand-50 text-[12px] text-ink-500">
                      <th className="px-3.5 py-2.5 font-semibold">ชื่อวิทยาศาสตร์</th>
                      <th className="px-3.5 py-2.5 font-semibold">ชื่ออังกฤษ</th>
                      <th className="px-3.5 py-2.5 font-semibold">ชื่อไทย</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((s) => (
                      <tr
                        key={s.sci}
                        className="border-t border-ink-100 odd:bg-white even:bg-sand-50/40"
                      >
                        <td className="px-3.5 py-2.5 italic text-ink-800">{s.sci}</td>
                        <td className="px-3.5 py-2.5 text-ink-600">{s.en}</td>
                        <td className="px-3.5 py-2.5 text-ink-700">{s.th}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
