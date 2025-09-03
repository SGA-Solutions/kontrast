"use client";

import React, { useEffect, Suspense } from 'react';
import { usePreloader } from './PreloaderProvider';
import { preloaderAnimationData } from './preloaderData';

// Lazy load Lottie to avoid blocking critical resources
const Lottie = React.lazy(() => import('lottie-react'));

interface LottiePreloaderProps {
  className?: string;
}

function LottieAnimation() {
  const { setAnimationCompleted } = usePreloader();

  // Start fading after 4.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationCompleted(true);
    }, 4500);
    return () => clearTimeout(timer);
  }, [setAnimationCompleted]);

  return (
    <Lottie
      animationData={preloaderAnimationData}
      loop={true}
      autoplay={true}
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}

export default function LottiePreloader({ className = '' }: LottiePreloaderProps) {
  const { isLoading } = usePreloader();

  if (!isLoading) return null;

  return (
    <div className={`fixed inset-0 z-50 bg-black ${className}`} style={{ width: '100vw', height: '100vh', left: 0, top: 0 }}>
      {/* Lottie Animation with Suspense fallback */}
      <Suspense fallback={null}>
        <LottieAnimation />
      </Suspense>
    </div>
  );
}
