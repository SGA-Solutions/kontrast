"use client";

import { ReactNode } from 'react';
import { Header } from './Header';
import { useMobile } from '../contexts/MobileContext';

interface LayoutContentProps {
  children: ReactNode;
}

export function LayoutContent({ children }: LayoutContentProps) {
  const { isMobile } = useMobile();
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1" />
      {/* Dynamic layout based on actual device type, not screen size */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-[100px_1fr]'} grid-fallback`}>
        {/* Left vertical navigation */}
        <Header />
        <main className="max-h-[80vh] overflow-x-hidden overflow-y-auto hide-scrollbar mt-8 sm:mt-8 pt-16 sm:pt-0 no-overscroll">
          {children}
        </main>
      </div>
      <div className="flex-1" />
    </div>
  );
}
