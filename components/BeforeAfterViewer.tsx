"use client";

import React, { useState, useRef, useEffect } from "react";
import { getOptimizedImageUrls } from "../lib/image-utils";
import CrossBrowserImage from "./CrossBrowserImage";

interface BeforeAfterViewerProps {
  beforeImage: any;
  afterImage: any;
  caption?: string;
  alt?: string;
  className?: string;
}

export default function BeforeAfterViewer({
  beforeImage,
  afterImage,
  caption,
  alt = "Before and after comparison",
  className = ""
}: BeforeAfterViewerProps) {
  const [revealPercentage, setRevealPercentage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get optimized image URLs for both images
  const beforeImageUrls = getOptimizedImageUrls(beforeImage, {
    width: 1600,
    height: 1200,
    quality: 92,
    fit: 'crop',
    format: 'auto'
  });

  const afterImageUrls = getOptimizedImageUrls(afterImage, {
    width: 1600,
    height: 1200,
    quality: 92,
    fit: 'crop',
    format: 'auto'
  });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    setRevealPercentage(percentage);
  };

  const handleMouseLeave = () => {
    setRevealPercentage(0);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden cursor-ew-resize ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      >
      {/* Before image (top layer) */}
      <div >
        <CrossBrowserImage
          src={beforeImageUrls.primary}
          alt={`${alt} - after`}
          fill
          className="object-contain object-top"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, (max-width: 1440px) 80vw, 75vw"
          quality={95}
          placeholder="blur"
        />
      </div>

      {/* After image (bottom layer, revealed on hover) */}
      <div 
        className="absolute inset-0"
        style={{
          clipPath: `inset(0 ${100 - revealPercentage}% 0 0)`
        }}
      >
        <CrossBrowserImage
          src={afterImageUrls.primary}
          alt={`${alt} - before`}
          fill
          className="object-contain object-top"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, (max-width: 1440px) 80vw, 75vw"
          quality={95}
          placeholder="blur"
        />
      </div>

      {/* Divider line */}
      {revealPercentage > 0 && (
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10 transition-opacity duration-200"
          style={{
            left: `${revealPercentage}%`,
            transform: 'translateX(-50%)'
          }}
        />
      )}

      {/* Labels */}
      {/*
      {revealPercentage > 0 && (
        <>
          {revealPercentage > 15 && (
            <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 text-xs uppercase tracking-wider rounded z-10">
              Före
            </div>
          )}
          {revealPercentage < 85 && (
            <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 text-xs uppercase tracking-wider rounded z-10">
              Efter
            </div>
          )}
        </>
      )}
      */}
      {/* Instruction overlay when not hovering */}
      {revealPercentage === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity duration-300 z-10">
          <div className="bg-white bg-opacity-90 text-neutral-800 px-4 py-2 text-sm uppercase tracking-wider rounded shadow-lg">
            Håll muspekaren och dra för att jämföra
          </div>
        </div>
      )}

      {/* Caption */}
      {caption && (
        <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-70 text-white px-3 py-2 text-sm rounded z-10">
          {caption}
        </div>
      )}
    </div>
  );
}
