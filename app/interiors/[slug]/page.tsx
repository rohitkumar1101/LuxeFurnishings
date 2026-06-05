import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import MasonryGallery, { type GalleryImage } from "@/components/MasonryGallery";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { title } =
    (await client.fetch<{ title: string }>(
      `*[_type=="interior" && slug.current==$slug][0]{title}`,
      { slug: params.slug }
    )) ?? {};

  return {
    title: title ? `${title} | Interiors | ILF` : "Interior | ILF",
    description: title && `Browse all products in the ${title} interior.`,
  };
}

// Replace these with Sanity gallery images once uploaded
const DUMMY_IMAGES: GalleryImage[] = [
  { src: "https://picsum.photos/seed/101/900/600",  alt: "Interior view 1",  width: 900,  height: 600 },
  { src: "https://picsum.photos/seed/102/600/900",  alt: "Interior view 2",  width: 600,  height: 900 },
  { src: "https://picsum.photos/seed/103/800/530",  alt: "Interior view 3",  width: 800,  height: 530 },
  { src: "https://picsum.photos/seed/104/600/800",  alt: "Interior view 4",  width: 600,  height: 800 },
  { src: "https://picsum.photos/seed/105/1000/620", alt: "Interior view 5",  width: 1000, height: 620 },
  { src: "https://picsum.photos/seed/106/600/750",  alt: "Interior view 6",  width: 600,  height: 750 },
  { src: "https://picsum.photos/seed/107/850/560",  alt: "Interior view 7",  width: 850,  height: 560 },
  { src: "https://picsum.photos/seed/108/580/870",  alt: "Interior view 8",  width: 580,  height: 870 },
  { src: "https://picsum.photos/seed/109/920/580",  alt: "Interior view 9",  width: 920,  height: 580 },
];

export default async function InteriorPage({ params }: any) {
  const { slug } = params;

  const query = `*[_type == "interior" && slug.current == $slug][0]{
    _id,
    title,
    description,
    heroImage,
    gallery,
  }`;

  const interior = await client.fetch<any>(query, { slug }, { next: { revalidate: 60 } });
  if (!interior) return notFound();

  const galleryImages: GalleryImage[] = interior.gallery?.length
    ? interior.gallery.map((img: any, i: number) => ({
        src: urlForImage(img).width(1200).url(),
        alt: `${interior.title} gallery image ${i + 1}`,
        width: 1200,
        height: 800,
      }))
    : DUMMY_IMAGES;

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">

      {/* Hero banner */}
      {interior.heroImage ? (
        <div className="relative mb-10 h-64 w-full overflow-hidden rounded-2xl md:h-96">
          <Image
            src={urlForImage(interior.heroImage).width(1600).height(640).url()}
            alt={interior.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Interior</p>
            <h1 className="text-4xl font-bold text-white drop-shadow md:text-5xl">{interior.title}</h1>
          </div>
        </div>
      ) : (
        <h1 className="mb-6 text-3xl font-bold md:text-4xl">{interior.title}</h1>
      )}

      {interior.description && (
        <p className="mx-auto mb-12 max-w-2xl text-center text-gray-500">{interior.description}</p>
      )}

      {/* Gallery */}
      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-900">Gallery</h2>
        <MasonryGallery images={galleryImages} />
      </section>


    </main>
  );
}
