import { defineType } from "sanity";

export default defineType({
    name: 'material',
    title: 'Material',
    type: 'document',
    fields: [
      {name: 'title', type: 'string'},
      {name: 'slug',  type: 'slug',  options: {source: 'title'}},
      {name: 'texture', type: 'image'},
    ],
  });