import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import type { Product, CabinetItem } from "@/types/product";
import cabinetsData from "@/data/cabinets.json";
import { GROUP_DESCRIPTIONS, groupKey, groupLabel, groupSlug, hasWidths, sizeCount } from "@/data/cabinet-labels";

export const metadata: Metadata = {
  title: "Kitchen Cabinets",
  description:
    "Mercury White Full Overlay Shaker cabinets, in stock. Wall, base, pantry, and specialty cabinets available in a full range of sizes. Contact us for pricing.",
};

const cabinets = cabinetsData as Product[];
const catalog = cabinets[0];

const features = [
  { heading: "Soft-Close Hinges", body: "6-way adjustable soft-close hinges standard on every door. Closes quietly every time." },
  { heading: "Plywood Box", body: "¾\" plywood construction, not particle board, handles heavy cookware without sagging." },
  { heading: "Solid Wood Frame", body: "Solid wood face frame with HDF center panel doors for a clean, durable finish." },
  { heading: "Full Overlay Shaker", body: "Modern full overlay Shaker style covers the face frame for a sleek, seamless look." },
];

const sections = ["Wall Cabinets", "Base Cabinets", "Pantry Cabinets", "Accessories", "Specialty Cabinets", "Vanity Cabinets"];

function getSizeDisplay(items: CabinetItem[]): { widths: string[]; heights: string[]; fullDims: string[] } {
  if (hasWidths(items)) {
    const widths = [...new Set(items.map((i) => {
      const m = i.dimensions.match(/^(\d+)"W/);
      return m ? `${m[1]}"` : "";
    }).filter(Boolean))];
    const heights = [...new Set(items.map((i) => {
      const m = i.dimensions.match(/× (\d+(?:\.\d+)?)"H/);
      return m ? `${m[1]}"` : "";
    }).filter(Boolean))];
    return { widths, heights, fullDims: [] };
  }
  return {
    widths: [],
    heights: [],
    fullDims: items.map((i) => i.dimensions.split(", ")[0]),
  };
}

export default function CabinetsPage() {
  const groupsBySection = sections.map((section) => ({
    section,
    groups: catalog.cabinetGroups?.filter((g) => g.section === section) ?? [],
  }));

  return (
    <>
      {/* Hero */}
      <section className="bg-[var(--color-brand-green)] text-white py-14 px-4">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm text-[var(--color-brand-dark)] font-semibold mb-2">Products</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Kitchen Cabinets</h1>
          <p className="mt-4 text-white/80 text-base leading-relaxed max-w-2xl">
            {catalog.description}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/project-builder"
              className="inline-block rounded bg-[var(--color-brand-dark)] px-6 py-3 text-sm font-semibold text-white hover:bg-black transition-colors"
            >
              Build Your Estimate →
            </Link>
            <Link
              href="/contact"
              className="inline-block rounded bg-white px-6 py-3 text-sm font-semibold text-[var(--color-brand-green)] hover:bg-gray-100 transition-colors"
            >
              Request Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Quality callouts */}
      <section className="py-12 px-4 bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.heading}>
              <h3 className="font-semibold text-[var(--color-brand-green)] text-sm">{f.heading}</h3>
              <p className="mt-1 text-sm text-[var(--color-muted)] leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cabinet sections */}
      {groupsBySection.map(({ section, groups }, si) => (
        groups.length === 0 ? null : (
          <section
            key={section}
            className={`py-14 px-4 border-t border-gray-100 ${si % 2 === 0 ? "bg-[var(--color-background)]" : "bg-white"}`}
          >
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-[var(--color-text)]">{section}</h2>
                  <p className="text-sm text-[var(--color-muted)] mt-1">Mercury White · Full Overlay Shaker</p>
                </div>
                <Link
                  href="/project-builder"
                  className="shrink-0 rounded bg-[var(--color-brand-green)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-brand-dark)] transition-colors"
                >
                  Price in Estimator →
                </Link>
              </div>

              {/* One collapsible row per group (T306): closed by default, opens to its sizes */}
              <div className="flex flex-col gap-3">
                {groups.map((group) => {
                  const label = groupLabel(section, group.group);
                  const description = GROUP_DESCRIPTIONS[groupKey(section, group.group)] ?? "";
                  const { widths, heights, fullDims } = getSizeDisplay(group.items);
                  const countLabel = sizeCount(group.items);

                  return (
                    <details key={group.group} className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                      <summary className="flex items-center gap-3 px-4 py-3 min-h-[48px] cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:bg-gray-50 group-open:bg-gray-50 group-open:border-b group-open:border-gray-100">
                        <span className="relative shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gray-50 overflow-hidden">
                          {group.image ? (
                            <Image src={group.image} alt="" fill className="object-contain p-1" sizes="56px" />
                          ) : null}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block font-semibold text-[var(--color-text)] text-sm sm:text-base">{label}</span>
                          <span className="block text-xs text-[var(--color-muted)]">{countLabel}</span>
                        </span>
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 20 20"
                          className="shrink-0 w-5 h-5 text-[var(--color-muted)] transition-transform group-open:rotate-180"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </summary>

                      <div className="flex flex-col sm:flex-row gap-5 p-4 items-start">
                        {/* Group image */}
                        <div className="relative w-full max-w-[260px] self-center sm:self-start sm:w-[200px] shrink-0 aspect-[4/3] bg-gray-50 rounded-lg">
                          {group.image ? (
                            <Image
                              src={group.image}
                              alt={label}
                              fill
                              className="object-contain p-3"
                              sizes="(max-width: 640px) 260px, 200px"
                            />
                          ) : (
                            <div className="h-full flex items-center justify-center text-gray-300 text-sm">
                              Photo coming soon
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          {description && (
                            <p className="text-xs text-[var(--color-muted)] leading-relaxed">{description}</p>
                          )}

                          {/* Available sizes */}
                          <div className={description ? "mt-3" : ""}>
                            {widths.length > 0 && (
                              <>
                                <p className="text-xs font-medium text-[var(--color-muted)] mb-1.5">Available widths:</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {widths.map((w) => (
                                    <span key={w} className="text-xs bg-gray-100 text-[var(--color-text)] px-2 py-1 rounded font-mono">{w}</span>
                                  ))}
                                </div>
                                {heights.length > 1 && (
                                  <p className="mt-1.5 text-xs text-[var(--color-muted)]">
                                    Heights: {heights.join(", ")}
                                  </p>
                                )}
                              </>
                            )}
                            {fullDims.length > 0 && (
                              <>
                                <p className="text-xs font-medium text-[var(--color-muted)] mb-1.5">Available sizes:</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {fullDims.map((d, i) => (
                                    <span key={i} className="text-xs bg-gray-100 text-[var(--color-text)] px-2 py-1 rounded">{d}</span>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>

                          <Link
                            href={`/project-builder?group=${groupSlug(section, group.group)}`}
                            className="mt-4 inline-block text-xs font-semibold text-[var(--color-brand-green)] border border-[var(--color-brand-green)] rounded px-4 py-2 hover:bg-[var(--color-brand-green)] hover:text-white transition-colors"
                          >
                            Select Size &amp; Price →
                          </Link>
                        </div>
                      </div>
                    </details>
                  );
                })}
              </div>
            </div>
          </section>
        )
      ))}

      {/* CTA */}
      <section className="py-12 px-4 bg-[var(--color-brand-green)] text-white">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xl font-bold">Ready to get started?</h2>
          <p className="mt-2 text-sm text-white/80">
            Use the Project Estimator to pick your sizes and see pricing. Or visit our Redford Township showroom to see the Mercury White finish in person.
          </p>
          <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/project-builder" className="rounded bg-[var(--color-brand-dark)] px-6 py-3 text-sm font-semibold text-white hover:bg-black transition-colors">
              Build Your Estimate
            </Link>
            <Link href="/contact" className="rounded border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
              Request Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
