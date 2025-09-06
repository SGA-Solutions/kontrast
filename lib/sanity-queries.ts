import { groq } from "next-sanity";

// Optimized queries with minimal field selection
export const POSTS_QUERY = groq`
  *[_type == "post" && defined(publishedAt)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    },
    publishedAt,
    author
  }
`;

export const POST_BY_SLUG_QUERY = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    body,
    mainImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    },
    publishedAt,
    author,
    tags
  }
`;

export const POST_SLUGS_QUERY = groq`
  *[_type == "post" && defined(slug.current)] {
    slug
  }
`;

// Project queries
export const PROJECTS_QUERY = groq`
  *[_type == "project" && defined(coverImage)] | order( select(featured == true => 0, featured == false => 1, 2), coalesce(sortOrder, 999999) asc, _createdAt desc)[0...30] {
    _id,
    title,
    slug,
    featured,
    sortOrder,    
    coverImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    },
    gallery[] {
      _type,
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip,
          mimeType
        }
      }
    }
  }
`;

export const PROJECTS_WITH_CATEGORIES_QUERY = groq`
  *[_type == "project" && defined(coverImage)] | order( select(featured == true => 0, featured == false => 1, 2), coalesce(sortOrder, 999999) asc, _createdAt desc) {
    _id,
    title,
    slug,
    featured,
    sortOrder,    
    coverImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    },
    categories[]->{ _id, title, slug },
    gallery[] {
      _type,
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip,
          mimeType
        }
      }
    }
  }
`;

export const PROJECT_CATEGORIES_QUERY = groq`
  *[_type == "projectCategory"] | order(title asc) {
    _id,
    title,
    slug
  }
`;

export const PROJECT_BY_SLUG_QUERY = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    assignment,
    categories[]->{ _id, title, slug },
    location,
    client,
    status,
    startDate,
    endDate,
    summary,
    body,
    coverImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    },
    gallery[] {
      _type,
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip,
          mimeType
        }
      },
      beforeImage {
        asset->{
          _id,
          url,
          metadata {
            dimensions,
            lqip
          }
        }
      },
      afterImage {
        asset->{
          _id,
          url,
          metadata {
            dimensions,
            lqip
          }
        }
      },
      caption
    }
  }
`;

export const PROJECT_SLUGS_QUERY = groq`
  *[_type == "project" && defined(slug.current)] {
    slug
  }
`;

export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings"][0] {
    description
  }
`;

// Service queries
export const SERVICE_CATEGORIES_QUERY = groq`
  *[_type == "serviceCategory"] | order(_createdAt asc) {
    _id,
    title,
    slug,
    body,
    coverImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    }
  }
`;

export const SERVICE_CATEGORY_BY_SLUG_QUERY = groq`
  *[_type == "serviceCategory" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    body,
    coverImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    }
  }
`;

export const SERVICES_BY_CATEGORY_QUERY = groq`
  *[_type == "service" && references(*[_type == "serviceCategory" && slug.current == $categorySlug]._id)] {
    _id,
    title,
    slug,
    body,
    coverImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    },
    gallery[] {
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    }
  }
`;

export const SERVICE_CATEGORY_SLUGS_QUERY = groq`
  *[_type == "serviceCategory" && defined(slug.current)] {
    slug
  }
`;

// Cache tags for revalidation
export const CACHE_TAGS = {
  posts: 'posts',
  post: 'post',
  projects: 'projects',
  project: 'project',
  categories: 'categories',
  settings: 'settings',
  services: 'services',
  serviceCategories: 'service-categories',
} as const;
