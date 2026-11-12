import Link from "next/link";
import Image from "next/image";
import { getFeaturedTestimonials, getFeaturedGallery, getSiteSettings } from "@/sanity/lib/queries";

const categories = [
  { label: "Cabinets", href: "/cabinets", description: "Mercury White Full Overlay Shaker cabinets. Plywood box, soft-close hinges, in a full range of sizes.", icon: "🪵", image: "/images/icon-cabinets.jpg" },
  { label: "Countertops", href: "/countertops", description: "Quartz countertops fabricated to your exact measurements. Sink cutout included.", icon: "◻️", image: "/images/icon-countertops.webp" },
  { label: "LVP Flooring", href: "/lvp-flooring", description: "100% waterproof luxury vinyl plank. 4 collections, pet-friendly, kid-friendly, budget-friendly.", icon: "🏠", image: "/images/icon-lvp.webp" },
  { label: "Hardwood Flooring", href: "/hardwood-flooring", description: "Unfinished Red Oak solid hardwood in 4 widths. Refinishable and built to last.", icon: "🌲", image: "/images/hardwood/hardwood-room-hero.webp" },
];

const valuePillars = [
  { heading: "Expert Guidance", body: "Real advice from people who work in the showroom. Bring your measurements and photos. We'll help you plan." },
  { heading: "See It In Person", body: "Touch the samples, compare colors side by side. Visit our Redford Township showroom, no appointment needed." },
];

export default async function HomePage() {
  const [testimonials, gallery, settings] = await Promise.all([
    getFeaturedTestimonials(),
    getFeaturedGallery(),
    getSiteSettings(),
  ]);

  const phone = settings?.phone || "(313) 559-1888";
  const email = settings?.email || "BuildingMaterials@KOM-USA.com";

  return (
    <>
      {/* Hero */}
      <section className="relative text-white overflow-hidden min-h-[480px] flex items-center">
        {/* Background image */}
        <Image
          src="/images/hero-kitchen.avif"
          alt="KOM Building Materials showroom kitchen"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55" />
        {/* Content */}
        <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
            Kitchen &amp; Floor Materials,
            <br />
            <span className="text-[var(--color-brand-green)]">Without the Middleman</span>
          </h1>
          <p className="mt-5 text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
            Cabinets, countertops, LVP, and hardwood flooring, displayed in our Redford Township showroom.
            Browse, plan, and request a quote online or in person.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/project-builder" className="rounded bg-[var(--color-brand-dark)] px-7 py-3.5 text-base font-semibold text-white shadow hover:bg-black transition-colors">
              Build Your Project
            </Link>
            <Link href="/contact" className="rounded border border-white/40 px-7 py-3.5 text-base font-semibold text-white hover:bg-white/10 transition-colors">
              Visit the Showroom
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-[var(--color-background)]">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-center text-[var(--color-text)] mb-10">Browse by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link key={cat.href} href={cat.href} className="group block bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:border-[var(--color-brand-green)] transition-all">
                {cat.image ? (
                  <div className="relative h-36">
                    <Image
                      src={cat.image}
                      alt={cat.label}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
                  </div>
                ) : (
                  <div className="px-6 pt-6 text-4xl">{cat.icon}</div>
                )}
                <div className={`relative z-10 px-6 pb-6 ${cat.image ? "-mt-4" : "mt-3"}`}>
                  <h3 className="font-semibold text-[var(--color-text)] text-lg group-hover:text-[var(--color-brand-dark)] transition-colors">{cat.label}</h3>
                  <p className="mt-2 text-sm text-[var(--color-muted)] leading-relaxed">{cat.description}</p>
                  <span className="mt-4 inline-block text-sm font-medium text-[var(--color-brand-green)]">Browse {cat.label} →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why KOM */}
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-center text-[var(--color-text)] mb-10">Why Customers Choose KOM</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {valuePillars.map((pillar) => (
              <div key={pillar.heading}>
                <h3 className="font-semibold text-[var(--color-brand-dark)] mb-2">{pillar.heading}</h3>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">{pillar.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery (only shown if Jordan has added images) */}
      {gallery?.length > 0 && (
        <section className="py-16 px-4 bg-[var(--color-background)]">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-2xl font-bold text-center text-[var(--color-text)] mb-10">From Our Showroom</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((item) => (
                <div key={item._id} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={item.image.asset.url}
                    alt={item.caption || "KOM showroom"}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials (only shown if Jordan has added some) */}
      {testimonials?.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-2xl font-bold text-center text-[var(--color-text)] mb-10">What Customers Say</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t._id} className="bg-[var(--color-background)] rounded-xl p-6 border border-gray-100">
                  {t.rating && (
                    <p className="text-[var(--color-brand-green)] text-sm mb-2">{"★".repeat(t.rating)}</p>
                  )}
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                  <p className="mt-4 text-sm font-semibold text-[var(--color-text)]">{t.name}</p>
                  {(t.projectType || t.location) && (
                    <p className="text-xs text-[var(--color-muted)]">{[t.projectType, t.location].filter(Boolean).join(" · ")}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Financing teaser */}
      <section className="py-14 px-4 bg-[var(--color-brand-green)] text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold">Financing Available</h2>
          <p className="mt-3 text-white/90 text-base leading-relaxed">
            Don&apos;t let budget slow down your project. We offer flexible financing options so you can start now and pay over time.
          </p>
          <Link href="/financing" className="mt-6 inline-block rounded border border-white/40 px-6 py-3 text-sm font-semibold hover:bg-white/10 transition-colors">
            Learn About Financing
          </Link>
        </div>
      </section>

      {/* Project Builder CTA */}
      <section className="py-16 px-4 bg-[var(--color-background)]">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-[var(--color-text)]">Ready to Plan Your Project?</h2>
          <p className="mt-3 text-[var(--color-muted)] text-base leading-relaxed">
            Use our Project Builder to combine cabinets, countertops, and flooring in one estimate. See a running total, then request an official quote. No checkout, no pressure.
          </p>
          <Link href="/project-builder" className="mt-6 inline-block rounded bg-[var(--color-brand-green)] px-7 py-3.5 text-base font-semibold text-white shadow hover:bg-[var(--color-brand-green-dark)] transition-colors">
            Build Your Project
          </Link>
        </div>
      </section>

      {/* Showroom info */}
      <section className="py-12 px-4 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-xl font-bold text-[var(--color-text)] mb-2">Visit Our Showroom</h2>
          <p className="text-[var(--color-muted)] text-sm">15497 Beech Daly Road, Redford Township, MI 48239</p>
          <p className="text-[var(--color-muted)] text-sm mt-1">
            <a href={`tel:${phone.replace(/\D/g, '')}`} className="hover:text-[var(--color-brand-green)] transition-colors">{phone}</a>
            {" · "}
            <a href={`mailto:${email}`} className="hover:text-[var(--color-brand-green)] transition-colors">{email}</a>
          </p>
        </div>
      </section>
    </>
  );
}
