import { defineType } from "sanity";

export default defineType({
    name: 'productVariant',
    title: 'Variant',
    type: 'object',
    fields: [
      {name: 'title',   type: 'string'}, // e.g. "Black / Metal"
      {name: 'sku',     type: 'string'},
      {name: 'price',   type: 'number'}, // optional
      {name: 'image',   type: 'image', options: {hotspot: true}},
      {name: 'dimensions', type: 'string'}, // "W 450 × D 520 × H 800 mm"
    ],
  });