"use client"

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const images = [
  "/images/1.jpeg",
  "/images/2.jpeg",
  "/images/3.jpeg",
  "/images/4.jpeg",
  "/images/5.jpeg",
  "/images/6.jpeg",
  "/images/7.jpeg",
  "/images/8.jpeg",
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="hero" className="relative h-[90vh] w-full overflow-hidden">
      {/* Image carousel */}
      <AnimatePresence initial={false} mode="wait">
        <motion.img
          key={images[index]}
          src={images[index]}
          alt="ILF workspace furniture hero graphic"
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        />
      </AnimatePresence>

      {/* Dark overlay to improve text contrast */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Copy + CTAs */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 text-center text-white">
        <h1 className="mb-4 text-3xl font-bold md:text-5xl">
          Premium Office Furniture Manufacturer in Bangalore
        </h1>
        <p className="mb-8 max-w-2xl text-lg md:text-2xl">
          From co‑working spaces to PGs, ILF is a trusted B2B furniture supplier
          delivering factory‑direct, custom office furniture on time — without
          retail markups or showroom delays.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="rounded-lg bg-white px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-200"
          >
            Get a Quote
          </Link>
        </div>
      </div>
    </section>
  );
}
