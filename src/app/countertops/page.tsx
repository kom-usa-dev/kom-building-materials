import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";
import countertopsData from "@/data/countertops.json";

export const metadata: Metadata = {
  title: "Countertops",
  description:
    "Quartz countertops fabricated to your exact measurements. Includes standard sink cutout. Browse options and get pricing in our Project Estimator.",
};

const countertops = countertopsData as Product[];

const quartzBenefits = [
  { heading: "Non-Porous", body: "Won't absorb spills, bacteria, or stains. Never needs sealing." },
  { heading: "Low Maintenance", body: "Wipe clean with soap and water. No annual treatment required." },
  { heading: "Extremely Durable", body: "One of the hardest countertop surfaces available. Resists scratching and chipping." },
  { heading: "Sink Cutout Included", body: "Standard undermount or drop-in sink cutout included with every order." },
];

export default function CountertopsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[var(--color-brand-green)] text-white py-14 px-4">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm text-[var(--color-brand-dark)] font-semibold mb-2">Products</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Quartz Countertops</h1>
          <p className="mt-4 text-white/80 text-base leading-relaxed max-w-2xl">
            We sell quartz countertops fabricated to your exact kitchen dimensions. Priced per square foot
            with standard sink cutout included. Come in to see color samples at our Redford Township showroom.
          </p>
          <Link
            href="/project-builder"
            className="mt-6 inline-block rounded bg-[var(--color-brand-dark)] px-6 py-3 text-sm font-semibold text-white hover:bg-black transition-colors"
          >
            Get a Price Estimate →
          </Link>
        </div>
      </section>

      {/* Why Quartz */}
      <section className="py-12 px-4 bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quartzBenefits.map((b) => (
            <div key={b.heading}>
              <h3 className="font-semibold text-[var(--color-brand-green)] text-sm">{b.heading}</h3>
              <p className="mt-1 text-sm text-[var(--color-muted)] leading-relaxed">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product */}
      <section className="py-14 px-4 bg-[var(--color-background)]">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-xl font-bold text-[var(--color-text)] mb-8">Available Now</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {countertops.map((product) => (
              <div key={product.sku} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="relative h-48 bg-gray-100">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-300 text-sm">
                      Photo coming soon
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-[var(--color-text)]">{product.name}</h3>
                  <p className="mt-2 text-sm text-[var(--color-muted)] leading-relaxed">
                    {product.description}
                  </p>
                  <p className="mt-3 text-xs text-[var(--color-muted)] italic">{product.notes}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-[var(--color-text)]">
                      ${product.price}
                      <span className="text-xs font-normal text-[var(--color-muted)] ml-1">/ sqft</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-[var(--color-muted)] max-w-xl">
            Full color and edge profile catalog available in our showroom. Pricing confirmed after measurement. Use the Project Estimator for a rough square footage estimate.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xl font-bold text-[var(--color-text)]">Ready to measure and order?</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Bring your kitchen measurements and we&apos;ll give you an accurate quote. Color samples are available in person.
          </p>
          <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/project-builder" className="rounded bg-[var(--color-brand-green)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--color-brand-green-dark)] transition-colors">
              Build Your Estimate
            </Link>
            <Link href="/contact" className="rounded border border-gray-200 px-6 py-3 text-sm font-semibold text-[var(--color-text)] hover:bg-gray-50 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
