import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interiors | Infinity Luxe Furnishings",
  description: "Explore our interior collections crafted by ILF.",
};

interface InteriorCard {
  _id: string;
  title: string;
  slug: { current: string };
  heroImage?: any;
  productCount: number;
}

const query = `*[_type == "interior"] | order(title asc) {
  _id,
  title,
  slug,
  heroImage,
  "productCount": count(*[_type == "product" && references(^._id)])
}`;

export default async function InteriorsPage() {
  const interiors = await client.fetch<InteriorCard[]>(query, {}, { next: { revalidate: 60 } });

  return (
    <main className="mx-auto px-4 py-12 relative bg-gray-50 pt-20 pb-20 px-4 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-center text-3xl font-bold md:text-4xl">Interiors</h1>

      {interiors.length === 0 ? (
        <p className="text-center text-gray-500">No interiors found.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {interiors.map((item) => (
            <li key={item._id}>
              <Link href={`/interiors/${item.slug.current}`} prefetch={false}>
                <article className="group relative h-80 overflow-hidden rounded-2xl shadow-md md:h-[480px]">
                  {item.heroImage ? (
                    <Image
                      src={urlForImage(item.heroImage).width(900).height(700).url()}
                      alt={item.title}
                      fill
                      sizes="(max-width:640px) 100vw, 50vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-neutral-300" />
                  )}

                  {/* gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                  {/* hover darken */}
                  <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/20" />

                  <div className="absolute bottom-0 left-0 p-7 text-white">
                    <h2 className="text-3xl font-bold tracking-tight drop-shadow md:text-4xl">
                      {item.title}
                    </h2>
                    <span className="mt-3 inline-flex translate-y-2 items-center gap-2 text-sm font-medium uppercase tracking-widest opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      Explore
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
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
