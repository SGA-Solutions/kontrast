/**
 * Cross-browser utility functions and browser detection
 */

// Browser detection utilities
export const getBrowserInfo = () => {
  if (typeof window === 'undefined') return { name: 'server', version: '' };
  
  const ua = navigator.userAgent.toLowerCase();
  
  if (ua.includes('firefox')) return { name: 'firefox', version: ua.match(/firefox\/(\d+)/)?.[1] || '' };
  if (ua.includes('safari') && !ua.includes('chrome')) return { name: 'safari', version: ua.match(/version\/(\d+)/)?.[1] || '' };
  if (ua.includes('chrome')) return { name: 'chrome', version: ua.match(/chrome\/(\d+)/)?.[1] || '' };
  if (ua.includes('edge')) return { name: 'edge', version: ua.match(/edge\/(\d+)/)?.[1] || '' };
  if (ua.includes('opera')) return { name: 'opera', version: ua.match(/opera\/(\d+)/)?.[1] || '' };
  
  return { name: 'unknown', version: '' };
};

// Feature detection with caching to prevent hydration issues
let webpSupport: boolean | null = null;
let avifSupport: boolean | null = null;

export const supportsWebP = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  if (webpSupport !== null) return webpSupport;
  
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    webpSupport = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    return webpSupport;
  } catch {
    webpSupport = false;
    return false;
  }
};

export const supportsAVIF = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  if (avifSupport !== null) return avifSupport;
  
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    avifSupport = canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    return avifSupport;
  } catch {
    avifSupport = false;
    return false;
  }
};

// Wheel event normalization
export const normalizeWheelDelta = (deltaY: number): number => {
  const browser = getBrowserInfo();
  
  switch (browser.name) {
    case 'firefox':
      // Firefox uses different delta values (usually much smaller)
      return deltaY * 40;
    case 'safari':
      // Safari has momentum scrolling that can be too sensitive
      return deltaY * 0.5;
    case 'edge':
      // Edge sometimes has different scaling
      return deltaY * 1.2;
    default:
      return deltaY;
  }
};

// CSS property support detection
export const getCSSPropertySupport = () => {
  if (typeof window === 'undefined') return {};
  
  const testEl = document.createElement('div');
  const style = testEl.style;
  
  return {
    overscrollBehavior: 'overscrollBehavior' in style || 'webkitOverscrollBehavior' in style,
    scrollBehavior: 'scrollBehavior' in style,
    touchAction: 'touchAction' in style || 'msTouchAction' in style,
    writingMode: 'writingMode' in style || 'webkitWritingMode' in style,
    backdropFilter: 'backdropFilter' in style || 'webkitBackdropFilter' in style,
    aspectRatio: 'aspectRatio' in style,
    gap: 'gap' in style,
    grid: 'grid' in style
  };
};

// Viewport units fix for mobile browsers (SSR-safe)
export const getViewportHeight = (): string => {
  if (typeof window === 'undefined') return '100vh';
  
  // Use CSS custom property for dynamic viewport height
  // This fixes issues with mobile browsers where 100vh includes the address bar
  try {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    return 'calc(var(--vh, 1vh) * 100)';
  } catch {
    return '100vh';
  }
};

// Smooth scrolling polyfill check
export const needsSmoothScrollPolyfill = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !('scrollBehavior' in document.documentElement.style);
};

// Touch device detection
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};
