"use client";

import { useEffect, useRef } from "react";

export default function Home() {
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

    const ITEM_GAP = 24; // matches gap-6 between tiles
    const visibleColumns = 4.8; // 4 full + half for affordance

    const compute = () => {
      const width = el.clientWidth;
      const col = (width - ITEM_GAP * 3) / visibleColumns; // 4 cols => 3 gaps
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
    const baseTo = toRef.current;
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
    durationRef.current = Math.min(1000, Math.max(250, 0.6 * distance *2));

    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(animate);
    }
  };

  return (
    <section>
      <div className="grid gap-8 lg:grid-cols-[20%_80%]">
        {/* Intro text (left column) */}
        <div className="text-xs sm:text-[13px] leading-6 text-neutral-700">
          <p className="mb-4">
            Kontrast omdefinierar svensk arkitektur genom att förena estetik med
            den digitala byggprocessen. Vår grundidé är att skapa lösningar där
            byggnadens identitet formas i symbios med funktion, plats och
            människor.
          </p>
          <p>
            Vi erbjuder arkitektur, projektledning och digitalisering för
            fastighetsägare som vill skapa lönsamma, hållbara och tidsbeständiga
            miljöer.
          </p>
        </div>

        {/* Image grid (right column): 2 rows, horizontal scroll */}
        <div
          ref={scrollerRef}
          onWheel={onWheel}
          className="relative overflow-x-auto pb-2 hide-scrollbar"
        >
          <div className="grid grid-rows-2 grid-flow-col auto-cols-[var(--col)] gap-6 min-h-[0]">
            {[
              "https://images.unsplash.com/photo-1523419409543-8a5a5b14fd0a?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1487956382158-bb926046304a?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1536052371167-5e4f22cb9859?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1508541968004-b8df7d3be2f4?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1493282121944-bc2c0d0d02a5?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=1200&auto=format&fit=crop",
              // Additional images to extend scroll
              "https://images.unsplash.com/photo-1520975922215-cf1bd77f1b50?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1446054851785-66c4f9f4b774?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1467803738586-46b7eb7b16a1?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1482192505345-5655af888cc4?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1523419409543-8a5a5b14fd0a?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1508541968004-b8df7d3be2f4?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1493282121944-bc2c0d0d02a5?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1487956382158-bb926046304a?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1536052371167-5e4f22cb9859?q=80&w=1200&auto=format&fit=crop"
            ].map((src, i) => (
              <div
                key={i}
                className="group relative aspect-square bg-neutral-100 overflow-hidden"
              >
                {/* Image */}
                <img
                  src={src}
                  alt={`Projekt ${i + 1}`}
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
                    {`PROJEKT ${i + 1}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
