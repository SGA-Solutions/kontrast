"use client";

import React, { useEffect, useState} from "react";
import { client, urlFor } from "../../../sanity/client";
import { groq } from "next-sanity";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { PortableText } from "@portabletext/react";

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

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  const slug = params?.slug as string;

  // Fetch individual post from Sanity
  useEffect(() => {
    if (!slug) return;
    
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        
        const postDoc = await client.fetch<Post>(
          groq`*[_type == "post" && slug.current == $slug][0]{
            _id,
            title,
            slug,
            excerpt,
            body,
            mainImage,
            publishedAt,
            author,
            tags
          }`,
          { slug }
        );
        
        if (mounted) {
          if (postDoc) {
            setPost(postDoc);
          } else {
            setNotFound(true);
          }
          setLoading(false);
        }
      } catch (err) {
        console.warn("[ArticlePage] Failed to load post", err);
        if (mounted) {
          setNotFound(true);
          setLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [slug]);
  
  if (loading) {
    return (
      <section className="flex items-center justify-center min-h-[400px]">
        <div className="text-neutral-600">Laddar artikel...</div>
      </section>
    );
  }

  if (notFound || !post) {
    return (
      <section className="space-y-6">
        <div className="min-h-12"></div>
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-light">Artikeln hittades inte</h1>
          <button
            onClick={() => router.push('/nyheter')}
            className="text-sm text-neutral-600 hover:text-neutral-900 underline"
          >
            ← Tillbaka till nyheter
          </button>
        </div>
      </section>
    );
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
                  src={urlFor(post.mainImage).url()}
                  alt={post.title}
                  width={500}
                  height={500}
                  className="h-130 object-top"
              />
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
