import React from "react";
import { client } from "../../../sanity/client";
import { notFound } from "next/navigation";
import { POST_BY_SLUG_QUERY, POST_SLUGS_QUERY, CACHE_TAGS } from "../../../lib/sanity-queries";
import ArticleClient from "./components/ArticleClient";

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

  return <ArticleClient post={post} />;
}
