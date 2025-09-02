import React from "react";
import { client, urlFor } from "../../../sanity/client";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { POST_BY_SLUG_QUERY, POST_SLUGS_QUERY, CACHE_TAGS } from "../../../lib/sanity-queries";

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

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Generate static params for all posts
export async function generateStaticParams() {
  const posts = await client.fetch<{slug: {current: string}}[]>(POST_SLUGS_QUERY);
  
  return posts.map((post) => ({
    slug: post.slug.current,
  }));
}

// Server-side data fetching with optimized caching
async function getPost(slug: string): Promise<Post | null> {
  try {
    const post = await client.fetch<Post>(
      POST_BY_SLUG_QUERY,
      { slug },
      {
        cache: 'force-cache',
        next: { 
          revalidate: 3600, // Revalidate every hour
          tags: [CACHE_TAGS.post, `post-${slug}`]
        }
      }
    );
    return post;
  } catch (err) {
    console.warn("[ArticlePage] Failed to load post", err);
    return null;
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  
  if (!post) {
    notFound();
  }

  return (
    <section className="pl-10 mt-14">
      {/* Navigation */}
      {/*}
      <button
        onClick={() => router.push('/nyheter')}
        className="text-xs text-neutral-500 hover:text-neutral-900 tracking-[0.3em] transition-colors"
      >
        ← NYHETER
      </button>
      */}
      {/* Article title */}
      <h1 className="text-sm font-light tracking-[0.1em] text-neutral-900 mb-3">
          {post.title}
      </h1>

      {/* Main content - scrollable layout */}
        <div className="flex gap-8 h-130">
          {/* Body text - flows into multiple columns */}
          {post.body && (
            <div 
              className="hide-scrollbar prose prose-neutral prose-headings:font-light prose-headings:tracking-wide prose-p:leading-relaxed prose-p:text-neutral-700 h-full overflow-y-hidden"
              style={{ 
                columns: 'auto', 
                columnWidth: '400px', 
                columnGap: '32px', 
                columnFill: 'auto',
                minWidth: '1200px' // Ensure content is wider than viewport
              }}
            >
              <Image
                  src={urlFor(post.mainImage).width(500).height(500).format('webp').quality(85).url()}
                  alt={post.title}
                  width={500}
                  height={500}
                  className="h-130 object-top"
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              />
              {/* Article metadata */}
              <div className="mb-6 text-xs text-neutral-500 tracking-[0.2em] space-y-1">
                {post.publishedAt && (
                  <div>
                    PUBLICERAD: {new Date(post.publishedAt).toLocaleDateString('sv-SE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                )}
                {post.author && (
                  <div>
                    FÖRFATTARE: {post.author}
                  </div>
                )}
              </div>
              <PortableText 
                value={post.body}
                components={{
                  block: {
                    normal: ({children}) => <p className="mb-4 leading-relaxed text-neutral-700 text-sm break-inside-avoid text-justify">{children}</p>,
                    h2: ({children}) => <h2 className="text-lg font-light tracking-wide mt-6 mb-3 text-neutral-900 break-inside-avoid">{children}</h2>,
                    h3: ({children}) => <h3 className="text-base font-light tracking-wide mt-4 mb-2 text-neutral-900 break-inside-avoid">{children}</h3>,
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

      {/* Tags */}
      {/*
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-8 border-t border-neutral-200">
          <span className="text-xs text-neutral-500 tracking-[0.2em]">TAGGAR:</span>
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs text-neutral-600 bg-neutral-100 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      */}
    </section>
  );
}
