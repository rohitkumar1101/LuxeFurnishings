import { defineType } from "sanity";

export default defineType({
  name: 'interior',
  title: 'Interior',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'heroImage', type: 'image', options: { hotspot: true } },
    { name: 'description', type: 'string' },
    {
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    },
  ],
});
