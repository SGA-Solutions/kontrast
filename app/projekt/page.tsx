import React from "react";
import { client, urlFor } from "../../sanity/client";
import ImageGrid, { type ImageGridItem } from "../../components/ImageGrid";
import { PROJECTS_WITH_CATEGORIES_QUERY, PROJECT_CATEGORIES_QUERY, CACHE_TAGS } from "../../lib/sanity-queries";
import ProjectsClient from "./ProjectsClient";

type ProjectCategory = {
  _id: string;
  title: string;
  slug: { current: string };
};

type ProjectDoc = {
  _id: string;
  title?: string;
  slug?: { current: string };
  coverImage?: any;
  categories?: ProjectCategory[];
};

// Server-side data fetching
async function getProjectsData() {
  try {
    const [categories, projects] = await Promise.all([
      client.fetch<ProjectCategory[]>(
        PROJECT_CATEGORIES_QUERY,
        {},
        {
          cache: 'force-cache',
          next: { 
            revalidate: 3600, // 1 hour
            tags: [CACHE_TAGS.categories]
          }
        }
      ),
      client.fetch<ProjectDoc[]>(
        PROJECTS_WITH_CATEGORIES_QUERY,
        {},
        {
          cache: 'force-cache',
          next: { 
            revalidate: 600, // 10 minutes
            tags: [CACHE_TAGS.projects]
          }
        }
      )
    ]);
    
    return {
      categories: categories || [],
      projects: projects || []
    };
  } catch (err) {
    console.warn("[ProjektPage] Failed to load CMS content", err);
    return {
      categories: [],
      projects: []
    };
  }
}

export default async function ProjektPage() {
  const { categories, projects } = await getProjectsData();

  return (
    <ProjectsClient 
      initialCategories={categories}
      initialProjects={projects}
    />
  );
}
