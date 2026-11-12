import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";
import lvpData from "@/data/lvp-flooring.json";

export const metadata: Metadata = {
  title: "LVP Flooring",
  description:
    "100% waterproof luxury vinyl plank flooring. Browse 4 collections: New Mountain, NASA, Planet, and Roman. See any color in your room with our free 3D visualizer. In stock at our Redford Township showroom.",
};

const lvp = lvpData as Product[];

const entryLevel = lvp.filter((p) => !p.colors);
const collections = lvp.filter((p) => p.colors && p.colors.length > 0);

const whyLvp = [
  { heading: "100% Waterproof", body: "Won't swell, warp, or stain from spills. Safe for kitchens, bathrooms, and basements." },
  { heading: "Floating Install", body: "Click-lock planks go over most existing subfloors. No glue, no nails. DIY-friendly." },
  { heading: "Pet & Kid Proof", body: "12-30mil wear layers resist scratches, claws, and heavy foot traffic." },
  { heading: "See It First", body: "Click \"View in Room\" on any color to see it in a 3D room visualizer before you buy." },
];

export default function LvpFlooringPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[var(--color-brand-green)] text-white py-14 px-4">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm text-[var(--color-brand-dark)] font-semibold mb-2">Products</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">LVP Flooring</h1>
          <p className="mt-4 text-white/80 text-base leading-relaxed max-w-2xl">
            Luxury Vinyl Plank is completely waterproof, looks like real wood, and installs over most
            existing floors without tearing anything out. We carry 4 collections (New Mountain, NASA,
            Planet, and Roman), available at our Redford Township showroom.
          </p>
          <Link
            href="/project-builder"
            className="mt-6 inline-block rounded bg-[var(--color-brand-dark)] px-6 py-3 text-sm font-semibold text-white hover:bg-black transition-colors"
          >
            Add to Project Builder →
          </Link>
        </div>
      </section>

      {/* Why LVP */}
      <section className="py-12 px-4 bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyLvp.map((f) => (
            <div key={f.heading}>
              <h3 className="font-semibold text-[var(--color-brand-green)] text-sm">{f.heading}</h3>
              <p className="mt-1 text-sm text-[var(--color-muted)] leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Entry-level */}
      <section className="py-14 px-4 bg-[var(--color-background)]">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-xl font-bold text-[var(--color-text)] mb-1">Budget &amp; Rental Options</h2>
          <p className="text-sm text-[var(--color-muted)] mb-8">Best for rental properties, commercial spaces, and budget-conscious projects.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            {entryLevel.map((product) => (
              <div key={product.sku} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="relative aspect-[16/7] bg-gray-100">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-300 text-sm">
                      Photo coming soon
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs text-[var(--color-muted)] font-mono mb-1">{product.sku}</p>
                  <h3 className="font-semibold text-[var(--color-text)]">{product.name}</h3>
                  <p className="mt-2 text-sm text-[var(--color-muted)] leading-relaxed">{product.description}</p>
                  <p className="mt-2 text-xs text-[var(--color-muted)]">{product.dimensions}</p>
                  {product.notes && <p className="mt-1 text-xs text-[var(--color-muted)] italic">{product.notes}</p>}
                  <div className="mt-4 flex items-center justify-between">
                    {/* A price of 0 means none is published yet (T173: Orlando Glue Down, Jordan 19 Oct). */}
                    {product.price > 0 ? (
                      <span className="text-lg font-bold text-[var(--color-text)]">
                        ${product.price.toFixed(2)}
                        <span className="text-xs font-normal text-[var(--color-muted)] ml-1">/ sqft</span>
                      </span>
                    ) : (
                      <Link href="/contact" className="text-sm font-semibold text-[var(--color-brand-green)] hover:underline">Contact us for pricing</Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections */}
      {collections.map((collection) => {
        // Parse dimension string: "48\" L x 7\" W, 5.2mm total, 20mil wear layer"
        const dimMatch = collection.dimensions.match(/(\d+)" L x (\d+)" W, ([\d.]+)mm total, (\d+)mil wear/);
        const padMatch = collection.notes?.match(/([\d.]+)mm soft acoustic pad/);
        const specs = dimMatch ? [
          { label: "Plank Size",    value: `${dimMatch[1]}" × ${dimMatch[2]}"` },
          { label: "Thickness",     value: `${dimMatch[3]}mm` },
          { label: "Wear Layer",    value: `${dimMatch[4]}mil` },
          { label: "Per Carton",    value: collection.sqftPerCarton ? `${collection.sqftPerCarton} sqft` : "n/a" },
          { label: "Underlayment",  value: padMatch ? `${padMatch[1]}mm pre-attached` : "None" },
          { label: "Install",       value: "Click-lock floating" },
        ] : [];

        return (
        <section
          key={collection.sku}
          className="py-14 px-4 border-t border-gray-100 odd:bg-white even:bg-[var(--color-background)]"
        >
          <div className="mx-auto max-w-7xl">
            {/* Collection header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[var(--color-text)]">{collection.name}</h2>
                <p className="mt-1 text-sm text-[var(--color-muted)] max-w-xl">{collection.description}</p>
                {specs.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
                    {specs.map((s) => (
                      <div key={s.label} className="flex items-baseline gap-1.5">
                        <span className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide whitespace-nowrap">{s.label}</span>
                        <span className="text-xs font-bold text-[var(--color-text)]">{s.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-left sm:text-right shrink-0">
                <span className="text-2xl font-bold text-[var(--color-text)]">
                  ${collection.price.toFixed(2)}
                </span>
                <span className="text-sm text-[var(--color-muted)] ml-1">/ sqft</span>
              </div>
            </div>

            {/* Color grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {collection.colors!.map((color) => (
                <div
                  key={color.name}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
                >
                  {/* Swatch */}
                  <div className="aspect-square relative bg-gray-100">
                    {color.image ? (
                      <Image
                        src={color.image}
                        alt={`${collection.name}, ${color.name}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-gray-400 font-medium text-center px-2 leading-snug">
                        Swatch<br />Coming Soon
                      </div>
                    )}
                  </div>
                  {/* Name + button */}
                  <div className="p-3 flex flex-col flex-1">
                    <p className="text-sm font-semibold text-[var(--color-text)] leading-snug">{color.name}</p>
                    <a
                      href={color.visualizerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto pt-3 block text-center text-xs font-semibold text-[var(--color-brand-green)] border border-[var(--color-brand-green)] rounded py-2 hover:bg-[var(--color-brand-green)] hover:text-white transition-colors"
                    >
                      View in Room →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        );
      })}

      {/* CTA */}
      <section className="py-12 px-4 bg-[var(--color-brand-green)] text-white">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xl font-bold">Ready to order or want to see samples?</h2>
          <p className="mt-2 text-sm text-white/80">
            All collections are in stock at our Redford Township showroom. Bring your room dimensions and we&apos;ll calculate how much you need.
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
