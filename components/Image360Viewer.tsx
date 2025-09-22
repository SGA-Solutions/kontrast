"use client";

import React, { useRef, useEffect, useState } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import { AutorotatePlugin } from "@photo-sphere-viewer/autorotate-plugin";
import "@photo-sphere-viewer/core/index.css";
import { getOptimizedImageUrls } from "../lib/image-utils";

interface Image360ViewerProps {
  image: any;
  caption?: string;
  alt?: string;
  className?: string;
}

export default function Image360Viewer({
  image,
  caption,
  alt = "360° panoramic view",
  className = ""
}: Image360ViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Get optimized image URLs for panoramic images
  const imageUrls = getOptimizedImageUrls(image, {
    width: 4096, // High resolution for panoramic images
    height: 2048,
    quality: 90,
    fit: 'fillmax',
    format: 'auto'
  });

  // Intersection Observer for visibility detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Initialize Photo Sphere Viewer
  useEffect(() => {
    if (!containerRef.current || !imageUrls.primary) return;

    // Clean up existing viewer
    if (viewerRef.current) {
      viewerRef.current.destroy();
    }

    try {
      const viewer = new Viewer({
        container: containerRef.current,
        panorama: imageUrls.primary,
        loadingImg: undefined,
        navbar: false,
        defaultZoomLvl: 50,
        minFov: 30,
        maxFov: 90,
        mousewheel: false, // Disable mousewheel to prevent scroll conflicts
        mousemove: true,
        touchmoveTwoFingers: false, // Keep disabled to allow page scrolling
        fisheye: false,
        moveSpeed: 1.0,
        zoomSpeed: 1.0,
        plugins: [
          [AutorotatePlugin, {
            autostartDelay: 1000,
            autostartOnIdle: true,
            autorotatePitch: 0,
            autorotateSpeed: '1.0rpm'
          }]
        ]
      });

      viewerRef.current = viewer;

    } catch (error) {
      console.error('Failed to initialize 360° viewer:', error);
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [imageUrls.primary, isVisible]);

  return (
    <div className={`relative ${className}`}>
      {/* Photo Sphere Viewer Container */}
      <div 
        ref={containerRef}
        className="w-full h-full"        
      />

      {/* 360° Indicator */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 text-xs uppercase tracking-wider rounded z-10 flex items-center gap-2">
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
          />
        </svg>
        360°
      </div>

      {/* Caption */}
      {caption && (
        <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-70 text-white px-3 py-2 text-sm rounded z-10">
          {caption}
        </div>
      )}
    </div>
  );
}
