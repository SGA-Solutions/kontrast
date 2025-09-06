import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'image360',
  title: '360° Image',
  type: 'object',
  fields: [
    defineField({ 
      name: 'image', 
      title: '360° Image', 
      type: 'image', 
      options: { hotspot: true },
      description: 'Upload a 360° panoramic image. Works best with equirectangular projection images.'
    }),
    defineField({ 
      name: 'caption', 
      title: 'Caption', 
      type: 'string' 
    }),
  ],
  preview: {
    select: {
      media: 'image',
      caption: 'caption',
    },
    prepare: ({ media, caption }) => ({
      title: caption || '360° Image',
      media,
    }),
  },
});
