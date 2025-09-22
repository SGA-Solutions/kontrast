"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { urlFor } from "../../../sanity/client";
import { useCrossBrowserScroll } from "../../../hooks/useCrossBrowserScroll";
import ScrollIcon from "../../../components/ScrollIcon";

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: any;
  publishedAt: string;
  author?: string;
};

interface NewsListClientProps {
  posts: Post[];
}

export default function NewsListClient({ posts }: NewsListClientProps) {
  const { ref: scrollRef } = useCrossBrowserScroll({ 
    direction: 'responsive',
    sensitivity: 5,
    smoothness: 0.15
  });

  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className={`${
      isMobile ? 'px-4 mt-4' : 'pl-10 mt-13'
    }`}>
      {/* Page title */}
      <h2 className={`font-futura-medium text-neutral-900 uppercase tracking-wide mb-6 ${
        isMobile ? 'text-lg text-center' : 'text-xl'
      }`}>NYHETER</h2>
      
      {isMobile ? (
        /* Mobile: Vertical scrolling layout */
        <div className="space-y-6">
          {posts.map((post, index) => (
            <Link
              key={post._id}
              href={`/nyheter/${post.slug.current}`}
              className="group block hover:opacity-80 transition-opacity"
            >              
              {/* Article image */}
              <div className="relative aspect-[4/3] bg-gray-100 mb-4">
                {post.mainImage ? (
                  <Image
                    src={urlFor(post.mainImage).width(600).height(450).format('webp').quality(85).url()}
                    alt={post.title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority={index < 2}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                    <span className="text-neutral-400 text-sm">Ingen bild</span>
                  </div>
                )}
              </div>

              {/* Article title */}
              <h3 className="text-sm font-light tracking-[0.2em] text-neutral-900 group-hover:text-neutral-600 transition-colors mb-3">
                {post.title.toUpperCase()}
              </h3>
              
              {/* Article content */}
              {post.excerpt && (
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {/* Article metadata */}
              <div className="mt-3 text-xs text-neutral-400 tracking-wider">
                {new Date(post.publishedAt).toLocaleDateString('sv-SE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                {post.author && ` • ${post.author}`}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Desktop: Horizontal scrolling layout */
        <div 
          ref={scrollRef}
          className="pb-4 mt-2 hide-scrollbar cursor-grab active:cursor-grabbing
            md:flex md:gap-8 md:overflow-x-auto"
        >
          {posts.map((post, index) => (
            <Link
              key={post._id}
              href={`/nyheter/${post.slug.current}`}
              className="group space-y-3 hover:opacity-80 transition-opacity
                md:flex-none md:w-130"
            >              
              {/* Article image */}
              <div className="relative aspect-[4/1.8] bg-gray-100">
                {post.mainImage ? (
                  <Image
                    src={urlFor(post.mainImage).width(520).height(234).format('webp').quality(85).url()}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-top"
                    priority={index < 2}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                    <span className="text-neutral-400 text-sm">Ingen bild</span>
                  </div>
                )}
              </div>

              {/* Article title */}
              <h2 className="text-sm font-light tracking-[0.2em] text-neutral-900 group-hover:text-neutral-600 transition-colors">
                {post.title.toUpperCase()}
              </h2>
              
              {/* Article content */}
              <div className="space-y-2">
                {post.excerpt && (
                  <p className="text-sm text-neutral-600 text-justify">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {/* No posts message */}
      {posts.length === 0 && (
        <div className="flex items-center justify-center min-h-[200px] text-neutral-500">
          <p className={`text-center ${
            isMobile ? 'text-sm px-4' : 'text-base'
          }`}>
            Inga nyheter publicerade än.
          </p>
        </div>
      )}
      {!isMobile && <ScrollIcon />}
    </section>
  );
}
