"use client";

import Link from "next/link";
import Image from "next/image";
import { urlFor } from "../../../sanity/client";
import { useCrossBrowserScroll } from "../../../hooks/useCrossBrowserScroll";

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
  const { ref: scrollRef, onWheel } = useCrossBrowserScroll({ 
    direction: 'horizontal',
    sensitivity: 5,
    smoothness: 0.15
  });

  return (
    <section className="pl-10 mt-13 space-y-6">
      {/* Page title */}
      <span className="text-sm font-light tracking-[0.45em] text-neutral-900">NYHETER</span>
      
      {/* News horizontal scroll with peek */}
      <div>
        <div 
          ref={scrollRef}
          onWheel={onWheel}
          className="flex gap-8 pb-4 mt-3 overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing"
        >
          {posts.map((post, index) => (
            <Link
              key={post._id}
              href={`/nyheter/${post.slug.current}`}
              className="group flex-none space-y-3 hover:opacity-80 transition-opacity w-130"
            >              
              {/* Article image */}
              <div className="relative aspect-[4/1.8] bg-gray-100">
                {post.mainImage ? (
                  <Image
                    src={urlFor(post.mainImage).width(520).height(234).format('webp').quality(85).url()}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
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
      </div>
      
      {/* No posts message */}
      {posts.length === 0 && (
        <div className="flex items-center justify-center min-h-[200px] text-neutral-500">
          Inga nyheter publicerade än.
        </div>
      )}
    </section>
  );
}
