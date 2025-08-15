import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Title' }),
    defineField({ name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title' } }),
    defineField({ name: 'intro', type: 'text', title: 'Intro' }),
    defineField({ name: 'body', type: 'array', title: 'Body', of: [{ type: 'block' }] }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        { type: 'image', options: { hotspot: true } },
      ],
    }),
    defineField({ name: 'seoTitle', type: 'string', title: 'SEO Title' }),
    defineField({ name: 'seoDescription', type: 'text', title: 'SEO Description' }),
  ],
});
