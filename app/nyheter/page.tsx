"use client";

import React, { useEffect, useState } from "react";
import { client, urlFor } from "../../sanity/client";
import { groq } from "next-sanity";
import Link from "next/link";
import Image from "next/image";

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: any;
  publishedAt: string;
  author?: string;
};

export default function NyheterPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts from Sanity
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        
        const postDocs = await client.fetch<Post[]>(
          groq`*[_type == "post" && defined(publishedAt)]|order(publishedAt desc){
            _id,
            title,
            slug,
            excerpt,
            mainImage,
            publishedAt,
            author
          }`
        );
        
        if (mounted) {
          setPosts(postDocs || []);
          setLoading(false);
        }
      } catch (err) {
        console.warn("[NyheterPage] Failed to load posts", err);
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="flex items-center justify-center min-h-[400px]">
        <div className="text-neutral-600">Laddar nyheter...</div>
      </section>
    );
  }

  return (
    <section className="pl-10 mt-13 space-y-6">
      {/* Page title */}
      <span className="text-sm font-light tracking-[0.45em] text-neutral-900">NYHETER</span>
      
      {/* News horizontal scroll with peek */}
      <div>
        <div className="flex gap-8 pb-4 mt-3">
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
                    src={urlFor(post.mainImage).url()}
                    alt={post.title}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
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
                {/*
                <div className="flex items-center justify-between text-xs text-neutral-500 pt-2">
                  <span>
                    {new Date(post.publishedAt).toLocaleDateString('sv-SE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  {post.author && <span>{post.author}</span>}
                </div>
                */}
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
      
      {/* Post count */}
      {/*
      <div className="text-xs text-neutral-500 tracking-[0.2em] pt-8">
        {posts.length} ARTIKLAR
      </div>
      */}
    </section>
  );
}
