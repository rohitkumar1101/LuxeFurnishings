// app/products/page.tsx
// ---------------------------------------------
// Server component that fetches every Product
// from Sanity and renders a responsive grid.
// ---------------------------------------------
// Prerequisites:
//   1. A configured Sanity client in `sanity/lib/client.ts`
//   2. NEXT_PUBLIC_SANITY_PROJECT_ID & NEXT_PUBLIC_SANITY_DATASET env vars
//   3. Next.js App Router + TailwindCSS (already in your project)

import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { SanityDocument } from "next-sanity";
import { urlForImage } from "@/sanity/lib/image";

/**
 * Minimal Product type for this grid.
 * Extend as you add more fields (price, variants, etc.).
 */
interface Product extends SanityDocument {
  title: string;
  slug: { current: string };
  mainImage?: any;
  productType?: { title: string };
  categories?: { title: string }[];
}

/**
 * GROQ query that pulls:
 *  – _id (React key)
 *  – title & slug (for display + URL)
 *  – mainImage asset + hotspot
 *  – referenced productType & categories titles
 */
const productsQuery = `*[_type == "product"]{
  _id,
  title,
  slug,
  mainImage,
  productType->{title},
  categories[]->{title}
}`;

export default async function Products() {
  // ✨ Fetch once per build & revalidate every 60 s
  const products: Product[] = await client.fetch(productsQuery, {}, {
      next: { revalidate: 60 },
    });
    console.log('products: ', products);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-8 text-center text-3xl font-bold md:text-4xl">
        Products
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <li key={product._id}>
              <Link href={`/products/${product.slug.current}`}> {/* product detail route */}
                <article className="group overflow-hidden rounded-xl bg-white shadow transition hover:shadow-lg">
                  {product.mainImage && (
                    <div className="relative aspect-square">
                      <Image
                        src={urlForImage(product.mainImage).width(500).height(500).url()}
                        alt={product.title}
                        fill
                        sizes="(max-width:768px) 100vw, (max-width:1280px) 33vw, 25vw"
                        className="object-cover transition group-hover:scale-105"
                        // placeholder="blur"
                        // blurDataURL={product.mainImage.metadata?.lqip}
                      />
                    </div>
                  )}

                  <div className="p-4">
                    <h2 className="text-lg font-semibold">{product.title}</h2>
                    {product.productType?.title && (
                      <p className="text-sm text-gray-500">
                        {product.productType.title}
                      </p>
                    )}
                  </div>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
