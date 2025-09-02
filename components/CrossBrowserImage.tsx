/**
 * Cross-browser compatible image component with format fallbacks
 */
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { supportsWebP, supportsAVIF } from '../lib/browser-utils';

interface CrossBrowserImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function CrossBrowserImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className = '',
  sizes,
  quality = 85,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError
}: CrossBrowserImageProps) {
  const [imageFormat, setImageFormat] = useState<'avif' | 'webp' | 'jpg'>('jpg');
  const [hasError, setHasError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side to prevent hydration issues
    setIsClient(true);
    
    // Detect best supported format only on client
    const detectFormat = () => {
      if (supportsAVIF()) {
        setImageFormat('avif');
      } else if (supportsWebP()) {
        setImageFormat('webp');
      } else {
        setImageFormat('jpg');
      }
    };

    detectFormat();
  }, []);

  // Generate optimized URL based on detected format
  const getOptimizedSrc = (format: 'avif' | 'webp' | 'jpg') => {
    if (!src.includes('cdn.sanity.io')) return src;
    
    // If it's a Sanity URL, modify the format
    const url = new URL(src);
    url.searchParams.set('fm', format);
    url.searchParams.set('q', quality.toString());
    
    return url.toString();
  };

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // Fallback to JPG if WebP/AVIF fails
      if (imageFormat !== 'jpg') {
        setImageFormat('jpg');
      }
    }
    onError?.();
  };

  const defaultBlurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";

  // Use JPG as default for SSR, then upgrade on client
  const finalFormat = isClient ? imageFormat : 'jpg';
  
  const imageProps = {
    src: getOptimizedSrc(finalFormat),
    alt,
    className,
    priority,
    onLoad,
    onError: handleError,
    placeholder: placeholder as any,
    blurDataURL: blurDataURL || defaultBlurDataURL,
    ...(sizes && { sizes }),
    ...(fill ? { fill: true } : { width, height })
  };

  return <Image {...imageProps} />;
}
