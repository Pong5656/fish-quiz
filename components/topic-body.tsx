import type { Section } from "@/data/types";
import { SourceList } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { Highlight } from "@/components/highlight";
import { deriveKeywords } from "@/data";

/** ตารางข้อมูลที่เลื่อนได้ในจอเล็ก */
function DataTable({
  table,
  keywords,
}: {
  table: NonNullable<Section["table"]>;
  keywords?: string[];
}) {
  return (
    <figure className="my-5">
      <div className="table-scroll rounded-lg border border-ink-100">
        <table className="data-table">
          <thead>
            <tr>
              {table.head.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={ci === 0 ? "font-medium text-ink-900 whitespace-nowrap" : undefined}
                  >
                    <Highlight text={cell} keywords={keywords} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.caption && (
        <figcaption className="mt-2 text-[12px] text-ink-400">{table.caption}</figcaption>
      )}
    </figure>
  );
}

/** บล็อกจุดที่มักออกสอบ — หัวใจของหน้าเนื้อหา */
function HotPoints({
  items,
  keywords,
}: {
  items: NonNullable<Section["hot"]>;
  keywords?: string[];
}) {
  if (!items.length) return null;
  return (
    <div className="mt-5 rounded-xl border border-sea-200 bg-sea-50/50">
      <div className="flex items-center gap-2 border-b border-sea-200 px-4 py-2.5">
        <span aria-hidden className="text-sea-600">
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
            <path d="M10 1.5l2.3 5.1 5.6.6-4.2 3.8 1.2 5.5L10 13.8l-4.9 2.7 1.2-5.5L2.1 7.2l5.6-.6L10 1.5z" />
          </svg>
        </span>
        <p className="text-[13px] font-semibold text-sea-800">
          จุดที่มักออกสอบในหัวข้อนี้
        </p>
        <span className="ml-auto text-[11.5px] text-sea-600">{items.length} ข้อ</span>
      </div>
      <ul className="divide-y divide-sea-100">
        {items.map((h, i) => (
          <li key={i} className="px-4 py-4">
            <p className="text-[13.5px] font-medium leading-snug text-ink-900">
              <span className="mr-1.5 font-mono text-[12px] text-sea-600">Q{i + 1}</span>
              <Highlight text={h.q} keywords={keywords} />
            </p>
            <p className="mt-1.5 border-l-2 border-sea-300 pl-3 text-[13px] leading-relaxed text-ink-700">
              <span className="mr-1 font-semibold text-sea-700">ตอบ:</span>
              <Highlight text={h.a} keywords={keywords} />
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** ภาพประกอบ — รองรับทั้งภาพถ่ายจริงจาก Commons และแผนภาพที่วาดขึ้นเอง */
function Figure({ image }: { image: NonNullable<Section["image"]> }) {
  return (
    <figure className="my-6 overflow-hidden rounded-xl border border-ink-100 bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        className="mx-auto h-auto max-h-[520px] w-full bg-sand-50 object-contain"
      />
      <figcaption className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-ink-100 px-4 py-3 text-[12px] text-ink-500">
        <span className="text-ink-700">{image.alt}</span>
        <span aria-hidden className="text-ink-300">·</span>
        <a
          href={image.creditUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sea-700 hover:text-sea-900 hover:underline"
        >
          {image.credit}
        </a>
      </figcaption>
    </figure>
  );
}

export function TopicBody({ sections }: { sections: Section[] }) {
  return (
    <div className="mt-12 space-y-14">
      {sections.map((sec, i) => (
        <Reveal key={sec.heading} as="section">
          <article id={`sec-${i + 1}`} className="scroll-mt-24">
            <h2 className="text-[21px] font-bold leading-snug tracking-tight text-ink-900 sm:text-[23px]">
              {sec.heading}
            </h2>
            <span className="mt-3 block h-0.5 w-14 rounded-full bg-gradient-to-r from-sea-400 to-sea-600" />

            {sec.body?.map((p, pi) => (
              <p key={pi} className="mt-4 text-[14.5px] leading-[1.85] text-ink-700">
                <Highlight text={p} keywords={deriveKeywords(sec)} />
              </p>
            ))}

            {sec.table && <DataTable table={sec.table} keywords={deriveKeywords(sec)} />}
            {sec.image && <Figure image={sec.image} />}

            {sec.bullets && (
              <ul className="mt-5 space-y-2.5">
                {sec.bullets.map((b, bi) => (
                  <li
                    key={bi}
                    className="flex gap-3 text-[14px] leading-[1.8] text-ink-700"
                  >
                    <span
                      aria-hidden
                      className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-sea-400"
                    />
                    <span>
                      <Highlight text={b} keywords={deriveKeywords(sec)} />
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {sec.hot && <HotPoints items={sec.hot} keywords={deriveKeywords(sec)} />}

            {sec.sources && (
              <div className="mt-5">
                <p className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-400">
                  แหล่งอ้างอิงของหัวข้อนี้
                </p>
                <SourceList ids={sec.sources} />
              </div>
            )}
          </article>
        </Reveal>
      ))}
    </div>
  );
}
