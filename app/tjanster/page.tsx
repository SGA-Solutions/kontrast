import { client, urlFor } from "../../sanity/client";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
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

export default async function TjansterPage() {
  const serviceCategories = await getServiceCategories();

  return (
    <div className="min-h-screen">
      {/* Main content */}
      <div className="px-6 mt-6 sm:px-12 py-8">
        {/* Service Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceCategories.map((category) => (
            <div key={category._id} className="group">
              {/* Service Category Card */}
              <div className="relative bg-white">
                <h2 className="text-xl font-medium text-neutral-900 mb-1 uppercase tracking-wide">
                  {category.title}
                </h2>
                {/* Clickable Image */}
                <Link href={`/tjanster/${category.slug.current}`}>
                  <div className="relative h-64 w-full cursor-pointer">
                    {category.coverImage && (
                      <Image
                        src={urlFor(category.coverImage).width(600).height(400).format('webp').quality(85).url()}
                        alt={category.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
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
        <div className="overflow-hidden mt-10">
          <div className="flex animate-scroll-left gap-x-12 items-center">
            {/* First set of logos */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
              <div key={`logo-${num}`} className="relative  flex items-center justify-center flex-shrink-0">
                <Image
                  src={`/clients/${num}.png`}
                  alt={`Client ${num}`}
                  width={192}
                  height={96}
                  className="object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 filter grayscale hover:grayscale-0"
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
                  className="object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 filter grayscale hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
