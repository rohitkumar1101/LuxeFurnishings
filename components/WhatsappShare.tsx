'use client';
import { useEffect, useMemo, useState } from 'react';

type WhatsAppShareProps = {
  /** Optional business number. Ex: "919900112233". If omitted, opens WhatsApp share sheet. */
  phone?: string;
  /** Optional message. Category name will be appended if you pass it. */
  preset?: string;
  /** Optional label text on the button */
  label?: string;
  /** Optional category name to include in the message */
  productName?: string;
  /** Optional extra classes */
  className?: string;
};

export default function WhatsAppShare({
  phone,
  preset,
  label = 'WhatsApp',
  productName,
  className,
}: WhatsAppShareProps) {
  const [pageUrl, setPageUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPageUrl(window.location.href);
    }
  }, []);

  const text = useMemo(() => {
    const base =
      preset ??
      `Hi! Can you share more details about this product? ${productName ?? 'this category'} on Infinity Luxe Furnishings.`;
    return encodeURIComponent(`${base}\n\nLink: ${pageUrl}`);
  }, [preset, productName, pageUrl]);

  const base = phone ? `https://wa.me/${phone}` : 'https://wa.me';
  const href = `${base}?text=${text}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Share on WhatsApp"
      className={
        className ??
        'fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full px-4 py-3 text-white bg-green-600 shadow-lg'
      }
    >
      {/* Simple WhatsApp icon (inline SVG) */}
      <svg width="18" height="18" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M19.11 17.27c-.27-.14-1.57-.77-1.81-.86-.24-.09-.42-.14-.6.14-.18.27-.69.86-.84 1.04-.15.18-.31.2-.58.07-.27-.14-1.12-.41-2.13-1.31-.79-.7-1.32-1.56-1.47-1.83-.15-.27-.02-.42.11-.55.11-.11.24-.27.36-.4.12-.13.16-.22.24-.36.08-.14.04-.27-.02-.4-.07-.14-.6-1.45-.82-1.99-.22-.53-.45-.45-.6-.46h-.51c-.16 0-.4.06-.61.29-.21.22-.8.78-.8 1.9 0 1.12.82 2.22.93 2.37.11.16 1.62 2.48 3.92 3.49 2.31 1.01 2.31.67 2.73.63.42-.04 1.38-.56 1.58-1.11.2-.55.2-1.02.14-1.11-.06-.09-.23-.15-.5-.29z" />
        <path d="M27.54 4.46C24.56 1.49 20.63 0 16.5 0 7.39 0 .01 7.37.01 16.47c0 2.9.76 5.73 2.2 8.22L0 32l7.49-2.18c2.41 1.31 5.13 2 7.9 2h.01c9.1 0 16.48-7.38 16.48-16.49 0-4.13-1.61-8.01-4.34-10.87zm-11.05 24.9h-.01c-2.49 0-4.94-.66-7.08-1.91l-.51-.3-4.45 1.3 1.33-4.34-.33-.53C3.18 21.3 2.5 18.94 2.5 16.46 2.5 8.73 8.77 2.47 16.5 2.47c3.74 0 7.25 1.46 9.89 4.11 2.64 2.65 4.09 6.16 4.09 9.9 0 7.73-6.28 13.88-13.99 13.88z" />
      </svg>
      <span>{label}</span>
    </a>
  );
}
