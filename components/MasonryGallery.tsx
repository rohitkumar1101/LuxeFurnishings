"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export default function MasonryGallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(() =>
    setActive(i => (i !== null ? (i - 1 + images.length) % images.length : null)),
    [images.length]);
  const next = useCallback(() =>
    setActive(i => (i !== null ? (i + 1) % images.length : null)),
    [images.length]);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")      close();
      if (e.key === "ArrowLeft")   prev();
      if (e.key === "ArrowRight")  next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close, prev, next]);

  return (
    <>
      {/* ── Masonry grid ── */}
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Open ${img.alt}`}
            className="group mb-4 block w-full cursor-zoom-in break-inside-avoid overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-800"
          >
            <div className="relative overflow-hidden rounded-xl">
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                className="h-auto w-full object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 rounded-xl bg-black/0 transition duration-300 group-hover:bg-black/15" />
            </div>
          </button>
        ))}
      </div>

      {/* ── Lightbox ── */}
      {active !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-sm"
          onClick={close}
        >
          {/* image */}
          <div
            className="relative mx-4 max-h-[88vh] max-w-5xl"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={images[active].src}
              alt={images[active].alt}
              width={images[active].width}
              height={images[active].height}
              className="max-h-[88vh] w-auto rounded-lg object-contain shadow-2xl"
              priority
            />

            {/* counter */}
            <p className="absolute bottom-3 left-1/2 -translate-x-1/2 tabular-nums text-sm text-white/50">
              {active + 1} / {images.length}
            </p>
          </div>

          {/* close */}
          <button
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <X size={22} />
          </button>

          {/* prev */}
          {images.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); prev(); }}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <ChevronLeft size={36} />
            </button>
          )}

          {/* next */}
          {images.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); next(); }}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <ChevronRight size={36} />
            </button>
          )}
        </div>
      )}
    </>
  );
}
