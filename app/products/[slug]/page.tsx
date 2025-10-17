// app/products/[slug]/page.tsx
// -----------------------------------------------------------------------------
// Product detail page (Server Component). Shows gallery, specs, variants, etc.
// -----------------------------------------------------------------------------

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PortableText } from "@portabletext/react";

import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import WhatsAppShare from "@/components/WhatsappShare";

// Helper: ensure absolute URLs (for OG/canonical)
const absolute = (u?: string) => {
  if (!u) return undefined;
  if (/^https?:\/\//i.test(u)) return u;
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  return `${base}${u.startsWith("/") ? u : `/${u}`}`;
};

// Next 15+: await params
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;

  const product = await client.fetch<{ title?: string; mainImage?: any }>(
    `*[_type == "product" && slug.current == $slug][0]{ title, mainImage }`,
    { slug }
  );

  const title = product?.title ? `${product.title} | ILF` : "Product | ILF";
  const ogImg = product?.mainImage
    ? urlForImage(product.mainImage).width(1200).height(630).fit("crop").url()
    : undefined;

  const canonical = absolute(`/products/${slug}`);

  return {
    title,
    alternates: { canonical },
    openGraph: {
      type: "website", // Next's typing doesn't allow "product"
      title,
      url: canonical,
      images: ogImg ? [{ url: absolute(ogImg)!, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      images: ogImg ? [absolute(ogImg)!] : [],
    },
  };
}

export default async function ProductDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

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

  const mainImageUrl = product.mainImage
    ? urlForImage(product.mainImage).width(800).height(800).url()
    : "/images/placeholders/product-placeholder.jpg";

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      {/* Title & breadcrumbs */}
      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/categories" className="hover:underline">
          Categories
        </Link>
        {product.categories?.map((cat: any) => (
          <span key={cat.slug.current}>
            {" / "}
            <Link href={`/categories/${cat.slug.current}`} className="hover:underline">
              {cat.title}
            </Link>
          </span>
        ))}
      </nav>

      <h1 className="mb-6 text-3xl font-bold">{product.title}</h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Image gallery */}
        <div>
          {mainImageUrl && (
            <Image
              src={mainImageUrl}
              alt={product.title}
              width={800}
              height={800}
              className="mb-4 w-full rounded-lg object-cover"
              priority
            />
          )}
          {product.gallery && product.gallery.length > 0 && (
            <ul className="grid grid-cols-3 gap-2">
              {product.gallery.map((img: any) => {
                const gUrl = urlForImage(img).width(300).height(300).url();
                return (
                  <li key={img._key} className="relative aspect-square overflow-hidden rounded">
                    <Image
                      src={gUrl}
                      alt={product.title}
                      width={300}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </li>
                );
              })}
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
          {!!product.materials?.length && (
            <p className="mb-4 text-sm text-gray-600">
              Materials: {product.materials.map((m: any) => m.title).join(", ")}
            </p>
          )}

          {/* Rich description */}
          {!!product.description && (
            <div className="prose max-w-none">
              <PortableText value={product.description} />
            </div>
          )}

          {/* Specs table */}
          {!!product.specs?.length && (
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

          {/* 🔽 Quote CTA directly UNDER the description */}
          <div className="mt-10">
            <p className="text-sm text-gray-700">
              Pricing varies with size, fabric and finish. Message us on WhatsApp to get a{" "}
              <strong>personalized quote for {product.title}</strong>.
            </p>
            <div className="mt-3">
              <WhatsAppShare
                phone={process.env.NEXT_PUBLIC_WHATSAPP_PHONE}
                productName={product.title}
                preset={`Hi! I'd like a quote for "${product.title}". Please share current pricing and available options.`}
                label="Get Quote on WhatsApp"
                className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-3 text-white shadow hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              />
            </div>
          </div>

          {/* Variants */}
          {!!product.variants?.length && (
            <div className="mt-8">
              <h2 className="mb-2 text-lg font-semibold">Variants</h2>
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {product.variants.map((v: any) => (
                  <li key={v._key} className="rounded border p-2 text-center shadow-sm">
                    {v.image && (
                      <div className="relative mb-2 aspect-square overflow-hidden rounded">
                        <Image
                          src={typeof v.image === "string" ? v.image : urlForImage(v.image).url()}
                          alt={v.title ?? product.title}
                          fill
                          sizes="(max-width: 640px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <span className="text-sm font-medium">{v.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Downloads */}
          {!!product.downloads?.length && (
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
