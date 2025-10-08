"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { getOptimizedImageUrls } from "../lib/image-utils";
import CrossBrowserImage from "./CrossBrowserImage";
import { useMobile } from "../contexts/MobileContext";

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
  const [revealPercentage, setRevealPercentage] = useState(5);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useMobile();

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

  // Calculate percentage from position
  const calculatePercentage = (clientX: number) => {
    if (!containerRef.current) return 50;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    return Math.max(0, Math.min(100, (x / rect.width) * 100));
  };

  // Handle drag start (mouse and touch)
  const handleDragStart = useCallback((clientX: number) => {
    setIsDragging(true);
    setRevealPercentage(calculatePercentage(clientX));
  }, []);

  // Handle drag move (mouse and touch)
  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging) return;
    setRevealPercentage(calculatePercentage(clientX));
  }, [isDragging]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Mouse events for desktop
  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    handleDragStart(event.clientX);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    handleDragMove(event.clientX);
  };

  // Touch events for mobile (now using DOM events)
  const handleTouchStart = useCallback((event: TouchEvent) => {
    event.preventDefault();
    const touch = event.touches[0];
    handleDragStart(touch.clientX);
  }, [handleDragStart]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    event.preventDefault();
    const touch = event.touches[0];
    handleDragMove(touch.clientX);
  }, [handleDragMove]);

  // Add non-passive touch event listeners to handle
  useEffect(() => {
    const handle = handleRef.current;
    if (!handle) return;

    handle.addEventListener('touchstart', handleTouchStart, { passive: false });

    return () => {
      handle.removeEventListener('touchstart', handleTouchStart);
    };
  }, [handleTouchStart]);

  // Global event listeners for mouse/touch move and end
  useEffect(() => {
    const handleGlobalMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        handleDragMove(event.clientX);
      }
    };

    const handleGlobalTouchMove = (event: TouchEvent) => {
      if (isDragging && event.touches.length > 0) {
        event.preventDefault();
        handleDragMove(event.touches[0].clientX);
      }
    };

    const handleGlobalEnd = () => {
      handleDragEnd();
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalEnd);
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      document.addEventListener('touchend', handleGlobalEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalEnd);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalEnd);
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      >
      {/* Before image (top layer) */}
      <div>
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

      {/* Draggable handle */}
      <div
        ref={handleRef}
        className={`absolute top-1/2 w-12 h-12 bg-gray-800 bg-opacity-20 rounded-full shadow-lg z-30 flex items-center justify-center cursor-grab ${isDragging ? 'cursor-grabbing scale-110' : ''}`}
        style={{
          left: `${revealPercentage}%`,
          transform: 'translate(-50%, -50%)'
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Handle icon - double arrows */}
        <div className="flex items-center space-x-0.5">
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none" className="text-white">
            <path d="M3 1L1 6L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none" className="text-white">
            <path d="M5 1L7 6L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

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
      {/* Instruction overlay */}
      {!isDragging && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
          <div className="bg-white bg-opacity-90 text-neutral-800 px-4 py-2 text-sm uppercase tracking-wider rounded shadow-lg">
            {isMobile ? 'Dra handtaget för att jämföra' : 'Dra handtaget för att jämföra'}
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
