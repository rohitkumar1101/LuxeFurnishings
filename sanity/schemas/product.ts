import { defineType } from "sanity";

export default defineType({
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
      /*  Essentials  */
      {name: 'title', title: 'Name', type: 'string', validation: Rule => Rule.required()},
      {name: 'slug',  title: 'Slug', type: 'slug',  options: {source: 'title', maxLength: 96}},
      {name: 'sku',   title: 'SKU',  type: 'string'},
  
      /*  Relationships  */
      {
        name: 'categories',
        title: 'Categories',
        type: 'array',
        of: [{type: 'reference', to: [{type: 'category'}]}],
      },
      {
        name: 'productType',
        title: 'Product Type',
        type: 'reference',
        to: [{type: 'productType'}],
      },
      {
        name: 'materials',
        title: 'Materials',
        type: 'array',
        of: [{type: 'reference', to: [{type: 'material'}]}],
      },
  
      /*  Media  */
      {name: 'mainImage', title: 'Main image', type: 'image', options: {hotspot: true}},
      {
        name: 'gallery',
        title: 'Gallery',
        type: 'array',
        of: [{type: 'image', options: {hotspot: true}}],
      },
  
      /*  Rich content  */
      {name: 'description', title: 'Description', type: 'string'},
      {
        name: 'specs',
        title: 'Specifications',
        type: 'array',
        of: [
          {type: 'object',
           fields: [
             {name: 'label', type: 'string'},
             {name: 'value', type: 'string'},
           ],
          },
        ],
      },
  
      /*  Variants (colour, finish, size, price, SKU override)  */
      {
        name: 'variants',
        title: 'Variants',
        type: 'array',
        of: [{type: 'productVariant'}],
      },
  
      /*  Downloads  */
      {
        name: 'downloads',
        title: 'Downloads (PDF, DWG)',
        type: 'array',
        of: [{type: 'file'}],
      },
  
      /*  Flags  */
      {name: 'isFeatured', title: 'Featured', type: 'boolean', initialValue: false},
    ],
  });
  