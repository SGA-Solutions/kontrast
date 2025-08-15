import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Site Title' }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({ name: 'defaultOgImage', type: 'image', title: 'Default OG Image' }),
    defineField({
      name: 'nav',
      title: 'Navigation',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', type: 'string', title: 'Label' },
          { name: 'href', type: 'string', title: 'Href' },
        ],
      }],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'platform', type: 'string', title: 'Platform' },
          { name: 'url', type: 'url', title: 'URL' },
        ],
      }],
    }),
    defineField({ name: 'address', type: 'string', title: 'Address' }),
    defineField({ name: 'email', type: 'string', title: 'Email' }),
    defineField({ name: 'phone', type: 'string', title: 'Phone' }),
    defineField({
      name: 'assets',
      title: 'Assets',
      type: 'array',
      of: [
        { type: 'image', options: { hotspot: true } },
      ],
    }),
  ],
});
