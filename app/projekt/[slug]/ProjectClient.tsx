"use client";

import React, { useEffect, useRef, useState } from "react";
import { getOptimizedImageUrls } from "../../../lib/image-utils";
import CrossBrowserImage from "../../../components/CrossBrowserImage";
import CrossBrowserScrollContainer from "../../../components/CrossBrowserScrollContainer";
import ScrollIcon from "../../../components/ScrollIcon";
import BeforeAfterViewer from "../../../components/BeforeAfterViewer";
import Image360Viewer from "../../../components/Image360Viewer";

// Helper function to construct video URL from Sanity asset reference
function getVideoUrl(asset: any, projectId: string, dataset: string): string {
  if (!asset?._ref) return '';
  
  // Extract the file ID and extension from the asset reference
  // Format: file-{id}-{extension}
  const ref = asset._ref;
  const parts = ref.split('-');
  if (parts.length < 3) return '';
  
  const fileId = parts.slice(1, -1).join('-');
  const extension = parts[parts.length - 1];
  
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${fileId}.${extension}`;
}

type ProjectCategory = {
  _id: string;
  title: string;
  slug: { current: string };
};

type BeforeAfterObject = {
  _type: 'beforeAfter';
  beforeImage: any;
  afterImage: any;
  caption?: string;
};

type Image360Object = {
  _type: 'image360';
  image: any;
  caption?: string;
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
  body?: any[];
  coverImage?: any;
  gallery?: (any | BeforeAfterObject | Image360Object)[];
};

interface ProjectClientProps {
  project: ProjectDoc;
}

export default function ProjectClient({ project }: ProjectClientProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [visibleBlocks, setVisibleBlocks] = useState<any[]>([]);
  const [overflowBlocks, setOverflowBlocks] = useState<any[]>([]);


  // Using the cross-browser scroll hook will be handled by CrossBrowserScrollContainer


  // Check for text overflow and calculate visible content line by line
  useEffect(() => {
    if (textContainerRef.current && project.body) {
      const container = textContainerRef.current;
      const containerHeight = container.clientHeight;
      
      // Create a temporary element to measure content height
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.visibility = 'hidden';
      tempDiv.style.width = '400px';
      tempDiv.style.fontSize = '14px';
      tempDiv.style.lineHeight = '1.625';
      tempDiv.style.textAlign = 'justify';
      document.body.appendChild(tempDiv);
      
      let currentHeight = 0;
      
      // Add title height (approximate)
      currentHeight += 60; // Title + margin
      
      // Add project details height (approximate)
      const detailsCount = [
        project.assignment,
        project.categories?.length,
        project.location,
        project.client,
        project.status,
        project.startDate || project.endDate
      ].filter(Boolean).length;
      currentHeight += detailsCount * 24 + 32; // Each detail line + spacing
      
      // Add space for the mt-4 margin
      currentHeight += 16;
      
      const visibleBlocksArray: any[] = [];
      const overflowBlocksArray: any[] = [];
      let isOverflowing = false;
      
      if (project.body) {
        for (let i = 0; i < project.body.length; i++) {
          const block = project.body[i];
          if (block._type === 'block') {
            const text = block.children?.map((child: any) => child.text).join('') || '';
            
            if (!isOverflowing) {
              // Test if this block fits in the remaining space
              tempDiv.innerHTML = `<p style="margin-bottom: 12px; font-size: 14px; line-height: 1.625; text-align: justify;">${text}</p>`;
              const blockHeight = tempDiv.offsetHeight;
              
              if (currentHeight + blockHeight <= containerHeight) {
                // Block fits completely
                visibleBlocksArray.push(block);
                currentHeight += blockHeight;
              } else {
                // Block doesn't fit, need to split it
                const words = text.split(' ');
                let visibleWords: string[] = [];
                let overflowWords: string[] = [];
                let testText = '';
                
                for (let j = 0; j < words.length; j++) {
                  const testWithWord = testText + (testText ? ' ' : '') + words[j];
                  tempDiv.innerHTML = `<p style="margin-bottom: 12px; font-size: 14px; line-height: 1.625; text-align: justify;">${testWithWord}</p>`;
                  const testHeight = tempDiv.offsetHeight;
                  
                  if (currentHeight + testHeight <= containerHeight) {
                    testText = testWithWord;
                    visibleWords.push(words[j]);
                  } else {
                    overflowWords = words.slice(j);
                    break;
                  }
                }
                
                // Add visible part to visible blocks
                if (visibleWords.length > 0) {
                  const visibleBlock = {
                    ...block,
                    children: [{
                      _type: 'span',
                      text: visibleWords.join(' ')
                    }]
                  };
                  visibleBlocksArray.push(visibleBlock);
                }
                
                // Add overflow part to overflow blocks
                if (overflowWords.length > 0) {
                  const overflowBlock = {
                    ...block,
                    children: [{
                      _type: 'span',
                      text: overflowWords.join(' ')
                    }]
                  };
                  overflowBlocksArray.push(overflowBlock);
                }
                
                // Add remaining blocks to overflow
                for (let k = i + 1; k < project.body.length; k++) {
                  if (project.body[k]._type === 'block') {
                    overflowBlocksArray.push(project.body[k]);
                  }
                }
                
                isOverflowing = true;
                break;
              }
            }
          }
        }
      }
      
      setVisibleBlocks(visibleBlocksArray);
      setOverflowBlocks(overflowBlocksArray);
      setHasOverflow(overflowBlocksArray.length > 0);
      
      document.body.removeChild(tempDiv);
    }
  }, [project.body, project.assignment, project.categories, project.location, project.client, project.status, project.startDate, project.endDate]);

  // Prepare all media items (images, videos, before/after, and 360°) for horizontal layout
  const allMediaItems: Array<{
    type: 'image' | 'video' | 'beforeAfter' | 'image360';
    alt: string;
    isCover: boolean;
    primary?: string;
    fallback?: string;
    format?: string;
    asset?: any;
    beforeImage?: any;
    afterImage?: any;
    image360?: any;
    caption?: string;
  }> = [];
  
  /*
  if (project.coverImage) {
    const imageUrls = getOptimizedImageUrls(project.coverImage, {
      width: 1920,
      height: 1280,
      quality: 95,
      fit: 'crop',
      format: 'auto'
    });
    allMediaItems.push({
      ...imageUrls,
      alt: project.title || "Project image",
      isCover: true,
      type: 'image'
    });
  }
  */
  if (project.gallery && project.gallery.length > 0) {
    project.gallery.forEach((item: any, index: number) => {
      
      // Handle before/after objects
      if (item && item._type === 'beforeAfter' && item.beforeImage && item.afterImage) {
        allMediaItems.push({
          beforeImage: item.beforeImage,
          afterImage: item.afterImage,
          caption: item.caption,
          alt: `${project.title} before/after comparison ${index + 1}`,
          isCover: false,
          type: 'beforeAfter'
        });
      }
      // Handle 360° images
      else if (item && item._type === 'image360' && item.image) {
        allMediaItems.push({
          image360: item.image,
          caption: item.caption,
          alt: `${project.title} 360° view ${index + 1}`,
          isCover: false,
          type: 'image360'
        });
      }
      // Handle videos - check for asset structure and video MIME type
      else if (item && item.asset && item.asset.url && item.asset.metadata?.mimeType?.startsWith('video/')) {
        // For videos, use the direct URL from the asset
        allMediaItems.push({
          primary: item.asset.url,
          alt: `${project.title} gallery video ${index + 1}`,
          isCover: false,
          type: 'video',
          asset: item.asset
        });
      }
      // Handle videos without MIME type (fallback based on file extension)
      else if (item && item.asset && item.asset.url && (item.asset.url.includes('.mp4') || item.asset.url.includes('.mov') || item.asset.url.includes('.avi') || item.asset.url.includes('.webm'))) {
        allMediaItems.push({
          primary: item.asset.url,
          alt: `${project.title} gallery video ${index + 1}`,
          isCover: false,
          type: 'video',
          asset: item.asset
        });
      }
      // Handle images - check for asset structure and image MIME type
      else if (item && item.asset && item.asset.url && item.asset.metadata?.mimeType?.startsWith('image/')) {
        // Use optimized image URLs for fast loading
        const imageUrls = getOptimizedImageUrls(item, {
          width: 1600,
          height: 1200,
          quality: 92,
          fit: 'crop',
          format: 'auto'
        });
        allMediaItems.push({
          ...imageUrls,
          alt: `${project.title} gallery image ${index + 1}`,
          isCover: false,
          type: 'image'
        });
      }
      // Handle legacy images without MIME type check
      else if (item && item.asset && item.asset.url && !item.asset.url.includes('.mp4') && !item.asset.url.includes('.mov') && !item.asset.url.includes('.avi') && !item.asset.url.includes('.webm')) {
        // Use optimized image URLs for fast loading
        const imageUrls = getOptimizedImageUrls(item, {
          width: 1600,
          height: 1200,
          quality: 92,
          fit: 'crop',
          format: 'auto'
        });
        allMediaItems.push({
          ...imageUrls,
          alt: `${project.title} gallery image ${index + 1}`,
          isCover: false,
          type: 'image'
        });
      }
    });
  }

  return (
    <div className="min-h-screen mt-12 pl-10 bg-white overflow-hidden no-overscroll">
      {/* Cross-browser horizontal scrolling container */}
      <CrossBrowserScrollContainer
        ref={scrollerRef}
        className="flex h-[calc(100vh-80px)] overflow-x-scroll overflow-y-hidden"
        direction="horizontal"
        sensitivity={5}
        smoothness={0.15}
      >
        {/* Project info section */}
        <div className="flex-shrink-0 pr-8 flex flex-col justify-start pt-1">
          <div className="relative">
            <div 
              className="flex transition-all duration-700 ease-in-out"
              style={{
                width: isTextExpanded ? '816px' : '400px' // 400px + 400px + 16px gap
              }}
            >
              {/* First column - always visible */}
              <div className="w-[400px] h-130 overflow-hidden relative flex-shrink-0">
                <div 
                  ref={textContainerRef}
                  className="h-full space-y-2"
                >
                  {/* Project title */}
                  <div>
                    <h1 className="text-xl font-futura-medium uppercase text-neutral-900 tracking-wide">
                      {project.title}
                    </h1>
                  </div>

                  {/* Project details in two-column layout */}
                  <div className="space-y-2">
                    {project.assignment && (
                      <div className="grid grid-cols-2 gap-8">
                        <span className="text-xs uppercase tracking-wider text-neutral-500">UPPDRAG</span>
                        <span className="text-xs uppercase tracking-wider text-neutral-700">{project.assignment}</span>
                      </div>
                    )}

                    {project.categories && project.categories.length > 0 && (
                      <div className="grid grid-cols-2 gap-8">
                        <span className="text-xs uppercase tracking-wider text-neutral-500">KATEGORI</span>
                        <span className="text-xs uppercase tracking-wider text-neutral-700">
                          {project.categories.map(cat => cat.title).join(", ")}
                        </span>
                      </div>
                    )}

                    {project.location && (
                      <div className="grid grid-cols-2 gap-8">
                        <span className="text-xs uppercase tracking-wider text-neutral-500">PLATS</span>
                        <span className="text-xs uppercase tracking-wider text-neutral-700">{project.location}</span>
                      </div>
                    )}

                    {project.client && (
                      <div className="grid grid-cols-2 gap-8">
                        <span className="text-xs uppercase tracking-wider text-neutral-500">BESTÄLLARE</span>
                        <span className="text-xs uppercase tracking-wider text-neutral-700">{project.client}</span>
                      </div>
                    )}

                    {project.status && (
                      <div className="grid grid-cols-2 gap-8">
                        <span className="text-xs uppercase tracking-wider text-neutral-500">STATUS</span>
                        <span className="text-xs uppercase tracking-wider text-neutral-700">{project.status}</span>
                      </div>
                    )}

                    {(project.startDate || project.endDate) && (
                      <div className="grid grid-cols-2 gap-8">
                        <span className="text-xs uppercase tracking-wider text-neutral-500">DATUM</span>
                        <span className="text-xs uppercase tracking-wider text-neutral-700">
                          FÄRDIGSTÄLLD, {project.startDate && new Date(project.startDate).getFullYear()}
                          {project.endDate && project.startDate !== project.endDate && 
                            ` - ${new Date(project.endDate).getFullYear()}`
                          }
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body content if available */}
                  {visibleBlocks.length > 0 && (
                    <div className="space-y-3 mt-4">
                      {visibleBlocks.map((block: any, index: number) => {
                        if (block._type === 'block') {
                          const text = block.children?.map((child: any) => child.text).join('') || '';
                          
                          return (
                            <p key={index} className="text-sm text-neutral-700 leading-relaxed text-justify">
                              {text}
                            </p>
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}
                </div>
                
                {/* Expand/Collapse Button - positioned at bottom right of text area */}
                {hasOverflow && (
                  <button
                    onClick={() => setIsTextExpanded(!isTextExpanded)}
                    className="absolute bottom-0 right-0 bg-white text-xs uppercase tracking-wider text-neutral-500 hover:text-neutral-700 transition-colors duration-200 flex items-center gap-2"
                  >
                    {isTextExpanded ? 'Komprimera' : 'Expandera'}
                    <svg 
                      className={`w-3 h-3 transition-transform duration-200 ${isTextExpanded ? 'rotate-90' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* Second column - shown when expanded - only overflow content */}
              <div 
                className={`h-120 mt-8 overflow-hidden transition-all duration-700 ease-in-out ${
                  isTextExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}
                style={{
                  width: isTextExpanded ? '400px' : '0px',
                  marginLeft: isTextExpanded ? '16px' : '0px'
                }}
              >
                {overflowBlocks.length > 0 && (
                  <div className="h-full">
                    <div className="space-y-3">
                      {overflowBlocks.map((block: any, index: number) => {
                        if (block._type === 'block') {
                          const text = block.children?.map((child: any) => child.text).join('') || '';
                          
                          return (
                            <p key={`overflow-${index}`} className="text-sm text-neutral-700 leading-relaxed text-justify">
                              {text}
                            </p>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Media section (images and videos) with peek effect */}
        {allMediaItems.map((item, index) => (
          <div 
            key={index} 
            className={`flex-shrink-0 relative w-[calc(100vw-750px-2rem)] h-120  mt-10 transition-all duration-700 ease-in-out`}
            style={{
              marginLeft: '0',
              marginRight: index < allMediaItems.length - 1 ? '2rem' : '0'
            }}
          >
            {item.type === 'beforeAfter' ? (
              <BeforeAfterViewer
                beforeImage={item.beforeImage}
                afterImage={item.afterImage}
                caption={item.caption}
                alt={item.alt}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : item.type === 'image360' ? (
              <Image360Viewer
                image={item.image360}
                caption={item.caption}
                alt={item.alt}
                className="absolute inset-0 w-full h-full"
              />
            ) : item.type === 'image' && item.primary ? (
              <CrossBrowserImage
                src={item.primary}
                alt={item.alt}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, (max-width: 1440px) 80vw, 75vw"
                quality={95}
                placeholder="blur"
              />
            ) : item.primary ? (
              <video
                src={item.primary}
                className="absolute inset-0 w-full h-full object-cover"
                controls
                preload="metadata"
                poster={`${item.primary}#t=5`}
                style={{
                  backgroundColor: '#000'
                }}
              >
                Your browser does not support the video tag.
              </video>
            ) : null}
          </div>
        ))}
        
        {/* Extra spacing at the end */}
        <div className="flex-shrink-0 w-8" />
      </CrossBrowserScrollContainer>

      {/* Component-specific styles */}
      <style jsx>{`
        /* Ensure proper stacking context */
        .relative {
          position: relative;
          z-index: 1;
        }
      `}</style>
      <ScrollIcon />
    </div>
  );
}
