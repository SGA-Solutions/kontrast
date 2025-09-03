import React from "react";
import { client } from "../../sanity/client";
import { POSTS_QUERY, CACHE_TAGS } from "../../lib/sanity-queries";
import NewsListClient from "./components/NewsListClient";

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: any;
  publishedAt: string;
  author?: string;
};

// Server-side data fetching with optimized caching
async function getPosts(): Promise<Post[]> {
  try {
    const posts = await client.fetch<Post[]>(
      POSTS_QUERY,
      {},
      {
        cache: 'force-cache',
        next: { 
          revalidate: 300, // Revalidate every 5 minutes
          tags: [CACHE_TAGS.posts]
        }
      }
    );
    return posts || [];
  } catch (err) {
    console.warn("[NyheterPage] Failed to load posts", err);
    return [];
  }
}

export default async function NyheterPage() {
  const posts = await getPosts();

  return <NewsListClient posts={posts} />;
}
