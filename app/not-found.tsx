import Link from "next/link";
import { ALL_TOPICS } from "@/data";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <p className="font-mono text-[13px] font-semibold tracking-widest text-sea-500">
        404
      </p>
      <h1 className="mt-4 text-[28px] font-bold tracking-tight text-ink-900 sm:text-[34px]">
        ไม่พบหน้าที่ต้องการ
      </h1>
      <p className="mt-4 text-[14.5px] leading-relaxed text-ink-600">
        ลิงก์นี้อาจถูกเปลี่ยนชื่อหรือพิมพ์ผิด
        ลองเลือกจากทางเข้าด้านล่าง หรือกลับไปเริ่มจากหน้าเนื้อหา
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/topics"
          className="rounded-lg bg-sea-800 px-5 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-sea-900"
        >
          ดูเนื้อหาทั้งหมด
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-ink-200 bg-white px-5 py-2.5 text-[13.5px] font-semibold text-ink-800 transition-colors hover:border-sea-300 hover:text-sea-700"
        >
          กลับหน้าแรก
        </Link>
      </div>

      <div className="mt-12 w-full">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-ink-400">
          หรือไปที่หมวดที่อ่านบ่อย
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {ALL_TOPICS.filter((t) => t.weight >= 4).map((t) => (
            <Link
              key={t.slug}
              href={`/topics/${t.slug}`}
              className="rounded-md border border-ink-200 bg-white px-2.5 py-1 text-[12px] text-ink-600 transition-colors hover:border-sea-300 hover:text-sea-700"
            >
              {t.short}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
