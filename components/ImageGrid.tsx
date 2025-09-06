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
  const { ref: hookScrollRef, onWheel: hookOnWheel } = useCrossBrowserScroll({
    direction: 'horizontal',
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
      const isSmall = width < 640; // ~sm breakpoint
      const gap = isSmall ? 16 : 24; // gap-4 vs gap-6
      const visibleColumnsValue = isSmall ? 2.2 : visibleColumns; // make tiles larger on phones
      const col = (width - gap * 3) / visibleColumnsValue; // 4 cols => 3 gaps between
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
      onWheel={hookOnWheel}
      className={`relative overflow-x-auto pb-2 hide-scrollbar no-overscroll touch-pan-x cursor-grab active:cursor-grabbing ${className}`}
    >
      <div className="grid grid-rows-2 grid-flow-col auto-cols-[var(--col)] gap-4">
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
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
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
                className="group relative aspect-square bg-neutral-100 overflow-hidden cursor-pointer block"
              >
                {content}
              </Link>
            );
          }

          return (
            <div
              key={item.key ?? i}
              className="group relative aspect-square bg-neutral-100 overflow-hidden cursor-pointer"
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
