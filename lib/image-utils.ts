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
    width = 1200,
    height = 900,
    quality = 92,
    fit = 'crop',
    format = 'auto'
  } = options;

  // Enhanced format selection for better quality
  let selectedFormat: 'avif' | 'webp' | 'jpg' = 'webp'; // Default to WebP for better quality
  
  if (format !== 'auto') {
    selectedFormat = format as 'avif' | 'webp' | 'jpg';
  }

  // Generate URLs for different formats with enhanced quality settings
  const baseBuilder = urlFor(imageSource)
    .width(width)
    .height(height)
    .quality(quality)
    .fit(fit)
    .auto('format'); // Let Sanity choose the best format

  return {
    primary: baseBuilder.format('webp').url(), // Primary WebP for modern browsers
    fallback: baseBuilder.format('jpg').quality(Math.min(quality + 3, 100)).url(), // Slightly higher quality fallback
    format: selectedFormat
  };
}

/**
 * Generate responsive image sizes for different breakpoints with high-quality presets
 */
export function getResponsiveSizes(breakpoints: Record<string, string> = {}): string {
  const defaultBreakpoints = {
    '(max-width: 640px)': '100vw',
    '(max-width: 768px)': '90vw',
    '(max-width: 1024px)': '80vw',
    '(max-width: 1440px)': '75vw',
    '(max-width: 1920px)': '70vw',
    ...breakpoints
  };

  const sizeEntries = Object.entries(defaultBreakpoints);
  const mediaQueries = sizeEntries.slice(0, -1).map(([query, size]) => `${query} ${size}`);
  const defaultSize = sizeEntries[sizeEntries.length - 1][1] || '65vw';

  return [...mediaQueries, defaultSize].join(', ');
}

/**
 * Get high-quality image options for different use cases
 */
export function getHighQualityImageOptions(type: 'cover' | 'gallery' | 'thumbnail'): ImageOptions {
  switch (type) {
    case 'cover':
      return {
        width: 1920,
        height: 1280,
        quality: 95,
        fit: 'crop',
        format: 'auto'
      };
    case 'gallery':
      return {
        width: 1600,
        height: 1200,
        quality: 92,
        fit: 'crop',
        format: 'auto'
      };
    case 'thumbnail':
      return {
        width: 800,
        height: 600,
        quality: 88,
        fit: 'crop',
        format: 'auto'
      };
    default:
      return {
        width: 1200,
        height: 900,
        quality: 90,
        fit: 'crop',
        format: 'auto'
      };
  }
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
