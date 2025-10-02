"use client";

import React, { useState, useEffect, useRef } from "react";
import CrossBrowserImage from "./CrossBrowserImage";
import BeforeAfterViewer from "./BeforeAfterViewer";
import Image360Viewer from "./Image360Viewer";

interface MediaItem {
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
}

interface MobileImageViewerProps {
  mediaItems: MediaItem[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileImageViewer({ 
  mediaItems, 
  initialIndex, 
  isOpen, 
  onClose 
}: MobileImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLandscape, setIsLandscape] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle orientation changes
  useEffect(() => {
    const handleOrientationChange = () => {
      // Use a small delay to ensure the orientation change is complete
      setTimeout(() => {
        setIsLandscape(window.innerHeight < window.innerWidth);
      }, 100);
    };

    // Initial check
    handleOrientationChange();

    // Listen for orientation changes
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  // Reset index when viewer opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  // Prevent body scroll when viewer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  // Touch handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Prevent scrolling while swiping
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchStartX.current - touchEndX;
    const deltaY = touchStartY.current - touchEndY;

    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      const minSwipeDistance = 50;
      
      if (deltaX > minSwipeDistance) {
        // Swipe left - go to next image
        goToNext();
      } else if (deltaX < -minSwipeDistance) {
        // Swipe right - go to previous image
        goToPrevious();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (!isOpen) return null;

  const currentItem = mediaItems[currentIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
        aria-label="Close viewer"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Image counter */}
      <div className="absolute top-4 left-4 z-10 text-white text-sm">
        {currentIndex + 1} / {mediaItems.length}
      </div>

      {/* Main content area */}
      <div
        ref={containerRef}
        className={`relative w-full h-full flex items-center justify-center ${
          isLandscape ? 'px-16 py-8' : 'px-4 py-16'
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Navigation arrows */}
        {mediaItems.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors p-2"
              aria-label="Previous image"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors p-2"
              aria-label="Next image"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Media content */}
        <div className={`relative ${isLandscape ? 'max-w-[80vw] max-h-[80vh]' : 'max-w-[90vw] max-h-[70vh]'}`}>
          {currentItem.type === 'beforeAfter' ? (
            <BeforeAfterViewer
              beforeImage={currentItem.beforeImage}
              afterImage={currentItem.afterImage}
              caption={currentItem.caption}
              alt={currentItem.alt}
              className="w-full h-full object-contain"
            />
          ) : currentItem.type === 'image360' ? (
            <div className={`${isLandscape ? 'w-[80vw] h-[40vw]' : 'w-[90vw] h-[45vw]'} min-h-[300px]`}>
              <Image360Viewer
                key={`360-${currentIndex}-${isOpen}`}
                image={currentItem.image360}
                caption={currentItem.caption}
                alt={currentItem.alt}
                className="w-full h-full"
              />
            </div>
          ) : currentItem.type === 'image' && currentItem.primary ? (
            <div className="relative">
              <CrossBrowserImage
                src={currentItem.primary}
                alt={currentItem.alt}
                width={1600}
                height={1200}
                className="w-full h-full object-contain"
                quality={95}
                priority
              />
            </div>
          ) : currentItem.primary ? (
            <video
              src={currentItem.primary}
              className="w-full h-full object-contain"
              controls
              autoPlay={false}
              preload="metadata"
              poster={`${currentItem.primary}#t=5`}
            >
              Your browser does not support the video tag.
            </video>
          ) : null}
        </div>

        {/* Caption */}
        {currentItem.caption && (
          <div className="absolute bottom-4 left-4 right-4 text-white text-sm text-center bg-black bg-opacity-50 rounded px-3 py-2">
            {currentItem.caption}
          </div>
        )}
      </div>

      {/* Swipe indicator */}
      {mediaItems.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-xs opacity-70">
          Swipe left or right to navigate
        </div>
      )}

      {/* Dots indicator */}
      {mediaItems.length > 1 && mediaItems.length <= 10 && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {mediaItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
