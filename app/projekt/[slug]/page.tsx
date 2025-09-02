import React from "react";
import { client, urlFor } from "../../../sanity/client";
import { notFound } from "next/navigation";
import { PROJECT_BY_SLUG_QUERY, PROJECT_SLUGS_QUERY, CACHE_TAGS } from "../../../lib/sanity-queries";
import ProjectClient from "./ProjectClient";

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
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Generate static params for all projects
export async function generateStaticParams() {
  const projects = await client.fetch<{slug: {current: string}}[]>(PROJECT_SLUGS_QUERY);
  
  return projects.map((project) => ({
    slug: project.slug.current,
  }));
}

// Server-side data fetching
async function getProject(slug: string): Promise<ProjectDoc | null> {
  try {
    const project = await client.fetch<ProjectDoc>(
      PROJECT_BY_SLUG_QUERY,
      { slug },
      {
        cache: 'force-cache',
        next: { 
          revalidate: 3600, // 1 hour
          tags: [CACHE_TAGS.project, `project-${slug}`]
        }
      }
    );
    return project;
  } catch (err) {
    console.warn("[ProjectPage] Failed to load project", err);
    return null;
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);
  
  if (!project) {
    notFound();
  }

  return (
    <ProjectClient project={project} />
  );
}

