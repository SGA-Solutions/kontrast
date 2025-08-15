import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Title' }),
    defineField({ name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title' } }),
    defineField({ name: 'featured', type: 'boolean', title: 'Featured' }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'projectCategory' }] }],
    }),
    defineField({ name: 'client', title: 'Beställare (Client)', type: 'string' }),
    defineField({ name: 'assignment', title: 'Uppdrag (Assignment)', type: 'string' }),
    defineField({ name: 'location', title: 'Plats (Location)', type: 'string' }),
    defineField({ name: 'status', title: 'Status', type: 'string' }),
    defineField({ name: 'startDate', title: 'Start Date', type: 'date' }),
    defineField({ name: 'endDate', title: 'End Date', type: 'date' }),
    defineField({ name: 'summary', title: 'Summary', type: 'text' }),
    defineField({ name: 'body', title: 'Body', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        { type: 'image', options: { hotspot: true } },
        { type: 'beforeAfter' },
      ],
    }),
    defineField({ name: 'seoTitle', type: 'string', title: 'SEO Title' }),
    defineField({ name: 'seoDescription', type: 'text', title: 'SEO Description' }),
  ],
});
