// app/categories/page.tsx
// -----------------------------------------------------------------------------
// Lists every Category in a responsive grid. Each card links to /categories/[slug].
// -----------------------------------------------------------------------------

import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories | Infinity Luxe Furnishings",
  description: "Explore all product categories crafted by ILF.",
};

interface CategoryCard {
  _id: string;
  title: string;
  slug: { current: string };
  heroImage?: any;
  productCount: number;
}

const categoryQuery = `*[_type == "category"] | order(title asc) {
  _id,
  title,
  slug,
  heroImage,
  "productCount": count(*[_type == "product" && references(^._id)])
}`;

function CardGrid({ items, basePath }: { items: CategoryCard[]; basePath: string }) {
  return (
    <ul className="
      grid justify-center gap-6
      [grid-template-columns:repeat(auto-fit,minmax(260px,260px))]
    ">
      {items.map((item) => (
        <li key={item._id}>
          <Link href={`/${basePath}/${item.slug.current}`} prefetch={false}>
            <article className="group overflow-hidden rounded-xl bg-white shadow transition hover:shadow-lg">
              {item.heroImage ? (
                <div className="relative aspect-square">
                  <Image
                    src={urlForImage(item.heroImage).width(500).height(500).url()}
                    alt={item.title}
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover transition group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="flex aspect-square items-center justify-center bg-gray-100">
                  <span className="text-sm text-gray-500">No image</span>
                </div>
              )}

              <div className="p-4">
                <h2 className="text-lg font-semibold group-hover:text-indigo-600">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {item.productCount} product{item.productCount === 1 ? "" : "s"}
                </p>
              </div>
            </article>
          </Link>
        </li>
      ))}
    </ul>
  );
}


export default async function CategoriesPage() {
  const categories = await client.fetch<CategoryCard[]>(categoryQuery, {}, { next: { revalidate: 60 } });

  return (
    <main className="mx-auto px-4 py-12 relative bg-gray-50 pt-20 pb-20 px-4 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-center text-3xl font-bold md:text-4xl">Categories</h1>

      {categories.length === 0 ? (
        <p className="text-center text-gray-500">No categories found.</p>
      ) : (
        <CardGrid items={categories} basePath="categories" />
      )}
    </main>
  );
}
