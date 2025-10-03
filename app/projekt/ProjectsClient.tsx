"use client";

import React, { useMemo, useState } from "react";
import { urlFor } from "../../sanity/client";
import ImageGrid, { type ImageGridItem } from "../../components/ImageGrid";
import ScrollIcon from "../../components/ScrollIcon";
import { useMobileDetection } from "../../hooks/useMobileDetection";

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
  gallery?: any[];
};

interface ProjectsClientProps {
  initialCategories: ProjectCategory[];
  initialProjects: ProjectDoc[];
}

export default function ProjectsClient({ initialCategories, initialProjects }: ProjectsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Use the reusable mobile detection hook
  const isMobile = useMobileDetection();

  // Filtered projects based on selected category
  const filteredProjects = useMemo(() => {
    if (!selectedCategory) return initialProjects;
    return initialProjects.filter(project => 
      project.categories?.some(cat => cat._id === selectedCategory)
    );
  }, [initialProjects, selectedCategory]);

  // Helper function to check if project has videos in gallery
  const hasVideoInGallery = (project: ProjectDoc): boolean => {
    if (!project.gallery || project.gallery.length === 0) return false;
    
    return project.gallery.some((item: any) => {
      // Check for video MIME type
      if (item?.asset?.metadata?.mimeType?.startsWith('video/')) return true;
      
      // Check for video file extensions as fallback
      if (item?.asset?.url && (
        item.asset.url.includes('.mp4') || 
        item.asset.url.includes('.mov') || 
        item.asset.url.includes('.avi') || 
        item.asset.url.includes('.webm')
      )) return true;
      
      return false;
    });
  };

  // Memoize image items for the ImageGrid component
  const imageItems: ImageGridItem[] = useMemo(() => {
    return filteredProjects.map((project) => ({
      key: project._id,
      src: project.coverImage ? urlFor(project.coverImage).width(1200).height(1200).format('webp').quality(85).fit("crop").url() : "",
      alt: project.title || "Projekt",
      href: project.slug?.current ? `/projekt/${project.slug.current}` : undefined,
      hasVideo: hasVideoInGallery(project),
    }));
  }, [filteredProjects]);

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  return (
    <section className={`${
      isMobile ? 'mt-4 px-4' : 'mt-14'
    }`}>
      {/* Category Filter Row */}
      <div className={`flex flex-wrap gap-3 sm:gap-4 ${
        isMobile ? 'justify-center mb-6' : 'pl-6'
      }`}>
        <button
          onClick={() => handleCategoryClick(null)}
          className={`px-3 py-2 text-xs tracking-[0.2em] uppercase transition-colors ${
            selectedCategory === null
              ? "text-white bg-neutral-900 border-neutral-900"
              : "text-neutral-600 bg-white border-neutral-300 hover:text-neutral-900"
          } ${isMobile ? 'text-xs' : 'sm:text-sm'}`}
        >
          ALLA
        </button>
        {initialCategories.map((category) => (
          <button
            key={category._id}
            onClick={() => handleCategoryClick(category._id)}
            className={`px-3 py-2 text-xs tracking-[0.2em] uppercase transition-colors ${
              selectedCategory === category._id
                ? "text-white bg-neutral-900 border-neutral-900"
                : "text-neutral-600 bg-white border-neutral-300 hover:text-neutral-900"
            } ${isMobile ? 'text-xs' : 'sm:text-sm'}`}
          >
            {category.title}
          </button>
        ))}
      </div>
      
      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className={`w-full h-full overflow-hidden ${
          isMobile ? 'pt-0' : 'pt-3 pl-10'
        }`}>
          <ImageGrid items={imageItems} visibleColumns={5.8} />
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[200px] text-neutral-500">
          <p className={`text-center ${
            isMobile ? 'text-sm px-4' : 'text-base'
          }`}>
            Inga projekt hittades för den valda kategorin.
          </p>
        </div>
      )}
      {!isMobile && <ScrollIcon />}
    </section>
  );
}
