"use client";

import { client } from '../../sanity/client';
import { PortableText } from '@portabletext/react';
import Link from 'next/link';
import Image from "next/image";
import { useEffect, useState } from 'react';

interface AboutUsData {
  title: string;
  body: any[];
  seoTitle?: string;
  seoDescription?: string;
}

async function getAboutUsData(): Promise<AboutUsData[]> {
  try {
    const query = `*[_type == "aboutUs"] | order(_createdAt asc){
      title,
      body,
      seoTitle,
      seoDescription
    }`;
    
    return await client.fetch(query);
  } catch (error) {
    console.error('Error fetching about us data:', error);
    return [];
  }
}

const NAV = [
    { href: "/", label: "Hem" },
    { href: "/tjanster", label: "Tjänster" },
    { href: "/projekt", label: "Projekt" },
    { href: "/om-oss", label: "Om Oss" },
    { href: "/nyheter", label: "Nyheter" },
    { href: "/kontakt", label: "Kontakt" },
  ];

export default function OmOssPage() {
  const [aboutUsData, setAboutUsData] = useState<AboutUsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch data on client side
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAboutUsData();
        setAboutUsData(data);
      } catch (error) {
        console.error('Error fetching about us data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Laddar...</p>
      </div>
    );
  }

  if (!aboutUsData || aboutUsData.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Kunde inte ladda innehåll</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 w-full h-full bg-black">
        <div 
          className="fixed inset-0 w-full h-full bg-cover bg-center opacity-100 z-0"
          style={{
            backgroundImage: 'url(/about_us_background.jpg)',
            backgroundPosition: 'left',
            backgroundSize: 'cover'
          }}
        />
        <div className="fixed inset-0 bg-black/40 sm:bg-black/20 z-10" />
      </div>
      
      {/* Content Overlay */}
      <div className="relative min-h-screen z-20">
        {isMobile ? (
          /* Mobile: Vertical scrolling layout */
          <div className="px-4 py-6">
            
            {/* Mobile Content */}
            <div className="space-y-6">
              {aboutUsData.map((entry, index) => (
                <div key={index}>
                  {entry.title && (
                    <h2 className="text-lg font-futura-medium uppercase tracking-wider text-white mb-4">
                      {entry.title}
                    </h2>
                  )}
                  <PortableText 
                    value={entry.body}
                    components={{
                      block: {
                        normal: ({ children }) => (
                          <div className="mb-4">
                            <p className="text-sm text-gray-100 leading-relaxed">
                              {children}
                            </p>
                          </div>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-base font-medium uppercase tracking-wider mb-3 text-white">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-sm font-medium uppercase tracking-wider mb-2 text-white">
                            {children}
                          </h3>
                        ),
                      },
                      marks: {
                        strong: ({ children }) => (
                          <strong className="font-medium text-white">{children}</strong>
                        ),
                      },
                    }}
                  />
                </div>
              ))}
            </div>
            
            {/* Mobile Social Links */}
            <div className="flex justify-center space-x-6 mt-8 pt-6 border-t border-white/20">
              <a 
                href="https://www.instagram.com/" 
                target="_blank"
                rel="noreferrer noopener"
                className="text-white hover:text-gray-300 transition-colors p-2"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 0 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.65-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3z"/>
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/" 
                target="_blank"
                rel="noreferrer noopener"
                className="text-white hover:text-gray-300 transition-colors p-2"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
            </div>
          </div>
        ) : (
          /* Desktop: Original layout */
          <>
            {/* Desktop-only Side Navigation and Logo */}
            <div className="hidden sm:block">
              <Link href="/" aria-label="Kontrast" className="fixed left-3 top-7 mb-8 ml-1 md:ml-2">
                <Image
                  src="/Kontrast-logo-3.png"
                  alt="Kontrast logo"
                  width={64}
                  height={64}
                  priority
                  className="w-14 h-14 md:w-16 md:h-16 lg:h-16 w-auto object-contain filter brightness-0 invert"
                />
              </Link>
              <nav className="fixed left-6 mt-22 flex flex-col gap-3 text-xs tracking-[0.3em] text-neutral-400">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-white hover:text-gray-300 transition-colors touch-manipulation"
                  >
                    {item.label.toUpperCase()}
                  </Link>
                ))}
              </nav>

              {/* Social Links */}
              <div className="fixed left-7 top-72 flex space-x-4">
                <a 
                  href="https://www.instagram.com/" 
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-white hover:text-gray-300 transition-colors p-1 touch-manipulation"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 0 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.65-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.linkedin.com/" 
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-white hover:text-gray-300 transition-colors p-1 touch-manipulation"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="pt-13 pb-8 min-h-screen flex items-top">
              <div className="w-full max-w-2xl ml-8">
                          
                  <div className=" text-sm sm:text-base leading-relaxed">
                    {aboutUsData.map((entry, index) => (
                      <div key={index}>
                        {entry.title && (
                          <h2 className="text-xl font-futura-medium uppercase tracking-wider text-white">
                            {entry.title}
                          </h2>
                        )}
                        <PortableText 
                          value={entry.body}
                          components={{
                            block: {
                              normal: ({ children }) => (
                                <div className="mb-4">
                                  <p className="text-sm text-gray-100  text-justify">
                                    {children}
                                  </p>
                                </div>
                              ),
                              h2: ({ children }) => (
                                <h2 className="text-lg sm:text-xl lg:text-2xl font-medium uppercase tracking-wider mb-4 text-white">
                                  {children}
                                </h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className="text-base sm:text-lg lg:text-xl font-medium uppercase tracking-wider mb-3 text-white">
                                  {children}
                                </h3>
                              ),
                            },
                            marks: {
                              strong: ({ children }) => (
                                <strong className="font-medium text-white">{children}</strong>
                              ),
                            },
                          }}
                        />
                      </div>
                    ))}
                  </div>
                
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

