// app/products/[slug]/page.tsx
// -----------------------------------------------------------------------------
// Product detail page (Server Component). Shows gallery, specs, variants, etc.
// -----------------------------------------------------------------------------

import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { urlForImage } from "@/sanity/lib/image";
import Link from "next/link";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const product = await client.fetch<{ title: string }>(
    `*[_type == "product" && slug.current == $slug][0]{ title }`,
    { slug: params.slug }
  );
  return {
    title: product?.title ? `${product.title} | ILF` : "Product | ILF",
  };
}

export default async function ProductDetailPage({
  params,
}: any) {
  const { slug } = params;

  const query = `*[_type == "product" && slug.current == $slug][0]{
    _id,
    title,
    mainImage,
    gallery,
    productType->{title, slug},
    categories[]->{title, slug},
    materials[]->{title, slug},
    description,
    specs,
    variants,
    downloads
  }`;

  const product = await client.fetch<any>(query, { slug });
  if (!product) return notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      {/* Title & breadcrumbs */}
      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/products" className="hover:underline">
          Products
        </Link>
        {product.categories?.map((cat: any) => (
          <span key={cat.slug.current}>
            {" / "}
            <a href={`/products?category=${cat.slug.current}`} className="hover:underline">
              {cat.title}
            </a>
          </span>
        ))}
      </nav>

      <h1 className="mb-6 text-3xl font-bold">{product.title}</h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Image gallery */}
        <div>
          {product.mainImage && (
            <Image
              src={urlForImage(product.mainImage).width(500).height(500).url()}
              alt={product.title}
              width={800}
              height={800}
              className="mb-4 w-full rounded-lg object-cover"
            />
          )}
          {product.gallery && (
            <ul className="grid grid-cols-3 gap-2">
              {product.gallery.map((img: any) => (
                <li key={img._key} className="relative aspect-square overflow-hidden rounded">
                  <Image src={urlForImage(img).width(300).height(300).url()} alt={product.title} fill className="object-cover" />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Details */}
        <div>
          {/* Type & materials */}
          {product.productType && (
            <p className="mb-2 text-sm text-gray-600">
              Type: {product.productType.title}
            </p>
          )}
          {product.materials?.length && (
            <p className="mb-4 text-sm text-gray-600">
              Materials: {product.materials.map((m: any) => m.title).join(", ")}
            </p>
          )}

          {/* Rich description */}
          {product.description && (
            <div className="prose max-w-none">
              <PortableText value={product.description} />
            </div>
          )}

          {/* Specs table */}
          {product.specs?.length && (
            <table className="mt-6 w-full text-sm">
              <tbody>
                {product.specs.map((spec: any) => (
                  <tr key={spec._key} className="border-b">
                    <th className="py-2 pr-4 text-left font-medium">{spec.label}</th>
                    <td className="py-2 text-gray-700">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Variants */}
          {product.variants?.length && (
            <div className="mt-8">
              <h2 className="mb-2 text-lg font-semibold">Variants</h2>
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {product.variants.map((v: any) => (
                  <li
                    key={v._key}
                    className="rounded border p-2 text-center shadow-sm"
                  >
                    {v.image && (
                      <div className="relative mb-2 aspect-square overflow-hidden rounded">
                        <Image src={v.image} alt={v.title} fill className="object-cover" />
                      </div>
                    )}
                    <span className="text-sm font-medium">{v.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Downloads */}
          {product.downloads?.length && (
            <div className="mt-8">
              <h2 className="mb-2 text-lg font-semibold">Downloads</h2>
              <ul className="list-inside list-disc text-sm text-indigo-600">
                {product.downloads.map((d: any) => (
                  <li key={d._key}>
                    <a href={d.asset.url} target="_blank" rel="noopener noreferrer">
                      {d.asset.originalFilename}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
