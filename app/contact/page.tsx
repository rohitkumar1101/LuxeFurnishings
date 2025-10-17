"use client";

import { useRef, useState, FormEvent, useCallback } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-hot-toast";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

export default function ContactSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState(false);

  const sendEmail = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    setSending(true);

    toast
      .promise(
        emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY),
        {
          loading: "Sending…",
          success: "Message sent! We'll be in touch within the hour ✉️",
          error: "Oops – something went wrong. Please try again later.",
        }
      )
      .then(() => formRef.current?.reset())
      .finally(() => setSending(false));
  };

  /** On focus, set the site accent to gold (used by focus rings, etc.) */
  const setGoldTheme = useCallback(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--ilf-accent", "#B8892D");
    }
  }, []);

  /* Shared utility classes */
  const labelFloating =
    "pointer-events-none absolute left-4 transition-all text-sm font-medium text-gray-600 " +
    "peer-placeholder-shown:top-3 peer-placeholder-shown:text-base " +
    "peer-focus:-top-5 peer-focus:text-xs " +
    "peer-[&:not(:placeholder-shown)]:-top-5 peer-[&:not(:placeholder-shown)]:text-xs " +
    "peer-focus:text-[var(--ilf-accent)] peer-[&:not(:placeholder-shown)]:text-[var(--ilf-accent)]";

  const inputBase =
    "peer w-full rounded-lg bg-white px-4 py-3 text-gray-900 placeholder-transparent " +
    "border border-gray-300 shadow-sm backdrop-blur " + // ⬅️ clearer field outline + darker shadow
    "transition focus:outline-none focus:ring-2 " +
    "focus:ring-[var(--ilf-accent)] focus:border-[var(--ilf-accent)]";

  return (
    <section id="contact" className="relative bg-gray-50 pt-20 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64" />

      <div className="relative mx-auto w-full max-w-5xl">
        {/* Hero copy */}
        <h2 className="mb-3 text-center text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
          Didn’t find exactly what you’re looking for?
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-gray-600">
          ILF is a full-scale factory for custom-built furniture—tailored to your space, style,
          and budget. Share a few details and our team will reach out{" "}
          <span className="font-medium">within the hour</span>.
        </p>

        <form
          ref={formRef}
          onSubmit={sendEmail}
          className="space-y-10 rounded-3xl border border-gray-300 bg-white/95 p-12 shadow-2xl backdrop-blur"
        >
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {/* Name */}
            <div className="relative">
              <input
                id="name"
                type="text"
                name="user_name"
                placeholder=" "
                required
                onFocus={setGoldTheme}
                className={inputBase}
              />
              <label htmlFor="name" className={labelFloating}>
                Name
              </label>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                id="email"
                type="email"
                name="user_email"
                placeholder=" "
                required
                onFocus={setGoldTheme}
                className={inputBase}
              />
              <label htmlFor="email" className={labelFloating}>
                Email
              </label>
            </div>

            {/* Company */}
            <div className="relative sm:col-span-2">
              <input
                id="company"
                type="text"
                name="company"
                placeholder=" "
                required
                onFocus={setGoldTheme}
                className={inputBase}
              />
              <label htmlFor="company" className={labelFloating}>
                Company
              </label>
            </div>
          </div>

          {/* Project details */}
          <div className="relative">
            <textarea
              id="details"
              name="message"
              placeholder=" "
              required
              onFocus={setGoldTheme}
              className={inputBase + " min-h-[10rem] resize-y leading-relaxed"}
            />
            <label htmlFor="details" className={labelFloating}>
              Project Details
            </label>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center justify-center gap-2 rounded-xl
bg-gradient-to-r from-[#B8892D] to-[#E4C86E]
px-8 py-2 text-lg font-semibold text-white shadow-lg transition
hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ilf-accent)]
disabled:cursor-not-allowed disabled:opacity-70"
            >
              {sending ? "Sending…" : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
