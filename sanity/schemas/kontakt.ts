import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'kontakt',
  title: 'Kontakt',
  type: 'document',
  fields: [
    defineField({
      name: 'companyName',
      type: 'string',
      title: 'Company Name',
      description: 'e.g. Kontrast AB',
    }),
    defineField({
      name: 'email',
      type: 'string',
      title: 'Email',
    }),
    defineField({
      name: 'phone',
      type: 'string',
      title: 'Phone',
    }),
    defineField({
      name: 'address',
      type: 'text',
      title: 'Address',
      description: 'Full address (line breaks supported)',
    }),
    defineField({
      name: 'businessHours',
      type: 'string',
      title: 'Business Hours',
      description: 'e.g. 09:00-18:00',
    }),
    defineField({
      name: 'mapEmbedUrl',
      type: 'url',
      title: 'Google Maps Embed URL',
      description: 'The src URL for the Google Maps iframe embed',
      validation: (Rule) => Rule.uri({ allowRelative: false, scheme: ['https'] }),
    }),
  ],
  preview: {
    select: {
      title: 'companyName',
    },
  },
});
