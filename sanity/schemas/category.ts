import { defineType } from "sanity";

export default defineType({
    name: 'category',
    title: 'Category',
    type: 'document',
    fields: [
      {name: 'title', type: 'string'},
      {name: 'slug',  type: 'slug',  options: {source: 'title'}},
      {
        name: 'parent',
        title: 'Parent category',
        type: 'reference',
        to: [{type: 'category'}],
      },
      {name: 'heroImage', type: 'image', options: {hotspot: true}},
      {name: 'description', type: 'string'},
    ],
  });