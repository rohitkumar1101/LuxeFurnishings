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

const query = `*[_type == "category"] | order(title asc) {
  _id,
  title,
  slug,
  heroImage,
  "productCount": count(*[_type == "product" && references(^._id)])
}`;

export default async function CategoriesPage() {
  const categories: CategoryCard[] = await client.fetch(query, {}, {
    next: { revalidate: 60 },
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-center text-3xl font-bold md:text-4xl">Categories</h1>

      {categories.length === 0 ? (
        <p className="text-center text-gray-500">No categories found.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => (
            <li key={cat._id}>
              <Link href={`/categories/${cat.slug.current}`} prefetch={false}>
                <article className="group overflow-hidden rounded-xl bg-white shadow transition hover:shadow-lg">
                  {cat.heroImage && (
                    <div className="relative aspect-square">
                      <Image
                        src={urlForImage(cat.heroImage).width(500).height(500).url()}
                        alt={cat.title}
                        fill
                        sizes="(max-width:768px) 100vw, 33vw"
                        className="object-cover transition group-hover:scale-105"
                      />
                    </div>
                  )}

                  {!cat.heroImage && (
                    <div className="flex aspect-square items-center justify-center bg-gray-100">
                      <span className="text-sm text-gray-500">No image</span>
                    </div>
                  )}

                  <div className="p-4">
                    <h2 className="text-lg font-semibold group-hover:text-indigo-600">
                      {cat.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {cat.productCount} product{cat.productCount === 1 ? "" : "s"}
                    </p>
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
