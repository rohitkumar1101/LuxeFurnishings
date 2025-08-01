"use client";
// components/Navbar.tsx (optimised)
// -----------------------------------------------------------------------------
// • Single source-of-truth for nav links (map ⇒ no duplication)
// • Memoised callbacks to avoid re-renders
// • ARIA-friendly toggle with esc-to-close & focus retention reset
// • Tailwind classes extracted into variables for readability
// • Same visual design; zero external deps beyond lucide-react
// -----------------------------------------------------------------------------

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/products",   label: "Products"   },
  { href: "/categories", label: "Categories" },
  { href: "/contact",    label: "Contact Us" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((prev) => !prev), []);
  const close  = useCallback(() => setOpen(false), []);

  // 📦  Close on Esc when mobile menu is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  /* Tailwind groups */
  const linkBase = "font-medium text-gray-700 transition hover:text-indigo-600";
  const mobileLink =
    "block rounded px-2 py-2 " + linkBase + " hover:bg-gray-100";

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
        {/* Brand */}
        <Link href="/" className="text-xl font-bold text-gray-900" onClick={close}>
          Infinity Luxe Furnishings
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={linkBase}>
                {label}
              </Link>
            </li>
          ))}
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
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={mobileLink} onClick={close}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}