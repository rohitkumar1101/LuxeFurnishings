// app/categories/[slug]/page.tsx
// -----------------------------------------------------------------------------
// Category detail page.  NOTE:  fixed the GROQ query that blew up with the
// “string literal expected” error – the culprit was a missing space before the
// pipeline (  ] | order()  ← needs the space).  The query below is now valid.
// -----------------------------------------------------------------------------

import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = await client.fetch<{ title: string }>(
    `*[_type == "category" && slug.current == $slug][0]{ title }`,
    { slug: params.slug }
  );

  return category
    ? {
        title: `${category.title} | Products | ILF`,
        description: `Browse all products in the ${category.title} category`,
      }
    : {};
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  /*
   * GROQ fixed — note the space before the pipeline (]| order) and the quoted
   * key "products".
   */
  const query = `*[_type == "category" && slug.current == $slug][0]{
    _id,
    title,
    description,
    heroImage,

    "products": *[_type == "product" && references(^._id)] | order(title asc) {
      _id,
      title,
      slug,
      mainImage,
      productType->{title}
    }
  }`;

  const category = await client.fetch<any>(query, { slug }, { next: { revalidate: 60 } });
  if (!category) return notFound();

  const { products } = category;

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      {/* Hero banner */}
      {category.heroImage ? (
        <div className="relative mb-10 h-64 w-full overflow-hidden rounded-lg md:h-80">
          <Image
            src={urlForImage(category.heroImage).width(1600).height(640).url()}
            alt={category.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
          <h1 className="relative z-10 flex h-full items-center justify-center text-center text-4xl font-bold text-white md:text-5xl">
            {category.title}
          </h1>
        </div>
      ) : (
        <h1 className="mb-6 text-3xl font-bold md:text-4xl">{category.title}</h1>
      )}

      {category.description && (
        <div className="prose mx-auto mb-12 max-w-3xl text-center">
          {category.description}
        </div>
      )}

      {products?.length ? (
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p: any) => (
            <li key={p._id}>
              <Link href={`/products/${p.slug.current}`} prefetch={false}>
                <article className="group overflow-hidden rounded-xl bg-white shadow transition hover:shadow-lg">
                  {p.mainImage && (
                    <div className="relative aspect-square">
                      <Image
                        src={urlForImage(p.mainImage).width(500).height(500).url()}
                        alt={p.title}
                        fill
                        sizes="(max-width:768px) 100vw, 33vw"
                        className="object-cover transition group-hover:scale-105"
                      />
                    </div>
                  )}

                  <div className="p-4">
                    <h2 className="text-lg font-semibold group-hover:text-indigo-600">
                      {p.title}
                    </h2>
                    {p.productType?.title && (
                      <p className="text-sm text-gray-500">{p.productType.title}</p>
                    )}
                  </div>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No products found in this category.</p>
      )}
    </main>
  );
}
