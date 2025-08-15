import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', title: 'Name' }),
    defineField({ name: 'role', type: 'string', title: 'Role' }),
    defineField({ name: 'bio', type: 'array', title: 'Bio', of: [{ type: 'block' }] }),
    defineField({ name: 'headshot', type: 'image', title: 'Headshot', options: { hotspot: true } }),
    defineField({ name: 'email', type: 'string', title: 'Email' }),
    defineField({ name: 'linkedin', type: 'url', title: 'LinkedIn' }),
  ],
});
