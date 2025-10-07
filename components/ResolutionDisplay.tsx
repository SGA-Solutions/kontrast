"use client";

import { useState, useEffect } from 'react';

export function ResolutionDisplay() {
  const [resolution, setResolution] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateResolution = () => {
      setResolution({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Set initial resolution
    updateResolution();

    // Listen for resize events
    window.addEventListener('resize', updateResolution);
    window.addEventListener('orientationchange', updateResolution);

    return () => {
      window.removeEventListener('resize', updateResolution);
      window.removeEventListener('orientationchange', updateResolution);
    };
  }, []);

  return (
    <div className="fixed top-2 left-2 z-50 bg-black/80 text-white px-2 py-1 rounded text-xs font-mono">
      {resolution.width} × {resolution.height}
    </div>
  );
}
