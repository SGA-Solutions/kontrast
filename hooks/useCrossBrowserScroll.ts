/**
 * Cross-browser scroll hook with normalized wheel events
 */
"use client";

import { useRef, useCallback, useEffect } from 'react';
import { normalizeWheelDelta } from '../lib/browser-utils';

interface ScrollOptions {
  direction?: 'horizontal' | 'vertical';
  smoothness?: number;
  sensitivity?: number;
}

export function useCrossBrowserScroll(options: ScrollOptions = {}) {
  const {
    direction = 'horizontal',
    smoothness = 0.1,
    sensitivity = 1
  } = options;
  const elementRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const targetScrollRef = useRef<number>(0);
  const currentScrollRef = useRef<number>(0);

  const animate = useCallback(() => {
    const element = elementRef.current;
    if (!element) {
      animationRef.current = undefined;
      return;
    }

    const diff = targetScrollRef.current - currentScrollRef.current;
    
    if (Math.abs(diff) < 0.5) {
      // Close enough, snap to target
      if (direction === 'horizontal') {
        element.scrollLeft = targetScrollRef.current;
      } else {
        element.scrollTop = targetScrollRef.current;
      }
      currentScrollRef.current = targetScrollRef.current;
      animationRef.current = undefined; // Reset animation frame
      return;
    }

    // Smooth interpolation
    currentScrollRef.current += diff * smoothness;
    
    if (direction === 'horizontal') {
      element.scrollLeft = currentScrollRef.current;
    } else {
      element.scrollTop = currentScrollRef.current;
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [direction, smoothness]);

  const handleWheel = useCallback((e: WheelEvent) => {
    const element = e.currentTarget as HTMLDivElement;
    
    // Check if we can actually scroll in the intended direction
    const currentScroll = direction === 'horizontal' ? element.scrollLeft : element.scrollTop;
    const maxScroll = direction === 'horizontal' 
      ? element.scrollWidth - element.clientWidth
      : element.scrollHeight - element.clientHeight;
    
    // Only handle scroll if there's content to scroll
    if (maxScroll <= 0) return;
    
    // Detect touchpad vs mouse wheel
    // Touchpad: deltaMode = 0 (pixels), usually has deltaX for horizontal scrolling
    // Mouse wheel: deltaMode = 1 (lines) or larger delta values
    const isTouchpad = e.deltaMode === 0 && Math.abs(e.deltaX) > 0;
    
    // For horizontal scrolling containers, let touchpad horizontal gestures work naturally
    if (direction === 'horizontal' && isTouchpad && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      // This is a horizontal touchpad gesture, let the browser handle it
      return;
    }
    
    // For vertical scrolling on horizontal containers, only intercept mouse wheel
    if (direction === 'horizontal' && isTouchpad) {
      // Let touchpad vertical gestures pass through for page scrolling
      return;
    }
    
    const normalizedDelta = normalizeWheelDelta(e.deltaY) * sensitivity;
    const newScroll = currentScroll + normalizedDelta;
    
    // Only prevent default if we're handling the scroll
    if ((newScroll >= 0 && newScroll <= maxScroll) || 
        (newScroll < 0 && currentScroll > 0) || 
        (newScroll > maxScroll && currentScroll < maxScroll)) {
      e.preventDefault();
      
      // Update target scroll position
      targetScrollRef.current = Math.max(0, Math.min(maxScroll, newScroll));
      currentScrollRef.current = currentScroll;

      // Start animation if not already running
      if (animationRef.current === undefined) {
        animationRef.current = requestAnimationFrame(animate);
      }
    }
  }, [direction, sensitivity, animate]);

  const cleanup = useCallback(() => {
    if (animationRef.current !== undefined) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
  }, []);

  // Set up native wheel event listener with passive: false
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', handleWheel);
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    };
  }, [handleWheel]);

  return {
    ref: elementRef,
    cleanup
  };
}
