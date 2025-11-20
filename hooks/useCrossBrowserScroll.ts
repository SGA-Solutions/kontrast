/**
 * Cross-browser scroll hook with normalized wheel events
 */
"use client";

import { useRef, useCallback, useEffect } from 'react';
import { normalizeWheelDelta } from '../lib/browser-utils';

interface ScrollOptions {
  direction?: 'horizontal' | 'vertical' | 'responsive';
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

    // Determine effective direction for animation
    let effectiveDirection = direction;
    if (direction === 'responsive') {
      effectiveDirection = window.innerWidth >= 768 ? 'horizontal' : 'vertical';
    }

    const diff = targetScrollRef.current - currentScrollRef.current;

    if (Math.abs(diff) < 0.5) {
      // Close enough, snap to target
      if (effectiveDirection === 'horizontal') {
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

    if (effectiveDirection === 'horizontal') {
      element.scrollLeft = currentScrollRef.current;
    } else {
      element.scrollTop = currentScrollRef.current;
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [direction, smoothness]);

  const handleWheel = useCallback((e: WheelEvent) => {
    const element = e.currentTarget as HTMLDivElement;

    // Determine effective direction based on responsive setting
    let effectiveDirection = direction;
    if (direction === 'responsive') {
      // Use horizontal on desktop (md and up), vertical on mobile
      effectiveDirection = window.innerWidth >= 768 ? 'horizontal' : 'vertical';
    }

    // Check if we can actually scroll in the intended direction
    const currentScroll = effectiveDirection === 'horizontal' ? element.scrollLeft : element.scrollTop;
    const maxScroll = effectiveDirection === 'horizontal'
      ? element.scrollWidth - element.clientWidth
      : element.scrollHeight - element.clientHeight;

    // Only handle scroll if there's content to scroll
    if (maxScroll <= 0) return;

    // Detect touchpad vs mouse wheel
    // Touchpad: deltaMode = 0 (pixels), usually has deltaX for horizontal scrolling
    // Mouse wheel: deltaMode = 1 (lines) or larger delta values
    const isTouchpad = e.deltaMode === 0 && Math.abs(e.deltaX) > 0;

    // For horizontal scrolling containers, prioritize horizontal gestures
    if (effectiveDirection === 'horizontal') {
      // If it's a horizontal touchpad gesture, let browser handle it
      if (isTouchpad && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        return;
      }

      // For vertical gestures on horizontal containers, always prevent and convert to horizontal
      e.preventDefault();

      // Use deltaY for vertical wheel/touchpad gestures, deltaX for horizontal
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const normalizedDelta = normalizeWheelDelta(delta) * sensitivity;
      const newScroll = currentScroll + normalizedDelta;

      // Update target scroll position
      targetScrollRef.current = Math.max(0, Math.min(maxScroll, newScroll));
      currentScrollRef.current = currentScroll;

      // Start animation if not already running
      if (animationRef.current === undefined) {
        animationRef.current = requestAnimationFrame(animate);
      }
      return;
    }

    // For vertical containers, handle normally
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

  // Drag state
  const isDraggingRef = useRef(false);
  const isScrollActiveRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startScrollRef = useRef(0);

  // Momentum state
  const velocityRef = useRef(0);
  const lastMoveTimeRef = useRef(0);
  const lastMovePosRef = useRef(0);
  const momentumIdRef = useRef<number | undefined>(undefined);

  const handlePointerDown = useCallback((e: PointerEvent) => {
    const element = elementRef.current;
    if (!element) return;

    // Only handle primary button (usually left click) or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    // Check if the target or any ancestor has the no-drag-scroll class
    if ((e.target as HTMLElement).closest('.no-drag-scroll')) {
      isScrollActiveRef.current = false;
      return;
    }
    isScrollActiveRef.current = true;

    isDraggingRef.current = false; // Not dragging yet, waiting for threshold
    startXRef.current = e.pageX;
    startYRef.current = e.pageY;

    // Determine effective direction
    let effectiveDirection = direction;
    if (direction === 'responsive') {
      effectiveDirection = window.innerWidth >= 768 ? 'horizontal' : 'vertical';
    }

    startScrollRef.current = effectiveDirection === 'horizontal' ? element.scrollLeft : element.scrollTop;

    // Initialize momentum tracking
    lastMoveTimeRef.current = Date.now();
    lastMovePosRef.current = effectiveDirection === 'horizontal' ? e.pageX : e.pageY;
    velocityRef.current = 0;

    // Cancel any ongoing animations (wheel or momentum)
    if (animationRef.current !== undefined) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
    if (momentumIdRef.current !== undefined) {
      cancelAnimationFrame(momentumIdRef.current);
      momentumIdRef.current = undefined;
    }

    // Update target to current to prevent jump
    targetScrollRef.current = startScrollRef.current;
    currentScrollRef.current = startScrollRef.current;

    // Don't capture yet - wait for move threshold
  }, [direction]);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    const element = elementRef.current;
    if (!element) return;

    if (!isScrollActiveRef.current) return;

    // Determine effective direction
    let effectiveDirection = direction;
    if (direction === 'responsive') {
      effectiveDirection = window.innerWidth >= 768 ? 'horizontal' : 'vertical';
    }

    const x = e.pageX;
    const y = e.pageY;
    const now = Date.now();
    const currentPos = effectiveDirection === 'horizontal' ? x : y;

    // Check for drag threshold if not yet dragging
    if (!isDraggingRef.current) {
      // Only check if we have a valid start point (which we should from pointerdown)
      if (e.pointerType === 'mouse' && e.buttons !== 1) return;

      const dist = Math.hypot(x - startXRef.current, y - startYRef.current);
      if (dist < 5) return; // Threshold not reached

      // Threshold reached, start dragging
      isDraggingRef.current = true;
      element.setPointerCapture(e.pointerId);
      element.style.cursor = 'grabbing';
      element.style.userSelect = 'none';

      // Reset start position to current to avoid jump
      startXRef.current = x;
      startYRef.current = y;
      startScrollRef.current = effectiveDirection === 'horizontal' ? element.scrollLeft : element.scrollTop;
    }

    // If we are here, we are dragging
    e.preventDefault();

    // Calculate velocity
    const dt = now - lastMoveTimeRef.current;
    if (dt > 0) {
      velocityRef.current = (currentPos - lastMovePosRef.current) / dt;
      lastMoveTimeRef.current = now;
      lastMovePosRef.current = currentPos;
    }

    if (effectiveDirection === 'horizontal') {
      const walk = (x - startXRef.current); // 1:1 tracking
      element.scrollLeft = startScrollRef.current - walk;
      currentScrollRef.current = element.scrollLeft;
      targetScrollRef.current = element.scrollLeft;
    } else {
      const walk = (y - startYRef.current);
      element.scrollTop = startScrollRef.current - walk;
      currentScrollRef.current = element.scrollTop;
      targetScrollRef.current = element.scrollTop;
    }
  }, [direction]);

  const handlePointerUp = useCallback((e: PointerEvent) => {
    if (!isScrollActiveRef.current) return;
    isScrollActiveRef.current = false;

    if (!isDraggingRef.current) {
      // It was a click (or sub-threshold drag)
      if (elementRef.current) {
        if (elementRef.current.hasPointerCapture(e.pointerId)) {
          elementRef.current.releasePointerCapture(e.pointerId);
        }
      }
      return;
    }

    isDraggingRef.current = false;

    if (elementRef.current) {
      elementRef.current.releasePointerCapture(e.pointerId);
      elementRef.current.style.cursor = 'grab';
      elementRef.current.style.removeProperty('user-select');

      // Start momentum if velocity is significant
      if (Math.abs(velocityRef.current) > 0.1) {
        const effectiveDirection = direction === 'responsive'
          ? (window.innerWidth >= 768 ? 'horizontal' : 'vertical')
          : direction;

        const momentumLoop = () => {
          const element = elementRef.current;
          if (!element) return;

          // Apply friction
          velocityRef.current *= 0.95; // User tuned friction

          if (Math.abs(velocityRef.current) < 0.01) {
            momentumIdRef.current = undefined;
            return;
          }

          // Move scroll based on velocity (pixels per ms * frame duration approx 16ms)
          // Using 16 multiplier as per user tuning
          const delta = velocityRef.current * 16;

          if (effectiveDirection === 'horizontal') {
            element.scrollLeft -= delta;
            currentScrollRef.current = element.scrollLeft;
            targetScrollRef.current = element.scrollLeft;
          } else {
            element.scrollTop -= delta;
            currentScrollRef.current = element.scrollTop;
            targetScrollRef.current = element.scrollTop;
          }

          momentumIdRef.current = requestAnimationFrame(momentumLoop);
        };

        momentumIdRef.current = requestAnimationFrame(momentumLoop);
      }
    }
  }, [direction]);

  const handleDragStart = useCallback((e: DragEvent) => {
    e.preventDefault();
  }, []);

  // Set up native wheel event listener with passive: false
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('wheel', handleWheel, { passive: false });
    element.addEventListener('pointerdown', handlePointerDown);
    element.addEventListener('pointermove', handlePointerMove);
    element.addEventListener('pointerup', handlePointerUp);
    element.addEventListener('pointercancel', handlePointerUp); // Handle cancel same as up
    element.addEventListener('pointerleave', handlePointerUp); // Handle leave same as up
    element.addEventListener('dragstart', handleDragStart);

    return () => {
      element.removeEventListener('wheel', handleWheel);
      element.removeEventListener('pointerdown', handlePointerDown);
      element.removeEventListener('pointermove', handlePointerMove);
      element.removeEventListener('pointerup', handlePointerUp);
      element.removeEventListener('pointercancel', handlePointerUp);
      element.removeEventListener('pointerleave', handlePointerUp);
      element.removeEventListener('dragstart', handleDragStart);

      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
      if (momentumIdRef.current !== undefined) {
        cancelAnimationFrame(momentumIdRef.current);
        momentumIdRef.current = undefined;
      }
    };
  }, [handleWheel, handlePointerDown, handlePointerMove, handlePointerUp, handleDragStart]);

  return {
    ref: elementRef,
    cleanup
  };
}
