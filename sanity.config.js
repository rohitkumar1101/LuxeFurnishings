'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/admin/[[...tool]]/page.jsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {media, mediaAssetSource} from 'sanity-plugin-media'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './sanity/env'
import {schema} from './sanity/schemaTypes'
import {structure} from './sanity/structure'

import product from './sanity/schemas/product'
import category from './sanity/schemas/category'
import interior from './sanity/schemas/interior'
import productType from './sanity/schemas/productType'
import material from './sanity/schemas/material'
import productVariant from './sanity/schemas/productVariant'

export default defineConfig({
  basePath: '/admin',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema: {
    types: [
      product,
      category,
      interior,
      productType,
      material,
      productVariant,
    ],
  },
  plugins: [
    structureTool({structure}),
    visionTool({defaultApiVersion: apiVersion}),
    media(),
  ],
  form: {
    image: {
      assetSources: previousAssetSources => [...previousAssetSources, mediaAssetSource],
    },
  },
})
