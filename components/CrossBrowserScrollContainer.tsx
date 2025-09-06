/**
 * Cross-browser scroll container with normalized wheel events and fallbacks
 */
"use client";

import React, { forwardRef } from 'react';
import { useCrossBrowserScroll } from '../hooks/useCrossBrowserScroll';

interface CrossBrowserScrollContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  direction?: 'horizontal' | 'vertical';
  smoothness?: number;
  sensitivity?: number;
}

const CrossBrowserScrollContainer = forwardRef<HTMLDivElement, CrossBrowserScrollContainerProps>(
  ({ children, className = '', style = {}, direction = 'horizontal', smoothness = 0.1, sensitivity = 1 }, forwardedRef) => {
    const { ref } = useCrossBrowserScroll({ direction, smoothness, sensitivity });

    // Merge refs
    const setRef = (node: HTMLDivElement | null) => {
      if (ref) ref.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    };

    const containerStyle: React.CSSProperties = {
      // Base scroll properties
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      overscrollBehavior: 'none',
      
      // Touch properties with fallbacks - allow both directions for touchpad compatibility
      touchAction: 'auto',
      
      // Webkit-specific properties (will be ignored by non-webkit browsers)
      WebkitOverflowScrolling: 'touch',
      
      ...style
    };

    return (
      <>
        <div
          ref={setRef}
          className={`hide-scrollbar ${className}`}
          style={containerStyle}
        >
          {children}
        </div>
        
        {/* Cross-browser scrollbar hiding */}
        <style jsx>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </>
    );
  }
);

CrossBrowserScrollContainer.displayName = 'CrossBrowserScrollContainer';

export default CrossBrowserScrollContainer;
