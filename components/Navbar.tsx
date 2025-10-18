"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/categories", label: "Categories" },
  { href: "/contact", label: "Contact Us" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((prev) => !prev), []);
  const close = useCallback(() => setOpen(false), []);

  // Close on Esc when mobile menu is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Active matcher: exact; treat /categories subtree as active
  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/categories") return pathname === "/categories" || pathname.startsWith("/categories/");
    return pathname === href;
  };

  /* Tailwind groups */
  const linkBase = "font-medium text-gray-700 transition hover:text-indigo-600";
  const mobileLink = "block rounded px-2 py-2 " + linkBase + " hover:bg-gray-100";

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      {/* Shooting star layer (behind content, not clickable) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden">
        <div className="ilf-shooting-star" aria-hidden="true" />
      </div>

      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900" onClick={close}>
          <Image
            src="/images/logo.png"
            alt="Infinity Luxe Furnishings logo"
            width={60}
            height={60}
            className="mr-2 rounded-sm object-contain"
            priority
          />
          <span className="leading-none">Infinity Luxe Furnishings</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <li key={href} className={`relative ${active
                ? "after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-[var(--ilf-accent,_#B8892D)] after:shadow-[0_0_6px_rgba(184,137,45,0.35)]"
                : ""
                }`}>
                <Link
                  href={href}
                  className={`${linkBase} ${active ? "font-bold text-gray-900" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile toggle */}
        <button
          onClick={toggle}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          className="rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile panel */}
      {open && (
        <div className="md:hidden" role="dialog" aria-modal="true">
          <ul className="space-y-1 border-t bg-white px-4 py-4">
            {NAV_LINKS.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <li key={href} className={`${active ? "font-semibold text-gray-900 bg-gray-100" : ""}`}>
                  <Link
                    href={href}
                    className={`${mobileLink} `}
                    aria-current={active ? "page" : undefined}
                    onClick={close}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Styled-JSX for the shooting star across the whole navbar */}
      <style jsx>{`
        .ilf-shooting-star {
          position: absolute;
          bottom: 8px;            /* runs along the bottom edge of the navbar */
          left: -7rem;            /* start slightly offscreen */
          width: 7rem;            /* tail length */
          height: 2px;
          border-radius: 9999px;
          background: linear-gradient(
            90deg,
            var(--ilf-accent, #B8892D) 0%,
            rgba(184, 137, 45, 0.45) 55%,
            rgba(184, 137, 45, 0) 100%
          );
          box-shadow: 0 0 8px rgba(184, 137, 45, 0.5);
          opacity: 0.55;          /* subtle */
          animation: ilfShoot 4.5s linear infinite; /* 2× speed */
          animation-delay: 1.2s;
        }
        .ilf-shooting-star::after {
          /* glowing head */
          content: '';
          position: absolute;
          right: -3px;
          top: -3px;
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: var(--ilf-accent, #B8892D);
          box-shadow:
            0 0 10px rgba(184, 137, 45, 0.9),
            0 0 18px rgba(184, 137, 45, 0.35);
        }
        @keyframes ilfShoot {
          0%   { transform: translateX(-12vw); opacity: 0; }
          10%  { opacity: 0.5; }
          85%  { opacity: 0.5; }
          100% { transform: translateX(112vw); opacity: 0; }
        }
        @media (max-width: 767px) {
          .ilf-shooting-star { bottom: 6px; width: 6rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ilf-shooting-star { animation: none; opacity: 0; }
        }
      `}</style>
    </header>
  );
}
