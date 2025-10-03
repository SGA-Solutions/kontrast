"use client";

import { useState, useEffect } from 'react';

/**
 * Custom hook for detecting mobile devices with orientation-aware logic
 * 
 * Uses multiple factors to determine if the device should be treated as mobile:
 * 1. Touch capability detection
 * 2. Orientation-aware screen dimension checking:
 *    - Landscape: Uses width-based detection (< 1024px width)
 *    - Portrait: Uses smaller dimension approach (< 640px)
 * 3. Fallback size-based detection for edge cases
 * 
 * @returns boolean indicating if the device should use mobile layout
 */
export function useMobileDetection(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Check if it's a touch device first
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Determine orientation
      const isLandscape = window.matchMedia("(orientation: landscape)").matches;
      
      // In landscape mode, use width-based detection for more intuitive behavior
      // In portrait mode, use the smaller dimension approach
      let isMobileSize: boolean;
      
      if (isLandscape && isTouchDevice) {
        isMobileSize = window.innerHeight < 640;
      } else {
        isMobileSize = window.innerWidth < 640;
      }
      
      setIsMobile(isMobileSize);
    };
    
    // Initial check
    checkMobile();
    
    // Listen for changes
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  return isMobile;
}

/**
 * Utility function for one-time mobile detection (non-reactive)
 * Useful for server-side rendering or one-time checks
 * 
 * @returns boolean indicating if the current viewport suggests mobile
 */
export function detectMobile(): boolean {
  if (typeof window === 'undefined') return false;
  
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isLandscape = window.matchMedia("(orientation: landscape)").matches;
  
  let isMobileSize: boolean;
  
  if (isLandscape && isTouchDevice) {
    isMobileSize = window.innerHeight < 640;
  } else {
    isMobileSize = window.innerWidth < 640;
  }
  
  return isMobileSize;
}
