import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Title' }),
    defineField({ name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title' } }),
    defineField({ name: 'author', type: 'string', title: 'Author' }),
    defineField({ name: 'publishedAt', type: 'datetime', title: 'Published At' }),
    defineField({ name: 'excerpt', type: 'text', title: 'Excerpt' }),
    defineField({ name: 'body', type: 'array', title: 'Body', of: [{ type: 'block' }] }),
    defineField({ name: 'mainImage', type: 'image', title: 'Main Image', options: { hotspot: true } }),
    defineField({ name: 'tags', type: 'array', title: 'Tags', of: [{ type: 'string' }] }),
    defineField({ name: 'seoTitle', type: 'string', title: 'SEO Title' }),
    defineField({ name: 'seoDescription', type: 'text', title: 'SEO Description' }),
  ],
});
