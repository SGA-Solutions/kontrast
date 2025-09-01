"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "sanity";
import { client, urlFor } from "../sanity/client";
import { groq } from "next-sanity";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ImageGrid, { type ImageGridItem } from "../components/ImageGrid";

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
    
    // Fallback images
    return [
      "https://cdn.sanity.io/images/20rfbnpw/production/d80b61c2dc0f0a1b1524a3f22d0dda41698c132f-600x600.png",
      "https://cdn.sanity.io/images/20rfbnpw/production/9ecb332317c5e2ee5e4e98c783db487856cd0b4c-600x600.jpg",
      "https://cdn.sanity.io/images/20rfbnpw/production/5f3f14ff88b5fc2944ae85e9b13ab3146092bb13-600x600.png",
      "https://cdn.sanity.io/images/20rfbnpw/production/4ac675916c50552bae5d974c58c6dde0659b694d-600x600.png",
      "https://cdn.sanity.io/images/20rfbnpw/production/c468d0464587a8e16f3335701b81209a2b2e97c3-600x600.jpg",
      "https://cdn.sanity.io/images/20rfbnpw/production/4e244d79554680b0999d9cc048eac0ef77c6b91f-600x600.png",
      "https://cdn.sanity.io/images/20rfbnpw/production/cbb5bd7c28866b706b519f87793f9a840f12a25a-600x600.png",
      "https://cdn.sanity.io/images/20rfbnpw/production/eef64a2a1b8f13b1b69d0af243b2ccb7b058d80e-600x600.png",
      "https://cdn.sanity.io/images/20rfbnpw/production/b684c0d32955d2c2da076991aeb11fc151b51eb5-600x600.png",
      "https://cdn.sanity.io/images/20rfbnpw/production/b348176da9412e9f63a7a77007349b453ceeac8d-600x600.png",
      "https://cdn.sanity.io/images/20rfbnpw/production/f7b4a36f69dcee2e43c5079521e797e026f29ffe-600x600.png",
      "https://cdn.sanity.io/images/20rfbnpw/production/6d5fde2384317c88e12f9c08c63ddf4d67b395dd-600x600.jpg",
      "https://cdn.sanity.io/images/20rfbnpw/production/f35272ffc7fcd869807d159d613ddf51ad330d3e-600x600.jpg",
      "https://cdn.sanity.io/images/20rfbnpw/production/d80b61c2dc0f0a1b1524a3f22d0dda41698c132f-600x600.png",
      "https://cdn.sanity.io/images/20rfbnpw/production/9ecb332317c5e2ee5e4e98c783db487856cd0b4c-600x600.jpg",
      "https://cdn.sanity.io/images/20rfbnpw/production/5f3f14ff88b5fc2944ae85e9b13ab3146092bb13-600x600.png",
      "https://cdn.sanity.io/images/20rfbnpw/production/4ac675916c50552bae5d974c58c6dde0659b694d-600x600.png",
      "https://cdn.sanity.io/images/20rfbnpw/production/c468d0464587a8e16f3335701b81209a2b2e97c3-600x600.jpg",
      "https://cdn.sanity.io/images/20rfbnpw/production/4e244d79554680b0999d9cc048eac0ef77c6b91f-600x600.png",
      "https://cdn.sanity.io/images/20rfbnpw/production/cbb5bd7c28866b706b519f87793f9a840f12a25a-600x600.png",
      "https://cdn.sanity.io/images/20rfbnpw/production/eef64a2a1b8f13b1b69d0af243b2ccb7b058d80e-600x600.png",
      "https://cdn.sanity.io/images/20rfbnpw/production/b684c0d32955d2c2da076991aeb11fc151b51eb5-600x600.png",
      "https://cdn.sanity.io/images/20rfbnpw/production/b348176da9412e9f63a7a77007349b453ceeac8d-600x600.png",
      "https://cdn.sanity.io/images/20rfbnpw/production/f7b4a36f69dcee2e43c5079521e797e026f29ffe-600x600.png",
      "https://cdn.sanity.io/images/20rfbnpw/production/6d5fde2384317c88e12f9c08c63ddf4d67b395dd-600x600.jpg",
      "https://cdn.sanity.io/images/20rfbnpw/production/f35272ffc7fcd869807d159d613ddf51ad330d3e-600x600.jpg",
    ].map((src, i) => ({ key: `fallback-${i}`, src, alt: `Projekt ${i + 1}` }));
  }, [projects, router]);

  return (
    <section className="space-y-6">
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
                className="h-14 ml-10 sm:h-16 md:h-20 w-auto object-contain"
              />
            </span>
          </div>
        </div>
        {/* Subtext */}
        <div className="text-left text-[10px] sm:text-xs tracking-[0.35em] leading-5">
          ARKITEKTUR
          <br />
          DIGITALISERING
          <br />
          PROJEKTLEDNING
        </div>
      </div>

      <div className="grid gap-4 sm:gap-8 lg:grid-cols-[20%_80%]">
        {/* Intro text (left column) */}
        <div className="text-xs leading-relaxed space-y-4 max-w-none sm:max-w-[60ch]">
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
        <ImageGrid items={imageItems} />
      </div>
    </section>
  );
}