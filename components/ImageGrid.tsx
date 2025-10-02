"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import CrossBrowserImage from "./CrossBrowserImage";
import { useCrossBrowserScroll } from "../hooks/useCrossBrowserScroll";

export type ImageGridItem = {
  key?: string;
  src: string;
  alt: string;
  onClick?: () => void;
  href?: string;
  hasVideo?: boolean;
};

interface ImageGridProps {
  items: ImageGridItem[];
  className?: string;
  visibleColumns?: number;
}

export default function ImageGrid({ items, className = "", visibleColumns = 4.8 }: ImageGridProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const { ref: hookScrollRef } = useCrossBrowserScroll({
    direction: 'responsive',
    sensitivity: 8,
    smoothness: 0.10
  });

  // Sync refs - use the hook's ref but keep our own for ResizeObserver
  useEffect(() => {
    if (hookScrollRef.current && scrollerRef.current !== hookScrollRef.current) {
      scrollerRef.current = hookScrollRef.current;
    }
  });

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    // Base gap matches gap utilities below (gap-4 on mobile, gap-6 on ≥sm)
    const compute = () => {
      const width = el.clientWidth;
      const col = (width - 24 * 3) / visibleColumns; // 4 cols => 3 gaps between
      el.style.setProperty("--col", `${col}px`);
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [visibleColumns]);

  // Use the hook's wheel handler for consistent cross-browser scrolling

  return (
    <div
      ref={hookScrollRef}
      className={`relative pb-2 hide-scrollbar no-overscroll cursor-grab active:cursor-grabbing
        /* Desktop: horizontal scroll */
        md:overflow-x-auto md:touch-pan-x
        /* Mobile: vertical scroll */
        max-md:overflow-y-auto max-md:touch-pan-y max-md:max-h-screen
        ${className}`}
    >
      <div className="
        /* Desktop: 2-row horizontal grid */
        sm:grid sm:grid-rows-2 sm:grid-flow-col sm:auto-cols-[var(--col)] sm:gap-4
        /* Mobile: single column vertical grid */
        max-md:flex max-md:flex-col max-md:gap-4
      ">
        {items.map((item, i) => {
          const content = (
            <>
              {/* Image */}
              <CrossBrowserImage
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-opacity duration-300 ease-out group-hover:opacity-50"
                priority={i < 4}
                sizes="(max-width: 640px) 50vw, 25vw"
              />

              {/* Dark overlay */}
              <div
                className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300 ease-out"
                aria-hidden="true"
              />

              {/* Play button overlay for videos */}
              {item.hasVideo && (
                <div className="absolute bottom-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out">
                  <div className="w-6 h-6 border-3 border-white rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white " fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              )}

              {/* Overlay title */}
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                <span
                  className="px-3 py-1 text-white tracking-widest text-sm sm:text-base font-medium uppercase opacity-0 -translate-x-10 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0 drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]"
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                >
                  {item.alt?.toUpperCase() || `PROJEKT ${i + 1}`}
                </span>
              </div>
            </>
          );

          if (item.href) {
            return (
              <Link
                key={item.key ?? i}
                href={item.href}
                className="group relative aspect-square bg-neutral-100 overflow-hidden cursor-pointer block
                  /* Mobile: full width */
                  max-md:w-full max-md:aspect-[4/3]"
              >
                {content}
              </Link>
            );
          }

          return (
            <div
              key={item.key ?? i}
              className="group relative aspect-square bg-neutral-100 overflow-hidden cursor-pointer
                /* Mobile: full width */
                max-md:w-full max-md:aspect-[4/3]"
              onClick={item.onClick}
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
