import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'beforeAfter',
  title: 'Before / After',
  type: 'object',
  fields: [
    defineField({ name: 'beforeImage', title: 'Before Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'afterImage', title: 'After Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'caption', title: 'Caption', type: 'string' }),
  ],
  preview: {
    select: {
      media: 'afterImage',
      caption: 'caption',
    },
    prepare: ({ media, caption }) => ({
      title: caption || 'Before / After',
      media,
    }),
  },
});
