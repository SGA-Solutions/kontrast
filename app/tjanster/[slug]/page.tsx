import { client } from "../../../sanity/client";
import { notFound } from "next/navigation";
import { SERVICE_CATEGORY_BY_SLUG_QUERY, SERVICES_BY_CATEGORY_QUERY, SERVICE_CATEGORY_SLUGS_QUERY, CACHE_TAGS } from "../../../lib/sanity-queries";
import ServiceCategoryClient from "./components/ServiceCategoryClient";

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

  return <ServiceCategoryClient category={category} services={services} />;
}
