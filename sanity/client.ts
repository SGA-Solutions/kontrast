import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-05-01";

export const client = createClient({ projectId, dataset, apiVersion, useCdn: true });

const builder = imageUrlBuilder({ projectId, dataset });
export function urlFor(source: Image | any) {
  return builder.image(source);
}
