"use client";

import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "../../../../sanity/client";
import { useCrossBrowserScroll } from "../../../../hooks/useCrossBrowserScroll";
import { useMobile } from "../../../../contexts/MobileContext";
import ScrollIcon from "../../../../components/ScrollIcon";

interface Service {
  _id: string;
  title: string;
  slug: { current: string };
  body: any[];
  coverImage: any;
  gallery?: any[];
}

interface ServiceCategory {
  _id: string;
  title: string;
  slug: { current: string };
  body: any[];
  coverImage: any;
}

interface ServiceCategoryClientProps {
  category: ServiceCategory;
  services: Service[];
}

export default function ServiceCategoryClient({ category, services }: ServiceCategoryClientProps) {
  const { ref: scrollRef } = useCrossBrowserScroll({ 
    direction: 'horizontal',
    sensitivity: 5,
    smoothness: 0.15
  });

  // Use the mobile context
  const { isMobile } = useMobile();

  return (
    <div className={`min-h-screen mobile-vh-fit ${
      isMobile ? 'mt-4' : 'mt-13'
    }`}>
      {isMobile ? (
        /* Mobile: Vertical scrolling layout */
        <div className="px-4 space-y-8">
          {services.map((service, index) => (
            <div key={service._id} className="w-full">
              {/* Service title */}
              <h2 className="text-lg font-medium text-neutral-900 mb-4 uppercase tracking-wide">
                {service.title}
              </h2>
              
              {/* Service image */}
              {service.coverImage && (
                <div className="relative h-48 w-full overflow-hidden mb-4">
                  <Image
                    src={urlFor(service.coverImage).width(600).height(400).format('webp').quality(85).url()}
                    alt={service.title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority={index === 0}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  />
                </div>
              )}
              
              {/* Service description */}
              <div className="text-sm text-neutral-600 leading-relaxed">
                <PortableText 
                  value={service.body}
                  components={{
                    block: {
                      normal: ({ children }) => <p className="mb-3">{children}</p>,
                    },
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Desktop: Horizontal scrolling layout */
        <div className="px-6 sm:px-12 mobile-compact">
          {/* Services Horizontal Scroll */}
          <div 
            ref={scrollRef}
            className="overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing"
          >
            <div className="flex space-x-8 pb-4">
              {services.map((service, index) => (
                <div key={service._id} className="group flex-shrink-0 w-[30vw]">
                  {/* Service title */}
                  <h2 className="text-fluid-xl font-medium text-neutral-900 space-fluid-1 uppercase tracking-wide">
                    {service.title}
                  </h2>
                  
                  {/* Service image */}
                  {service.coverImage && (
                    <div className="relative w-full aspect-[4/2] overflow-hidden space-fluid-3">
                      <Image
                        src={urlFor(service.coverImage).width(600).height(400).format('webp').quality(85).url()}
                        alt={service.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 600px"
                        className="object-cover"
                        priority={index === 0}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                      />
                    </div>
                  )}
                  
                  {/* Service description */}
                  <div className="text-fluid-xs text-neutral-600 mobile-fit-text leading-fluid-normal">
                    <PortableText 
                      value={service.body}
                      components={{
                        block: {
                          normal: ({ children }) => <p className="space-fluid-2">{children}</p>,
                        },
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {!isMobile && <ScrollIcon />}
    </div>
  );
}
