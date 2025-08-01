"use client";

import { useRef, useState, FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-hot-toast";

const SERVICE_ID  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
const PUBLIC_KEY  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

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
          success: "Message sent! We'll be in touch within 24 h ✉️",
          error: "Oops – something went wrong. Please try again later.",
        }
      )
      .then(() => formRef.current?.reset())
      .finally(() => setSending(false));
  };

  /* Shared utility classes */
  const labelFloating =
    "pointer-events-none absolute left-4 transition-all text-sm font-medium text-gray-600 " +
    "peer-placeholder-shown:top-3 peer-placeholder-shown:text-base " +
    "peer-focus:-top-5 peer-focus:text-xs peer-focus:text-indigo-600 " +
    "peer-[&:not(:placeholder-shown)]:-top-5 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-indigo-600";

  const inputBase =
    "peer w-full rounded-lg bg-white/70 px-4 py-3 text-gray-900 shadow-inner backdrop-blur-sm " +
    "focus:ring-2 focus:ring-indigo-400 placeholder-transparent";

  return (
    <section id="contact" className="relative bg-gray-50 pt-24 pb-32 px-4 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-indigo-600/20 to-transparent" />

      <div className="relative mx-auto w-full max-w-5xl">
        <h2 className="mb-12 text-center text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
          Let&apos;s Talk Bulk Furniture for Your Next Project
        </h2>

        <form
          ref={formRef}
          onSubmit={sendEmail}
          className="space-y-10 rounded-3xl border border-gray-200 bg-white/90 p-12 shadow-2xl backdrop-blur"
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
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 px-8 py-2 text-lg font-semibold text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {sending ? "Sending…" : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
