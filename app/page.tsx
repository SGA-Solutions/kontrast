import React from "react";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "sanity";
import { client, urlFor } from "../sanity/client";
import Image from "next/image";
import ImageGrid, { type ImageGridItem } from "../components/ImageGrid";
import Link from "next/link";
import { PROJECTS_QUERY, SITE_SETTINGS_QUERY, CACHE_TAGS } from "../lib/sanity-queries";
import ScrollIcon from "../components/ScrollIcon";

type ProjectDoc = {
  _id: string;
  title?: string;
  slug?: { current: string };
  coverImage?: any;
  gallery?: any[];
  featured?: boolean;
  sortOrder?: number;
  _createdAt?: string;
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

  // Helper function to check if project has videos in gallery
  const hasVideoInGallery = (project: ProjectDoc): boolean => {
    if (!project.gallery || project.gallery.length === 0) return false;
    
    return project.gallery.some((item: any) => {
      // Check for video MIME type
      if (item?.asset?.metadata?.mimeType?.startsWith('video/')) {
        return true;
      }
      
      // Fallback: check file extension
      if (item?.asset?.url) {
        const url = item.asset.url.toLowerCase();
        return url.includes('.mp4') || url.includes('.mov') || url.includes('.avi') || url.includes('.webm');
      }
      
      return false;
    });
  };

  // Prepare image items for the ImageGrid component
  const imageItems: ImageGridItem[] = projects.map((p, i) => ({
    key: p._id,
    src: p.coverImage ? urlFor(p.coverImage).width(1200).height(1200).format('webp').quality(85).fit("crop").url() : "",
    alt: p.title || `Projekt ${i + 1}`,
    href: p.slug?.current ? `/projekt/${p.slug.current}` : undefined,
    hasVideo: hasVideoInGallery(p),
  }));

  return (
    <section className="px-4 sm:px-0 mobile-vh-fit">
      {/* Wordmark and subtext */}
      <div className="flex flex-col sm:flex-row items-start mobile-compact sm:mb-4">
        {/* Wordmark: full text on mobile, image on ≥sm to pair with sidebar 'K' */}
        <div className="select-none whitespace-nowrap ml-0 sm:-ml-8 lg:-ml-12">
          <div className="leading-none">
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
        <div className="hidden sm:inline text-left text-fluid-xs tracking-[0.35em] space-y-1">
          <Link href="/tjanster/arkitektur" className="block hover:text-neutral-600 transition-colors touch-manipulation">
            ARKITEKTUR
          </Link>
          <Link href="/tjanster/digitalisering" className="block hover:text-neutral-600 transition-colors touch-manipulation">
            DIGITALISERING
          </Link>
          <Link href="/tjanster/projekteringsledning" className="block hover:text-neutral-600 transition-colors touch-manipulation">
            PROJEKTLEDNING
          </Link>
        </div>
      </div>

      <div className="ml-0 sm:ml-10 grid gap-6 sm:gap-8 lg:grid-cols-[15%_85%] mt-6">
        {/* Intro text (left column) */}
        <div className="text-fluid-sm space-fluid-2 max-w-none lg:max-w-55">
          {introBlocks && introBlocks.length > 0 && (
            <div className="prose prose-sm prose-neutral max-w-none text-justify mobile-fit-text leading-fluid-normal">
              <PortableText value={introBlocks} />
            </div>
          )}
        </div>

        {/* Image grid (right column): 2 rows, horizontal scroll */}
        <div className="w-full overflow-hidden">
          <ImageGrid items={imageItems} visibleColumns={4.8} />
        </div>
      </div>
      <ScrollIcon />
    </section>
  );
}