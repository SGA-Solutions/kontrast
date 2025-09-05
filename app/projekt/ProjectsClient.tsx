"use client";

import React, { useMemo, useState } from "react";
import { urlFor } from "../../sanity/client";
import ImageGrid, { type ImageGridItem } from "../../components/ImageGrid";
import ScrollIcon from "../../components/ScrollIcon";

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

interface ProjectsClientProps {
  initialCategories: ProjectCategory[];
  initialProjects: ProjectDoc[];
}

export default function ProjectsClient({ initialCategories, initialProjects }: ProjectsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filtered projects based on selected category
  const filteredProjects = useMemo(() => {
    if (!selectedCategory) return initialProjects;
    return initialProjects.filter(project => 
      project.categories?.some(cat => cat._id === selectedCategory)
    );
  }, [initialProjects, selectedCategory]);

  // Memoize image items for the ImageGrid component
  const imageItems: ImageGridItem[] = useMemo(() => {
    return filteredProjects.map((project) => ({
      key: project._id,
      src: project.coverImage ? urlFor(project.coverImage).width(1200).height(1200).format('webp').quality(85).fit("crop").url() : "",
      alt: project.title || "Projekt",
      href: project.slug?.current ? `/projekt/${project.slug.current}` : undefined,
    }));
  }, [filteredProjects]);

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  return (
    <section className="mt-14">
      {/* Category Filter Row */}
      <div className="flex flex-wrap pl-6 gap-3 sm:gap-4">
        <button
          onClick={() => handleCategoryClick(null)}
          className={`px-4 text-xs sm:text-sm tracking-[0.5em] uppercase transition-colors ${
            selectedCategory === null
              ? "text-neutral-900"
              : "text-neutral-400 hover:text-neutral-900"
          }`}
        >
          ALLA
        </button>
        {initialCategories.map((category) => (
          <button
            key={category._id}
            onClick={() => handleCategoryClick(category._id)}
            className={`px-4 text-xs sm:text-sm tracking-[0.5em] uppercase transition-colors ${
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
        <div className="pt-3 pl-10">
          <ImageGrid items={imageItems} />
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[200px] text-neutral-500">
          Inga projekt hittades för den valda kategorin.
        </div>
      )}
      <ScrollIcon />
    </section>
  );
}
