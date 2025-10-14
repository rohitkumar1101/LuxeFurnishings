export default function About() {
  return (
    <section
      id="about"
      className="relative bg-gray-50 pt-20 pb-20 px-4 sm:px-6 lg:px-8"
    >
      {/* subtle gold gradient like Contact */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64" />

      <div className="relative mx-auto w-full max-w-5xl">
        {/* Overline */}
        <div className="mx-auto mb-4 w-fit rounded-full border border-[#E8C766]/40 bg-white/70 px-4 py-1 text-xl font-semibold tracking-widest text-[#9C7A1A]">
          WHY ILF
        </div>

        {/* Headline + tagline */}
        <h1 className="text-center text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
          Because the furniture industry forgot what quality feels like —{" "}
          <span className="text-[#C89B3C]">we didn’t.</span>
        </h1>

        {/* divider */}
        <div className="mx-auto my-8 h-px w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        {/* Card */}
        <div className="rounded-3xl p-12 shadow-lg backdrop-blur">
          <div className="mx-auto max-w-3xl space-y-6 text-lg leading-relaxed text-gray-700">
            <p>
              At Infinity Luxe Furnishings, we built a factory to fix what
              showrooms broke: inflated prices, inconsistent craftsmanship, and
              endless delays.
            </p>

            <p>
              By manufacturing directly, we control every screw, stitch, and
              surface — cutting out showroom markups and cutting down delivery
              time. The result? Premium furniture at fair prices, without
              compromise.
            </p>

            {/* Highlights */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-center font-medium text-slate-800 shadow-sm hover:border-[#E6D7B0]">
                Businesses trust us because we deliver at scale.
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-center font-medium text-slate-800 shadow-sm hover:border-[#E6D7B0]">
                Homeowners trust us because we care about the details.
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-center font-medium text-slate-800 shadow-sm hover:border-[#E6D7B0]">
                Everyone stays because we make reliability look good.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
