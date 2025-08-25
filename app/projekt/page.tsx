"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { client, urlFor } from "../../sanity/client";
import { groq } from "next-sanity";
import { useRouter } from "next/navigation";
import ImageGrid, { type ImageGridItem } from "../../components/ImageGrid";

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

export default function ProjektPage() {
  // State
  const [projects, setProjects] = useState<ProjectDoc[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Filtered projects based on selected category
  const filteredProjects = useMemo(() => {
    if (!selectedCategory) return projects;
    return projects.filter(project => 
      project.categories?.some(cat => cat._id === selectedCategory)
    );
  }, [projects, selectedCategory]);


  // Fetch content from Sanity
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoryDocs = await client.fetch<ProjectCategory[]>(
          groq`*[_type == "projectCategory"]|order(title asc){ _id, title, slug }`
        );
        
        // Fetch projects with their categories
        const projectDocs = await client.fetch<ProjectDoc[]>(
          groq`*[_type == "project" && defined(coverImage)]|order(featured desc, _createdAt desc){
            _id, 
            title, 
            slug,
            coverImage,
            categories[]->{_id, title, slug}
          }`
        );
        
        if (mounted) {
          setCategories(categoryDocs || []);
          setProjects(projectDocs || []);
          setLoading(false);
        }
      } catch (err) {
        console.warn("[ProjektPage] Failed to load CMS content", err);
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Memoize image items for the ImageGrid component
  const imageItems: ImageGridItem[] = useMemo(() => {
    return filteredProjects.map((project) => ({
      key: project._id,
      src: project.coverImage ? urlFor(project.coverImage).width(1200).height(1200).fit("crop").url() : "",
      alt: project.title || "Projekt",
      onClick: () => {
        if (project.slug?.current) {
          router.push(`/projekt/${project.slug.current}`);
        }
      },
    }));
  }, [filteredProjects, router]);

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  if (loading) {
    return (
      <section className="flex items-center justify-center min-h-[400px]">
        <div className="text-neutral-600">Laddar projekt...</div>
      </section>
    );
  }

  return (
    <section>
      <div className="h-22"></div>
      {/* Category Filter Row */}
      <div className="flex flex-wrap gap-3 sm:gap-4">
        <button
          onClick={() => handleCategoryClick(null)}
          className={`px-4 text-xs sm:text-sm tracking-[0.3em] uppercase transition-colors ${
            selectedCategory === null
              ? "text-neutral-900"
              : "text-neutral-400 hover:text-neutral-900"
          }`}
        >
          ALLA
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => handleCategoryClick(category._id)}
            className={`px-4 text-xs sm:text-sm tracking-[0.3em] uppercase transition-colors ${
              selectedCategory === category._id
                ? "text-neutral-900"
                : "text-neutral-400 hover:text-neutral-900"
            }`}
          >
            {category.title}
          </button>
        ))}
      </div>
      
      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-[20%_80%]">
          <div></div>
          <ImageGrid  items={imageItems} />
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[200px] text-neutral-500">
          Inga projekt hittades för den valda kategorin.
        </div>
      )}

      {/* Project count indicator */}
      
      <div className="text-xs text-neutral-500 tracking-[0.2em]">
        {filteredProjects.length} PROJEKT
        {selectedCategory && (
          <span className="ml-2">
            · {categories.find(cat => cat._id === selectedCategory)?.title?.toUpperCase()}
          </span>
        )}
      </div>
      
    </section>
  );
}
