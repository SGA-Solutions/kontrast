"use client";

import { client, urlFor } from "../../sanity/client";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMobile } from "../../contexts/MobileContext";
import { SERVICE_CATEGORIES_QUERY, CACHE_TAGS } from "../../lib/sanity-queries";

interface ServiceCategory {
  _id: string;
  title: string;
  slug: { current: string };
  body: any[];
  coverImage: any;
}

async function getServiceCategories(): Promise<ServiceCategory[]> {
  try {
    const categories = await client.fetch<ServiceCategory[]>(
      SERVICE_CATEGORIES_QUERY,
      {},
      {
        cache: 'force-cache',
        next: { 
          revalidate: 3600, // 1 hour
          tags: [CACHE_TAGS.serviceCategories]
        }
      }
    );
    return categories || [];
  } catch (err) {
    console.warn("[TjansterPage] Failed to load service categories", err);
    return [];
  }
}

export default function TjansterPage() {
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { isMobile } = useMobile();

  // Fetch data on client side
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getServiceCategories();
        setServiceCategories(data);
      } catch (error) {
        console.error('Error fetching service categories:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neutral-500">Laddar tjänster...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Main content */}
      <div className={`max-h-[95vh] overflow-y-auto hide-scrollbar py-8 ${
        isMobile ? 'px-6 mt-6' : 'px-12 mt-6'
      }`}>
        {/* Service Categories Grid */}
        <div className={`grid gap-8 ${
          isMobile ? 'grid-cols-1' : 'grid-cols-3'
        }`}>
          {serviceCategories.map((category) => (
            <div key={category._id} className="group">
              {/* Service Category Card */}
              <div className="relative bg-white">
                <h2 className="text-fluid-xl font-futura-medium text-neutral-900 mb-1 uppercase tracking-wide">
                  {category.title}
                </h2>
                {/* Clickable Image */}
                <Link href={`/tjanster/${category.slug.current}`}>
                  <div className="relative  w-full aspect-[4/3] cursor-pointer">
                    {category.coverImage && (
                      <Image
                        src={urlFor(category.coverImage).width(600).height(400).format('webp').quality(85).url()}
                        alt={category.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                      />
                    )}
                  </div>
                </Link>
                
                {/* Content */}
                <div className="pt-6">                
                  {/* Body text */}
                  <div className="text-sm text-neutral-600 leading-relaxed">
                    <PortableText 
                      value={category.body}
                      components={{
                        block: {
                          normal: ({ children }) => <p className="mb-3">{children}</p>,
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Customer Logos Carousel */}
        <div className="overflow-hidden mt-25">
          <div className="flex animate-scroll-left gap-x-12 items-center">
            {/* First set of logos */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
              <div key={`logo-${num}`} className="relative  flex items-center justify-center flex-shrink-0">
                <Image
                  src={`/clients/${num}.png`}
                  alt={`Client ${num}`}
                  width={192}
                  height={96}
                  className="object-contain opacity-100 transition-opacity duration-300 filter grayscale hover:grayscale-0"
                />
              </div>
            ))}
            
            {/* Duplicate set for seamless loop */}
            
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
              <div key={`logo-duplicate-${num}`} className="relative  flex items-center justify-center flex-shrink-0">
                <Image
                  src={`/clients/${num}.png`}
                  alt={`Client ${num}`}
                  width={192}
                  height={96}
                  className="object-contain opacity-100 transition-opacity duration-300 filter grayscale hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
