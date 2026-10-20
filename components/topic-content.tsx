"use client";

import { useState } from "react";
import type { Section } from "@/data/types";
import { TopicBody } from "@/components/topic-body";

type HlMode = "all" | "key" | "off";

/**
 * เนื้อหาหมวดแบบเต็มหน้าพร้อมสลับโหมดไฮไลต์ได้
 *
 * แยกออกมาเป็นคอมโพเนนต์ฝั่งไคลเอนต์ เพราะการสลับโหมดเป็นการกระทำของผู้ใช้
 * ส่วนตัวเนื้อหาส่งเข้ามาจากเซิร์ฟเวอร์แล้ว จึงไม่ต้องโหลดข้อมูลใหม่
 */
export function TopicContent({ sections }: { sections: Section[] }) {
  const [hl, setHl] = useState<HlMode>("all");

  const cls = hl === "off" ? "hl-host hl-off" : hl === "key" ? "hl-host hl-keyonly" : "hl-host";

  return (
    <div className={cls}>
      <div className="no-print mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-ink-100 bg-white px-4 py-3">
        <p className="text-[12.5px] font-semibold text-ink-800">ไฮไลต์คำสำคัญในเนื้อหา</p>
        <p className="hidden text-[12px] text-ink-500 sm:block">
          คำสำคัญ · ชื่อวิทยาศาสตร์ · ตัวเลข · จุดที่มักเข้าใจผิด
        </p>
        <div className="ml-auto flex items-center gap-1 rounded-lg border border-ink-200 bg-sand-50 p-0.5">
          {(
            [
              { k: "all" as const, l: "ทั้งหมด" },
              { k: "key" as const, l: "คำสำคัญ" },
              { k: "off" as const, l: "ปิด" },
            ] as const
          ).map((m) => (
            <button
              key={m.k}
              type="button"
              onClick={() => setHl(m.k)}
              aria-pressed={hl === m.k}
              className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors ${
                hl === m.k ? "bg-sea-800 text-white" : "text-ink-500 hover:text-sea-700"
              }`}
            >
              {m.l}
            </button>
          ))}
        </div>
      </div>

      <TopicBody sections={sections} />
    </div>
  );
}
