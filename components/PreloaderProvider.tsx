"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PreloaderContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  progress: number;
  setProgress: (progress: number) => void;
  animationCompleted: boolean;
  setAnimationCompleted: (completed: boolean) => void;
}

const PreloaderContext = createContext<PreloaderContextType | undefined>(undefined);

export const usePreloader = () => {
  const context = useContext(PreloaderContext);
  if (!context) {
    throw new Error('usePreloader must be used within PreloaderProvider');
  }
  return context;
};

interface PreloaderProviderProps {
  children: ReactNode;
}

export function PreloaderProvider({ children }: PreloaderProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [animationCompleted, setAnimationCompleted] = useState(false);

  useEffect(() => {
    // Simulate progressive loading for visual feedback
    const timer = setTimeout(() => {
      setProgress(30);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Hide preloader only when animation is completed
  useEffect(() => {
    if (animationCompleted) {
      setTimeout(() => {
        setIsLoading(false);
      }, 300); // Small delay for smooth transition
    }
  }, [animationCompleted]);

  return (
    <PreloaderContext.Provider value={{ 
      isLoading, 
      setIsLoading, 
      progress, 
      setProgress, 
      animationCompleted, 
      setAnimationCompleted 
    }}>
      {children}
    </PreloaderContext.Provider>
  );
}
