import React from "react";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "sanity";
import { client, urlFor } from "../sanity/client";
import Image from "next/image";
import ImageGrid, { type ImageGridItem } from "../components/ImageGrid";
import Link from "next/link";
import { PROJECTS_QUERY, SITE_SETTINGS_QUERY, CACHE_TAGS } from "../lib/sanity-queries";

type ProjectDoc = {
  _id: string;
  title?: string;
  slug?: { current: string };
  coverImage?: any;
};

// Server-side data fetching
async function getHomeData() {
  try {
    const [settings, projects] = await Promise.all([
      client.fetch<{ description?: PortableTextBlock[] }>(
        SITE_SETTINGS_QUERY,
        {},
        {
          cache: 'force-cache',
          next: { 
            revalidate: 3600, // 1 hour
            tags: [CACHE_TAGS.settings]
          }
        }
      ),
      client.fetch<ProjectDoc[]>(
        PROJECTS_QUERY,
        {},
        {
          cache: 'force-cache',
          next: { 
            revalidate: 600, // 10 minutes
            tags: [CACHE_TAGS.projects]
          }
        }
      )
    ]);
    
    return {
      introBlocks: settings?.description && Array.isArray(settings.description) ? settings.description : null,
      projects: projects || []
    };
  } catch (err) {
    console.warn("[Home] Failed to load CMS content", err);
    return {
      introBlocks: null,
      projects: []
    };
  }
}

export default async function Home() {
  const { introBlocks, projects } = await getHomeData();

  // Prepare image items for the ImageGrid component
  const imageItems: ImageGridItem[] = projects.map((p, i) => ({
    key: p._id,
    src: p.coverImage ? urlFor(p.coverImage).width(1200).height(1200).format('webp').quality(85).fit("crop").url() : "",
    alt: p.title || `Projekt ${i + 1}`,
    href: p.slug?.current ? `/projekt/${p.slug.current}` : undefined,
  }));

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
                sizes="(max-width: 768px) 100vw, 700px"
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
        <div className="text-sm  space-y-4 w-55">
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