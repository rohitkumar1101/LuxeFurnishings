import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import { apiVersion, dataset, projectId } from '../env';

export const client = createClient({ projectId, dataset, apiVersion, useCdn: true });

const builder = imageUrlBuilder({ projectId, dataset });

/** Build a Sanity image URL you can hand to <Image src={…}/> */
export function urlForImage(source) {
  return builder.image(source).auto('format').fit('max');
}
