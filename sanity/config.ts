import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET as string;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-05-01';

if (!projectId || !dataset) {
  console.warn('[sanity/config] Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET');
}

export default defineConfig({
  name: 'default',
  title: 'Kontrast Studio',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [deskTool(), visionTool({ defaultApiVersion: apiVersion, defaultDataset: dataset, projectId })],
  schema: {
    types: schemaTypes,
  },
});
