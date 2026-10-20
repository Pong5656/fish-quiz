import type { Photo } from "@/data/photos";
import { shortLicense } from "@/data/photos";

/**
 * แกลเลอรีภาพถ่ายจริงจาก Wikimedia Commons
 *
 * แสดงภาพพร้อมเครดิตครบตามเงื่อนไขสัญญาอนุญาต คือชื่อผู้สร้าง
 * ชื่อสัญญาอนุญาต และลิงก์กลับไปยังหน้าต้นทาง
 */
export function PhotoGallery({
  photos,
  heading,
  note,
}: {
  photos: Photo[];
  heading?: string;
  note?: string;
}) {
  if (!photos.length) return null;

  return (
    <section className="mt-10">
      {heading && (
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-[18px] font-bold text-ink-900">{heading}</h2>
          <span className="text-[12.5px] text-ink-400">{photos.length} ภาพ</span>
        </div>
      )}
      {note && (
        <p className="mt-2 text-[13px] leading-relaxed text-ink-600">{note}</p>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {photos.map((p, i) => (
          <figure
            key={p.key}
            className="card-surface overflow-hidden rounded-xl"
            style={{ animationDelay: `${i * 45}ms` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.file}
              alt={p.title}
              loading="lazy"
              className="h-52 w-full bg-sand-50 object-cover"
            />
            <figcaption className="p-4">
              <p className="text-[13.5px] font-semibold leading-snug text-ink-900">
                {p.title}
              </p>
              {p.description && (
                <p className="mt-1.5 line-clamp-3 text-[12.5px] leading-relaxed text-ink-600">
                  {p.description}
                </p>
              )}
              <p className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-ink-50 pt-2.5 text-[11.5px] text-ink-500">
                <span className="text-ink-600">{p.author}</span>
                <span aria-hidden className="text-ink-300">·</span>
                <span className="rounded bg-sea-50 px-1.5 py-0.5 font-medium text-sea-700">
                  {shortLicense(p.license)}
                </span>
                <a
                  href={p.pageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto font-medium text-sea-700 hover:underline"
                >
                  ต้นทาง ↗
                </a>
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
