"use client";

import React, { useEffect, useState, useRef } from "react";
import { client, urlFor } from "../../../sanity/client";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import Link from "next/link";

type ProjectCategory = {
  _id: string;
  title: string;
  slug: { current: string };
};

type ProjectDoc = {
  _id: string;
  title?: string;
  slug: { current: string };
  assignment?: string;
  categories?: ProjectCategory[];
  location?: string;
  client?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  body?: any[];
  coverImage?: any;
  gallery?: any[];
};

interface ProjectPageProps {
  params: { slug: string };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const [project, setProject] = useState<ProjectDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const fromRef = useRef<number>(0);
  const toRef = useRef<number>(0);
  const durationRef = useRef<number>(400);

  // Horizontal scroll animation functions
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  const animate = () => {
    const el = scrollerRef.current;
    if (!el) return;

    const now = performance.now();
    const start = startTimeRef.current;
    const from = fromRef.current;
    const dur = Math.max(120, durationRef.current);

    const latestTarget = targetRef.current;
    const to = latestTarget;
    toRef.current = to;

    const t = Math.min(1, (now - start) / dur);
    const eased = easeOutCubic(t);
    const pos = from + (to - from) * eased;
    el.scrollLeft = pos;

    if (t >= 1) {
      el.scrollLeft = to;
      rafRef.current = null;
      return;
    }
    rafRef.current = requestAnimationFrame(animate);
  };

  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();

    const el = e.currentTarget;
    
    // Direct scroll approach for immediate response
    const scrollAmount = e.deltaY;
    const currentScroll = el.scrollLeft;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const newScroll = Math.max(0, Math.min(maxScroll, currentScroll + scrollAmount));
    
    el.scrollLeft = newScroll;
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    
    (async () => {
      try {
        setLoading(true);
        
        const projectDoc = await client.fetch<ProjectDoc>(
          groq`*[_type == "project" && slug.current == $slug][0]{
            _id,
            title,
            slug,
            assignment,
            categories[]->{_id, title, slug},
            location,
            client,
            status,
            startDate,
            endDate,
            summary,
            body,
            coverImage,
            gallery
          }`,
          { slug: params.slug }
        );
        
        if (mounted) {
          if (!projectDoc) {
            notFound();
          }
          setProject(projectDoc);
          setLoading(false);
        }
      } catch (err) {
        console.warn("[ProjectPage] Failed to load project", err);
        if (mounted) {
          setLoading(false);
        }
      }
    })();
    
    return () => {
      mounted = false;
    };
  }, [params.slug]);

  if (loading) {
    return (
      <section className="flex items-center justify-center min-h-[400px]">
        <div className="text-neutral-600">Laddar projekt...</div>
      </section>
    );
  }

  if (!project) {
    notFound();
  }

  // Prepare all images for horizontal layout
  const allImages = [];
  if (project.coverImage) {
    allImages.push({
      src: urlFor(project.coverImage).width(1200).height(800).fit("crop").url(),
      alt: project.title || "Project image",
      isCover: true
    });
  }
  if (project.gallery) {
    project.gallery.forEach((image: any, index: number) => {
      if (image._type === 'image') {
        allImages.push({
          src: urlFor(image).width(800).height(800).fit("crop").url(),
          alt: `${project.title} gallery image ${index + 1}`,
          isCover: false
        });
      }
    });
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Header with navigation */}
      {/*}
      <div className="flex items-center justify-between p-6 border-b border-neutral-200 relative z-10">
        <div className="flex items-center space-x-8">
          <Link href="/projekt" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
            ← TILLBAKA
          </Link>
          <div className="text-sm text-neutral-400">
            PROJEKT
          </div>
        </div>
        <div className="text-sm text-neutral-400">
          {project.categories?.map(cat => cat.title).join(", ") || ""}
        </div>
      </div>
      */}
      {/* Horizontal scrolling container */}
      <div className="h-17"></div>
      <div 
        ref={scrollerRef}
        onWheel={onWheel}
        className="flex h-[calc(100vh-80px)] overflow-x-scroll overflow-y-hidden hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Project info section */}
        <div className="flex-shrink-0 w-[500px] pr-8 flex flex-col justify-start pt-1">
          <div className="space-y-2">
            {/* Project title */}
            <div>
              <h2 className="text-xl font-normal text-neutral-900 tracking-wide">
                {project.title}
              </h2>
            </div>

            {/* Project details in two-column layout */}
            <div className="space-y-2">
              {project.assignment && (
                <div className="grid grid-cols-2 gap-8">
                  <span className="text-xs uppercase tracking-wider text-neutral-500">UPPDRAG</span>
                  <span className="text-xs uppercase tracking-wider text-neutral-700">{project.assignment}</span>
                </div>
              )}

              {project.categories && project.categories.length > 0 && (
                <div className="grid grid-cols-2 gap-8">
                  <span className="text-xs uppercase tracking-wider text-neutral-500">KATEGORI</span>
                  <span className="text-xs uppercase tracking-wider text-neutral-700">
                    {project.categories.map(cat => cat.title).join(", ")}
                  </span>
                </div>
              )}

              {project.location && (
                <div className="grid grid-cols-2 gap-8">
                  <span className="text-xs uppercase tracking-wider text-neutral-500">PLATS</span>
                  <span className="text-xs uppercase tracking-wider text-neutral-700">{project.location}</span>
                </div>
              )}

              {project.client && (
                <div className="grid grid-cols-2 gap-8">
                  <span className="text-xs uppercase tracking-wider text-neutral-500">BESTÄLLARE</span>
                  <span className="text-xs uppercase tracking-wider text-neutral-700">{project.client}</span>
                </div>
              )}

              {project.status && (
                <div className="grid grid-cols-2 gap-8">
                  <span className="text-xs uppercase tracking-wider text-neutral-500">STATUS</span>
                  <span className="text-xs uppercase tracking-wider text-neutral-700">{project.status}</span>
                </div>
              )}

              {(project.startDate || project.endDate) && (
                <div className="grid grid-cols-2 gap-8">
                  <span className="text-xs uppercase tracking-wider text-neutral-500">STATUS</span>
                  <span className="text-xs uppercase tracking-wider text-neutral-700">
                    FÄRDIGSTÄLLD, {project.startDate && new Date(project.startDate).getFullYear()}
                    {project.endDate && project.startDate !== project.endDate && 
                      ` - ${new Date(project.endDate).getFullYear()}`
                    }
                  </span>
                </div>
              )}
            </div>

            {/* Project description */}
            {project.summary && (
              <div className="pt-4">
                <p className="text-sm text-neutral-700 leading-relaxed">
                  {project.summary}
                </p>
              </div>
            )}

            {/* Body content if available */}
            {project.body && project.body.length > 0 && (
              <div className="space-y-3">
                {project.body.map((block: any, index: number) => {
                  if (block._type === 'block') {
                    return (
                      <p key={index} className="text-sm text-neutral-700 leading-relaxed">
                        {block.children?.map((child: any) => child.text).join('')}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </div>
        </div>

        {/* Images section with peek effect */}
        {allImages.map((image, index) => (
          <div 
            key={index} 
            className={`flex-shrink-0 relative w-[calc(100vw-750px-2rem)] h-120 pt-8`}
            style={{
              marginRight: index < allImages.length - 1 ? '2rem' : '0'
            }}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            
            {/* Gradient overlay for peek effect on non-last images */}
            {index < allImages.length - 1 && (
              <div className="absolute top-0 right-0 w-32 h-full  to-transparent pointer-events-none" />
            )}
          </div>
        ))}
        
        {/* Extra spacing at the end */}
        <div className="flex-shrink-0 w-8" />
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
