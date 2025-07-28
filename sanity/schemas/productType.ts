import { defineType } from "sanity";

export default defineType({
    name: 'productType',
    title: 'Product Type',
    type: 'document',
    fields: [
      {name: 'title', type: 'string'},
      {name: 'slug',  type: 'slug',  options: {source: 'title'}},
      {name: 'icon',  type: 'image'},
      {name: 'order', type: 'number'},
    ],
  });