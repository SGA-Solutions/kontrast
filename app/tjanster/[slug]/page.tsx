import { client, urlFor } from "../../../sanity/client";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICE_CATEGORY_BY_SLUG_QUERY, SERVICES_BY_CATEGORY_QUERY, SERVICE_CATEGORY_SLUGS_QUERY, CACHE_TAGS } from "../../../lib/sanity-queries";

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

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Generate static params for all service categories
export async function generateStaticParams() {
  const categories = await client.fetch<{slug: {current: string}}[]>(SERVICE_CATEGORY_SLUGS_QUERY);
  
  return categories.map((category) => ({
    slug: category.slug.current,
  }));
}

async function getServiceCategory(slug: string): Promise<ServiceCategory | null> {
  try {
    const category = await client.fetch<ServiceCategory>(
      SERVICE_CATEGORY_BY_SLUG_QUERY,
      { slug },
      {
        cache: 'force-cache',
        next: { 
          revalidate: 3600, // 1 hour
          tags: [CACHE_TAGS.serviceCategories, `service-category-${slug}`]
        }
      }
    );
    return category;
  } catch (err) {
    console.warn("[ServiceCategoryPage] Failed to load service category", err);
    return null;
  }
}

async function getServicesByCategory(categorySlug: string): Promise<Service[]> {
  try {
    const services = await client.fetch<Service[]>(
      SERVICES_BY_CATEGORY_QUERY,
      { categorySlug },
      {
        cache: 'force-cache',
        next: { 
          revalidate: 1800, // 30 minutes
          tags: [CACHE_TAGS.services, `services-${categorySlug}`]
        }
      }
    );
    return services || [];
  } catch (err) {
    console.warn("[ServiceCategoryPage] Failed to load services", err);
    return [];
  }
}

export default async function ServiceCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const [category, services] = await Promise.all([
    getServiceCategory(slug),
    getServicesByCategory(slug)
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen mt-5">
      {/* Main content */}
      <div className="px-6 sm:px-12 py-8">
        {/* Services Horizontal Scroll */}
        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex space-x-8 pb-4">
            {services.map((service, index) => (
              <div key={service._id} className="group flex-shrink-0 w-200">
                {/* Service title */}
                <h2 className="text-xl font-medium text-neutral-900 mb-1 uppercase tracking-wide">
                  {service.title}
                </h2>
                
                {/* Service image */}
                {service.coverImage && (
                  <div className="relative h-64 w-full overflow-hidden mb-6">
                    <Image
                      src={urlFor(service.coverImage).width(600).height(400).format('webp').quality(85).url()}
                      alt={service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
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
                
                {/* Service gallery thumbnails */}
                {service.gallery && service.gallery.length > 0 && (
                  <div className="mt-6">
                    <div className="flex space-x-2 overflow-x-auto">
                      {service.gallery.slice(0, 4).map((image, imgIndex) => (
                        <div key={imgIndex} className="relative w-16 h-16 flex-shrink-0 overflow-hidden">
                          <Image
                            src={urlFor(image).width(100).height(100).format('webp').quality(85).url()}
                            alt={`${service.title} gallery ${imgIndex + 1}`}
                            fill
                            sizes="100px"
                            className="object-cover"
                          />
                        </div>
                      ))}
                      {service.gallery.length > 4 && (
                        <div className="w-16 h-16 flex-shrink-0 bg-neutral-100 flex items-center justify-center text-xs text-neutral-600">
                          +{service.gallery.length - 4}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Back to services link */}
        <div className="mt-16 pt-8 border-t border-neutral-200">
          <Link 
            href="/tjanster"
            className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tillbaka till tjänster
          </Link>
        </div>
      </div>
    </div>
  );
}
