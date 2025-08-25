"use client";

import React, { useEffect, useRef } from "react";

export type ImageGridItem = {
  key?: string;
  src: string;
  alt: string;
};

interface ImageGridProps {
  items: ImageGridItem[];
  className?: string;
}

export default function ImageGrid({ items, className = "" }: ImageGridProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const fromRef = useRef<number>(0);
  const toRef = useRef<number>(0);
  const durationRef = useRef<number>(400);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    // Base gap matches gap utilities below (gap-4 on mobile, gap-6 on ≥sm)
    const compute = () => {
      const width = el.clientWidth;
      const isSmall = width < 640; // ~sm breakpoint
      const gap = isSmall ? 16 : 24; // gap-4 vs gap-6
      const visibleColumns = isSmall ? 2.2 : 4.8; // make tiles larger on phones
      const col = (width - gap * 3) / visibleColumns; // 4 cols => 3 gaps between
      el.style.setProperty("--col", `${col}px`);
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Easing: easeOutCubic (starts fast, then decelerates)
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  const animate = () => {
    const el = scrollerRef.current;
    if (!el) return;

    const now = performance.now();
    const start = startTimeRef.current;
    const from = fromRef.current;
    const dur = Math.max(120, durationRef.current);

    // If targetRef has drifted (more wheel input), update the 'to' progressively
    const latestTarget = targetRef.current;
    const to = latestTarget;
    toRef.current = to;

    const t = Math.min(1, (now - start) / dur);
    const eased = easeOutCubic(t);
    const pos = from + (to - from) * eased;
    el.scrollLeft = pos;

    if (t >= 1) {
      // Snap to final
      el.scrollLeft = to;
      rafRef.current = null;
      return;
    }
    rafRef.current = requestAnimationFrame(animate);
  };

  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    if (e.deltaY === 0) return;
    e.preventDefault();

    const el = e.currentTarget;
    const now = performance.now();

    // If we're not animating, initialize target to current position.
    if (rafRef.current === null) {
      targetRef.current = el.scrollLeft;
    }

    // Update target with the new delta and clamp to bounds.
    const maxScroll = el.scrollWidth - el.clientWidth;
    const nextTarget = Math.max(0, Math.min(maxScroll, targetRef.current + e.deltaY));
    targetRef.current = nextTarget;

    // Start a new ease animation from the current position towards the updated target.
    fromRef.current = el.scrollLeft;
    toRef.current = nextTarget;
    startTimeRef.current = now;

    // Duration scaled by distance, clamped for consistency
    const distance = Math.abs(toRef.current - fromRef.current);
    durationRef.current = Math.min(1000, Math.max(250, 0.6 * distance * 2));

    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(animate);
    }
  };

  return (
    <div
      ref={scrollerRef}
      onWheel={onWheel}
      className={`relative overflow-x-auto pb-2 hide-scrollbar ${className}`}
    >
      <div className="grid grid-rows-2 grid-flow-col auto-cols-[var(--col)] gap-4 sm:gap-6 min-h-[0]">
        {items.map((item, i) => (
          <div
            key={item.key ?? i}
            className="group relative aspect-square bg-neutral-100 overflow-hidden"
          >
            {/* Image */}
            <img
              src={item.src}
              alt={item.alt}
              className="w-full h-full object-cover transition-opacity duration-300 ease-out group-hover:opacity-50"
              loading="lazy"
            />

            {/* Dark overlay */}
            <div
              className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300 ease-out"
              aria-hidden="true"
            />

            {/* Overlay title */}
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
              <span
                className="px-3 py-1 text-white tracking-widest text-sm sm:text-base font-medium uppercase opacity-0 -translate-x-10 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0 drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
              >
                {item.alt?.toUpperCase() || `PROJEKT ${i + 1}`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
