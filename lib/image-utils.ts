/**
 * Cross-browser image utilities with format fallbacks
 */
import { urlFor } from '../sanity/client';
import { supportsWebP, supportsAVIF } from './browser-utils';

export interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min';
  format?: 'auto' | 'jpg' | 'png' | 'webp' | 'avif';
}

export interface OptimizedImageUrls {
  primary: string;
  fallback: string;
  format: 'avif' | 'webp' | 'jpg';
}

/**
 * Get optimized image URLs with cross-browser format fallbacks
 */
export function getOptimizedImageUrls(
  imageSource: any,
  options: ImageOptions = {}
): OptimizedImageUrls {
  const {
    width = 800,
    height = 600,
    quality = 85,
    fit = 'crop',
    format = 'auto'
  } = options;

  // Always default to JPG for SSR to prevent hydration issues
  // Format detection will happen on client-side in components
  let selectedFormat: 'avif' | 'webp' | 'jpg' = 'jpg';
  
  if (format !== 'auto') {
    selectedFormat = format as 'avif' | 'webp' | 'jpg';
  }

  // Generate URLs for different formats
  const baseBuilder = urlFor(imageSource)
    .width(width)
    .height(height)
    .quality(quality)
    .fit(fit);

  return {
    primary: baseBuilder.format(selectedFormat === 'avif' ? 'webp' : selectedFormat).url(), // Use webp instead of avif for Sanity compatibility
    fallback: baseBuilder.format('jpg').url(),
    format: selectedFormat
  };
}

/**
 * Generate responsive image sizes for different breakpoints
 */
export function getResponsiveSizes(breakpoints: Record<string, string> = {}): string {
  const defaultBreakpoints = {
    '(max-width: 640px)': '100vw',
    '(max-width: 768px)': '80vw',
    '(max-width: 1024px)': '60vw',
    ...breakpoints
  };

  const sizeEntries = Object.entries(defaultBreakpoints);
  const mediaQueries = sizeEntries.slice(0, -1).map(([query, size]) => `${query} ${size}`);
  const defaultSize = sizeEntries[sizeEntries.length - 1][1];

  return [...mediaQueries, defaultSize].join(', ');
}

/**
 * Generate blur placeholder for images
 */
export function generateBlurDataURL(width: number = 8, height: number = 6): string {
  // Simple base64 encoded tiny image for blur placeholder
  const canvas = typeof window !== 'undefined' ? document.createElement('canvas') : null;
  
  if (!canvas) {
    // Server-side fallback
    return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";
  }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Create a simple gradient blur placeholder
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f3f4f6');
    gradient.addColorStop(1, '#e5e7eb');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  return canvas.toDataURL('image/jpeg', 0.1);
}
