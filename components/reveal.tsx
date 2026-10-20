"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** หน่วงเวลาเป็นมิลลิวินาที */
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
};

/**
 * แสดงเนื้อหาเมื่อเลื่อนถึง — ทำงานฝั่งไคลเอนต์ด้วย IntersectionObserver
 * ถ้าผู้ใช้ปิดอนิเมชัน ระบบจะแสดงเนื้อหาทันทีโดยไม่ต้องรอ
 */
export function Reveal({ children, delay = 0, className = "", as = "div" }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  // เริ่มที่ "แสดงแล้ว" ไว้ก่อน แล้วค่อยปิดเพื่อเล่นอนิเมชัน
  // เพื่อไม่ให้หน้าเว็บว่างเปล่า ถ้าเบราว์เซอร์ระงับ IntersectionObserver
  // (เช่น แท็บถูกซ่อน หรือผู้ใช้เปิดลิงก์ไว้เบื้องหลัง)
  const [shown, setShown] = useState(true);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined" || document.hidden) {
      setShown(true);
      return;
    }

    const rect = el.getBoundingClientRect();
    // ถ้าอยู่ในจอตั้งแต่เรนเดอร์แรก ไม่ต้องซ่อนเพื่อรอ observer
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      setShown(true);
      return;
    }

    setShown(false);

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    io.observe(el);

    // กันเหนียว: ถ้า observer ไม่ทำงานภายใน 1.2 วินาที ให้แสดงเนื้อหาไว้เลย
    const guard = window.setTimeout(() => setShown(true), 1200);

    return () => {
      io.disconnect();
      window.clearTimeout(guard);
    };
  }, []);

  // เมื่อแท็บกลับมาแสดงผลอีกครั้ง ให้แสดงเนื้อหาทันทีไม่ต้องรอ observer
  useEffect(() => {
    const onVisible = () => {
      if (!document.hidden) setShown(true);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  const Tag = as as "div";

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={`reveal ${shown ? "is-visible" : ""} ${className}`}
      style={shown && delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

type CounterProps = {
  to: number;
  duration?: number;
  suffix?: string;
};

/** นับตัวเลขขึ้นเมื่อเห็นบนจอ — ถ้านับไม่ได้ ให้แสดงค่าจริงทันที ไม่ค้างที่ 0 */
export function Counter({ to, duration = 1100, suffix = "" }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  // ตั้งต้นที่ค่าจริง ถ้าไม่มีการเล่นอนิเมชันตัวเลขจะยังถูกต้อง
  const [value, setValue] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined" || document.hidden) {
      setValue(to);
      return;
    }

    let frame = 0;
    let started = false;
    let guard = 0;

    const run = () => {
      if (started) return;
      started = true;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(eased * to));
        if (p < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    // แสดงค่าจริงทันที แล้วนับย้อนจาก 0 เฉพาะเมื่อ observer ยืนยันว่าเห็นจริง
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setValue(0);
          run();
          io.disconnect();
          window.clearTimeout(guard);
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);

    // ถ้า observer ไม่ทำงาน (แท็บถูกซ่อน/เบราว์เซอร์ระงับ) ให้คงค่าจริงไว้
    guard = window.setTimeout(() => {
      if (!started) setValue(to);
    }, 1200);

    return () => {
      io.disconnect();
      window.clearTimeout(guard);
      cancelAnimationFrame(frame);
    };
  }, [to, duration]);

  return (
    <span ref={ref}>
      {value.toLocaleString("th-TH")}
      {suffix}
    </span>
  );
}
