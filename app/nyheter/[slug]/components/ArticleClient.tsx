"use client";

import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { urlFor } from "../../../../sanity/client";
import { useCrossBrowserScroll } from "../../../../hooks/useCrossBrowserScroll";
import { useMobile } from "../../../../contexts/MobileContext";
import ScrollIcon from "../../../../components/ScrollIcon";

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  body?: any[];
  mainImage?: any;
  publishedAt: string;
  author?: string;
  tags?: string[];
};

interface ArticleClientProps {
  post: Post;
}

export default function ArticleClient({ post }: ArticleClientProps) {
  const { ref: scrollRef } = useCrossBrowserScroll({ 
    direction: 'horizontal',
    sensitivity: 5,
    smoothness: 0.15
  });

  // Use the mobile context
  const { isMobile } = useMobile();

  return (
    <section className={`${
      isMobile ? 'px-4 mt-4' : 'pl-10 mt-14'
    }`}>
      {/* Article title */}
      <h1 className={`font-light tracking-[0.1em] text-neutral-900 mb-3 ${
        isMobile ? 'text-base' : 'text-sm'
      }`}>
        {post.title}
      </h1>

      {isMobile ? (
        /* Mobile: Vertical scrolling layout */
        <div className="space-y-6">
          {/* Article metadata - mobile */}
          <div className="text-xs text-neutral-500 tracking-[0.2em] space-y-1">
            {post.publishedAt && (
              <div>
                {new Date(post.publishedAt).toLocaleDateString('sv-SE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            )}
            {post.author && (
              <div>
                {post.author}
              </div>
            )}
          </div>

          {/* Image section - mobile */}
          {post.mainImage && (
            <div className="w-full aspect-[4/3] relative">
              <Image
                src={urlFor(post.mainImage).width(600).format('webp').quality(85).url()}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              />
            </div>
          )}

          {/* Body text - mobile single column */}
          {post.body && (
            <div className="prose prose-neutral prose-headings:font-light prose-headings:tracking-wide prose-p:leading-relaxed prose-p:text-neutral-700 max-w-none">
              <PortableText 
                value={post.body}
                components={{
                  block: {
                    normal: ({children}) => <p className="mb-4 leading-relaxed text-neutral-700 text-sm">{children}</p>,
                    h2: ({children}) => <h2 className="text-lg font-light tracking-wide mt-6 mb-3 text-neutral-900">{children}</h2>,
                    h3: ({children}) => <h3 className="text-base font-light tracking-wide mt-4 mb-2 text-neutral-900">{children}</h3>,
                  },
                  marks: {
                    strong: ({children}) => <strong className="font-semibold text-neutral-900">{children}</strong>,
                    em: ({children}) => <em className="italic">{children}</em>,
                  },
                }}
              />
            </div>
          )}
        </div>
      ) : (
        /* Desktop: Horizontal scrolling layout */
        <div 
          ref={scrollRef}
          className="flex gap-8 w-[100vw] h-[65vh] overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing"
        >
          {/* Image section */}
          {post.mainImage && (
            <div className="flex-shrink-0 h-full">
              <Image
                src={urlFor(post.mainImage).width(520).format('webp').quality(85).url()}
                alt={post.title}
                width={520}
                height={480}
                className="w-full h-full object-cover"
                priority
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              />
            </div>
          )}

          {/* Body text - flows into multiple columns */}
          {post.body && (
            <div 
              className="prose prose-neutral prose-headings:font-light prose-headings:tracking-wide prose-p:leading-relaxed prose-p:text-neutral-700 h-full overflow-y-hidden flex-shrink-0"
              style={{ 
                columns: 'auto', 
                columnWidth: '400px', 
                columnGap: '32px', 
                columnFill: 'auto',
                minWidth: '1200px' // Ensure content is wider than viewport
              }}
            >
              {/* Article metadata */}
              <div className="mb-6 text-xs text-neutral-500 tracking-[0.2em] space-y-1">
                {post.publishedAt && (
                  <div>
                    {new Date(post.publishedAt).toLocaleDateString('sv-SE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                )}
                {post.author && (
                  <div>
                    {post.author}
                  </div>
                )}
              </div>
              <PortableText 
                value={post.body}
                components={{
                  block: {
                    normal: ({children}) => <p className="mb- leading-relaxed text-neutral-700 text-sm text-justify">{children}</p>,
                    h2: ({children}) => <h2 className="text-lg font-light tracking-wide mt-6 mb-3 text-neutral-900">{children}</h2>,
                    h3: ({children}) => <h3 className="text-base font-light tracking-wide mt-4 mb-2 text-neutral-900">{children}</h3>,
                  },
                  marks: {
                    strong: ({children}) => <strong className="font-semibold text-neutral-900">{children}</strong>,
                    em: ({children}) => <em className="italic">{children}</em>,
                  },
                }}
              />
            </div>
          )}
        </div>
      )}
      {!isMobile && <ScrollIcon />}
    </section>
  );
}
