"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "sanity";
import { client, urlFor } from "../sanity/client";
import { groq } from "next-sanity";

type ProjectDoc = {
  _id: string;
  title?: string;
  coverImage?: any;
};

export default function Home() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const fromRef = useRef<number>(0);
  const toRef = useRef<number>(0);
  const durationRef = useRef<number>(400);

  // CMS state
  const [introBlocks, setIntroBlocks] = useState<PortableTextBlock[] | null>(null);
  const [projects, setProjects] = useState<ProjectDoc[] | null>(null);

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

  // Fetch content from Sanity (client-side read with CDN)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const settings = await client.fetch<{ description?: PortableTextBlock[] }>(
          groq`*[_type == "siteSettings"][0]{ description }`
        );
        if (mounted) {
          setIntroBlocks(settings?.description && Array.isArray(settings.description) ? settings.description : null);
        }

        const projDocs = await client.fetch<ProjectDoc[]>(
          groq`*[_type == "project" && defined(coverImage)]|order(featured desc, _createdAt desc)[0...30]{ _id, title, coverImage }`
        );
        if (mounted) setProjects(projDocs || []);
      } catch (err) {
        console.warn("[Home] Failed to load CMS content", err);
      }
    })();
    return () => {
      mounted = false;
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
        <div className="text-xs leading-relaxed space-y-4 max-w-[60ch]">
          {introBlocks && introBlocks.length > 0 ? (
            <div className="prose prose-invert max-w-none">
              <PortableText value={introBlocks} />
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Image grid (right column): 2 rows, horizontal scroll */}
        <div
          ref={scrollerRef}
          onWheel={onWheel}
          className="relative overflow-x-auto pb-2 hide-scrollbar"
        >
          <div className="grid grid-rows-2 grid-flow-col auto-cols-[var(--col)] gap-6 min-h-[0]">
            {(projects && projects.length > 0
              ? projects.map((p, i) => ({
                  key: p._id,
                  src: p.coverImage ? urlFor(p.coverImage).width(1200).height(1200).fit("crop").url() : "",
                  alt: p.title || `Projekt ${i + 1}`,
                }))
              : [
                  "https://staging.sga-kontrast.se/wp-content/uploads/2024/10/Vattentornet-01-Thumbnail-1.png",
                  "https://staging.sga-kontrast.se/wp-content/uploads/2024/10/Surekat-02-Thumbnailq.jpg",
                  "https://staging.sga-kontrast.se/wp-content/uploads/2024/10/Radiohuset-01-Thumbnail-1.png",
                  "https://staging.sga-kontrast.se/wp-content/uploads/2024/10/New-Project-2.png",
                  "https://staging.sga-kontrast.se/wp-content/uploads/2024/10/Nalen-01.jpg",
                  "https://staging.sga-kontrast.se/wp-content/uploads/2024/10/Origo-01-1.png",
                  "https://staging.sga-kontrast.se/wp-content/uploads/2024/10/Nahal-01-Thumbnail-1.png",
                  "https://staging.sga-kontrast.se/wp-content/uploads/2024/10/Infinity-Wall-05-Thumbnail-1.png",
                  "https://staging.sga-kontrast.se/wp-content/uploads/2024/10/Lunds-Stadshall-01-Thumbnail.png",
                  "https://staging.sga-kontrast.se/wp-content/uploads/2024/10/Halvarsson-Halvarsson-02-Thumbnail-2.png",
                  "https://staging.sga-kontrast.se/wp-content/uploads/2024/10/Lidingo-stadshus-Thumbnail.png",
                  "https://staging.sga-kontrast.se/wp-content/uploads/2024/10/Folkungakyrkan-01.jpg",
                  "https://staging.sga-kontrast.se/wp-content/uploads/2024/10/Cafe-Goteborg-01-Thumbnail.jpg",
                  "https://staging.sga-kontrast.se/wp-content/uploads/2024/10/Vattentornet-01-Thumbnail-1.png",
                  "https://staging.sga-kontrast.se/wp-content/uploads/2024/10/Surekat-02-Thumbnailq.jpg",
                  "https://staging.sga-kontrast.se/wp-content/uploads/2024/10/Radiohuset-01-Thumbnail-1.png",
                  "https://staging.sga-kontrast.se/wp-content/uploads/2024/10/New-Project-2.png",
                  "https://staging.sga-kontrast.se/wp-content/uploads/2024/10/Nalen-01.jpg",
                  "https://staging.sga-kontrast.se/wp-content/uploads/2024/10/Origo-01-1.png",
                  "https://staging.sga-kontrast.se/wp-content/uploads/2024/10/Nahal-01-Thumbnail-1.png",
                  "https://staging.sga-kontrast.se/wp-content/uploads/2024/10/Infinity-Wall-05-Thumbnail-1.png",
                  "https://staging.sga-kontrast.se/wp-content/uploads/2024/10/Lunds-Stadshall-01-Thumbnail.png",
                  "https://staging.sga-kontrast.se/wp-content/uploads/2024/10/Halvarsson-Halvarsson-02-Thumbnail-2.png",
                  "https://staging.sga-kontrast.se/wp-content/uploads/2024/10/Lidingo-stadshus-Thumbnail.png",
                  "https://staging.sga-kontrast.se/wp-content/uploads/2024/10/Folkungakyrkan-01.jpg",
                  "https://staging.sga-kontrast.se/wp-content/uploads/2024/10/Cafe-Goteborg-01-Thumbnail.jpg",
                ].map((src, i) => ({ key: `fallback-${i}`, src, alt: `Projekt ${i + 1}` }))
            ).map((item, i) => (
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
      </div>
    </section>
  );
}