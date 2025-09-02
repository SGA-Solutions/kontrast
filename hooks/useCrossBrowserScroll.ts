/**
 * Cross-browser scroll hook with normalized wheel events
 */
"use client";

import { useRef, useCallback } from 'react';
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
  const animationRef = useRef<number | undefined>();
  const targetScrollRef = useRef<number>(0);
  const currentScrollRef = useRef<number>(0);

  const animate = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    const diff = targetScrollRef.current - currentScrollRef.current;
    
    if (Math.abs(diff) < 0.5) {
      // Close enough, snap to target
      if (direction === 'horizontal') {
        element.scrollLeft = targetScrollRef.current;
      } else {
        element.scrollTop = targetScrollRef.current;
      }
      currentScrollRef.current = targetScrollRef.current;
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

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    const element = e.currentTarget;
    const normalizedDelta = normalizeWheelDelta(e.deltaY) * sensitivity;
    
    // Update target scroll position
    const currentScroll = direction === 'horizontal' ? element.scrollLeft : element.scrollTop;
    const maxScroll = direction === 'horizontal' 
      ? element.scrollWidth - element.clientWidth
      : element.scrollHeight - element.clientHeight;
    
    targetScrollRef.current = Math.max(0, Math.min(maxScroll, currentScroll + normalizedDelta));
    currentScrollRef.current = currentScroll;

    // Start animation if not already running
    if (animationRef.current === undefined) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [direction, sensitivity, animate]);

  const cleanup = useCallback(() => {
    if (animationRef.current !== undefined) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
  }, []);

  return {
    ref: elementRef,
    onWheel: handleWheel,
    cleanup
  };
}
