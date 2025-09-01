"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "sanity";
import { client, urlFor } from "../sanity/client";
import { groq } from "next-sanity";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ImageGrid, { type ImageGridItem } from "../components/ImageGrid";
import Link from "next/link";

type ProjectDoc = {
  _id: string;
  title?: string;
  slug?: { current: string };
  coverImage?: any;
};

export default function Home() {
  // CMS state
  const [introBlocks, setIntroBlocks] = useState<PortableTextBlock[] | null>(null);
  const [projects, setProjects] = useState<ProjectDoc[] | null>(null);
  const router = useRouter();


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
          groq`*[_type == "project" && defined(coverImage)]|order(featured desc, _createdAt desc)[0...30]{ _id, title, slug, coverImage }`
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

  // Prevent browser swipe navigation
  useEffect(() => {
    const preventSwipeNavigation = (e: TouchEvent) => {
      // Prevent horizontal swipe gestures from triggering browser navigation
      if (e.touches.length === 1) {
        e.preventDefault();
      }
    };

    const preventOverscroll = (e: Event) => {
      e.preventDefault();
    };

    // Add touch event listeners to prevent swipe navigation
    document.addEventListener('touchstart', preventSwipeNavigation, { passive: false });
    document.addEventListener('touchmove', preventSwipeNavigation, { passive: false });
    document.addEventListener('overscroll', preventOverscroll, { passive: false });

    return () => {
      document.removeEventListener('touchstart', preventSwipeNavigation);
      document.removeEventListener('touchmove', preventSwipeNavigation);
      document.removeEventListener('overscroll', preventOverscroll);
    };
  }, []);

  // Memoize image items to avoid recreating on every render
  const imageItems: ImageGridItem[] = useMemo(() => {
    if (projects && projects.length > 0) {
      return projects.map((p, i) => ({
        key: p._id,
        src: p.coverImage ? urlFor(p.coverImage).width(1200).height(1200).fit("crop").url() : "",
        alt: p.title || `Projekt ${i + 1}`,
        onClick: () => {
          if (p.slug?.current) {
            router.push(`/projekt/${p.slug.current}`);
          }
        },
      }));
    }
    
    // Return empty array if no projects
    return [];
  }, [projects, router]);

  return (
    <section >
      {/* Wordmark and subtext (align with sidebar 'K') */}
      {/*<div className="px-4 sm:px-8 lg:px-12 py-6 sm:py-8 flex flex-col">*/}
      <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-6">
        {/* Wordmark: full text on mobile, image on ≥sm to pair with sidebar 'K' */}
        <div className="select-none whitespace-nowrap ml-0 sm:-ml-8 lg:-ml-12">
          <div className="leading-none">
            <span className="sm:hidden text-5xl sm:text-6xl md:text-7xl font-light tracking-[0.45em]">KONTRAST</span>
            <span className="hidden sm:inline">
              <Image
                src="/Kontrast-logo-2.png"
                alt="Kontrast wordmark"
                width={700}
                height={120}
                priority
                className="ml-10 sm:h-16 md:h-15 w-auto object-contain"
              />
            </span>
          </div>
        </div>
        {/* Subtext */}
        <div className="text-left text-[10px] sm:text-xs tracking-[0.35em] leading-5">
          <Link href="/tjanster/arkitektur">ARKITEKTUR</Link>
          <br />
          <Link href="/tjanster/digitalisering">DIGITALISERING</Link>
          <br />
          <Link href="/tjanster/projekteringsledning">PROJEKTLEDNING</Link>
        </div>
      </div>

      <div className="ml-10 mt-6 grid gap-4 sm:gap-8 lg:grid-cols-[15%_85%]">
        {/* Intro text (left column) */}
        <div className="text-sm leading-relaxed space-y-4 w-55">
          {introBlocks && introBlocks.length > 0 && (
            <div className="prose prose-invert text-justify">
              <PortableText value={introBlocks} />
            </div>
          )}
        </div>

        {/* Image grid (right column): 2 rows, horizontal scroll */}
        <ImageGrid items={imageItems} />
      </div>
    </section>
  );
}