"use client";

import { createContext, useContext, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface ThemeContextType {
  isDark: boolean;
  pathname: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const pathname = usePathname();
  const isDark = pathname === '/om-oss';

  return (
    <ThemeContext.Provider value={{ isDark, pathname }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
