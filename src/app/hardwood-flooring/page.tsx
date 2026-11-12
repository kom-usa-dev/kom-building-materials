import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Hardwood Flooring",
  description:
    "Unfinished Red Oak Select Grade solid hardwood flooring in 4 widths. In stock at our Redford Township showroom. Pallet pricing available.",
};

const widths = [
  {
    sku: "HWD-001",
    width: "2 1/4\"",
    description: "Classic narrow width. Ideal for smaller rooms and traditional aesthetics. Minimal knots, ready to stain to any finish.",
    image: "/images/hardwood/widths/2-25.avif",
    best: "Best for: traditional homes, smaller rooms",
  },
  {
    sku: "HWD-002",
    width: "3 1/4\"",
    description: "The most popular width. Versatile and balanced. Works in virtually any room and complements any home style.",
    image: "/images/hardwood/widths/3-25.avif",
    best: "Best for: most homes, any room",
  },
  {
    sku: "HWD-003",
    width: "4\"",
    description: "Wider plank with a modern feel. Makes rooms appear larger and shows more of the natural wood grain.",
    image: "/images/hardwood/widths/4.avif",
    best: "Best for: contemporary and transitional spaces",
  },
  {
    sku: "HWD-004",
    width: "5\"",
    description: "Bold wide-plank look. Perfect for open-concept spaces and delivers a premium high-end finish.",
    image: "/images/hardwood/widths/5.avif",
    best: "Best for: open-concept, upscale finishes",
  },
];

const roomPhotos = [
  { src: "/images/hardwood/hardwood-room-hero.webp", alt: "Red Oak hardwood in living room" },
  { src: "/images/hardwood/hardwood-room-3.webp",   alt: "Red Oak hardwood installed" },
];

const whyHardwood = [
  { heading: "Refinishable", body: "Unlike LVP, solid hardwood can be sanded and refinished multiple times. A well-maintained floor can last 100+ years." },
  { heading: "Adds Home Value", body: "Hardwood is one of the few flooring materials that consistently increases resale value." },
  { heading: "Nail-Down Installation", body: "Mechanically fastened to the subfloor: no floating, no movement, no hollow sound underfoot." },
  { heading: "Stain to Any Color", body: "Unfinished Select Grade gives you full control over the final look. Choose any stain color in the showroom." },
];

export default function HardwoodFlooringPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[var(--color-brand-green)] text-white py-14 px-4">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm text-[var(--color-brand-dark)] font-semibold mb-2">Products</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Hardwood Flooring</h1>
          <p className="mt-4 text-white/80 text-base leading-relaxed max-w-2xl">
            We carry unfinished Red Oak Select Grade solid hardwood in four widths.
            Unfinished means you control the final stain color after installation. Pallet pricing available
            for larger orders.
          </p>
          <Link
            href="/project-builder"
            className="mt-6 inline-block rounded bg-[var(--color-brand-dark)] px-6 py-3 text-sm font-semibold text-white hover:bg-black transition-colors"
          >
            Add to Project Builder →
          </Link>
        </div>
      </section>

      {/* Why hardwood */}
      <section className="py-12 px-4 bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyHardwood.map((f) => (
            <div key={f.heading}>
              <h3 className="font-semibold text-[var(--color-brand-green)] text-sm">{f.heading}</h3>
              <p className="mt-1 text-sm text-[var(--color-muted)] leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Width options */}
      <section className="py-14 px-4 bg-[var(--color-background)]">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
            <div>
              <h2 className="text-xl font-bold text-[var(--color-text)]">Red Oak Select Grade, Unfinished</h2>
              <p className="mt-1 text-sm text-[var(--color-muted)]">3/4&quot; thick, random lengths, 4 widths available</p>
              <p className="text-xs text-[var(--color-muted)] mt-0.5">All widths are the same price. Choose the width that suits your room.</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-2xl font-bold text-[var(--color-text)]">$3.59</span>
              <span className="text-sm text-[var(--color-muted)] ml-1">/ sqft</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {widths.map((w) => (
              <div key={w.sku} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="aspect-square relative bg-gray-100">
                  <Image
                    src={w.image}
                    alt={`Red Oak ${w.width} hardwood flooring`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-lg font-bold text-[var(--color-text)]">{w.width}</p>
                  <p className="mt-1 text-sm text-[var(--color-muted)] leading-snug">{w.description}</p>
                  <p className="mt-2 text-xs font-medium text-[var(--color-brand-green)]">{w.best}</p>
                  <div className="mt-auto pt-3">
                    <a
                      href="tel:3135591888"
                      className="block text-center text-xs font-semibold text-white bg-[var(--color-brand-green)] rounded py-2 hover:bg-[var(--color-brand-dark)] transition-colors"
                    >
                      Call for Availability
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-[var(--color-muted)]">
            Unfinished: requires sanding, staining, and sealing after installation. Nail-down installation only.
          </p>
        </div>
      </section>

      {/* Accessory */}
      <section className="py-10 px-4 bg-[var(--color-background)] border-t border-gray-100">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-lg font-bold text-[var(--color-text)] mb-5">Installation Accessories</h2>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col sm:flex-row max-w-xl">
            <div className="w-full sm:w-40 h-40 relative bg-gray-100 shrink-0">
              <Image
                src="/images/hardwood/hardwood-spline.webp"
                alt="Spline / Slip Tongue installation accessory"
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>
            <div className="p-5">
              <p className="text-xs text-[var(--color-muted)] font-mono mb-1">HWD-ACC-001</p>
              <h3 className="font-semibold text-[var(--color-text)]">Spline / Slip Tongue (1/4&quot; x 1/2&quot;)</h3>
              <p className="mt-2 text-sm text-[var(--color-muted)] leading-relaxed">
                Required when reversing the direction of nail-down hardwood installation. Sold by the linear foot.
              </p>
              <p className="mt-3 text-lg font-bold text-[var(--color-text)]">
                $1.00 <span className="text-xs font-normal text-[var(--color-muted)]">/ linear ft</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Room photos */}
      <section className="py-14 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-xl font-bold text-[var(--color-text)] mb-8">See It Installed</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {roomPhotos.map((photo) => (
              <div key={photo.src} className="aspect-square relative rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 bg-[var(--color-brand-green)] text-white">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xl font-bold">Want to see it in person?</h2>
          <p className="mt-2 text-sm text-white/80">
            Bring your room dimensions to our Redford Township showroom and we&apos;ll calculate how much you need
            and walk you through stain color options.
          </p>
          <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/project-builder" className="rounded bg-[var(--color-brand-dark)] px-6 py-3 text-sm font-semibold text-white hover:bg-black transition-colors">
              Build Your Project
            </Link>
            <Link href="/contact" className="rounded border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
