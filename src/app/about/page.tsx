import type { Metadata } from "next";
import Link from "next/link";
import { getAboutPage } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "KOM Building Materials is a cabinet, countertop and flooring showroom in Redford Township, MI. Professional guidance, premium products, competitive prices.",
};

const defaultValues = [
  {
    heading: "Transparency & Fair Pricing",
    body: "We tell you what things actually cost and why: no inflated MSRP, no hidden fees, no pressure. The price you see reflects real market value, not a number designed to be discounted later.",
  },
  {
    heading: "Expert Guidance & Education",
    body: "We explain the difference between plywood and particle board, quartz and granite, LVP thicknesses, because an informed customer makes better decisions. You talk to the same person from first visit through delivery. No call centers, no ticket systems.",
  },
  {
    heading: "Quality & Integrity",
    body: "We only carry products we'd put in our own homes, from manufacturers with real warranties and real quality control. Founded on accountability and taking care of the people in front of us.",
  },
];

export default async function AboutPage() {
  const about = await getAboutPage();

  const heading = about?.heading || "Built on Honest Business";
  const intro = about?.intro || "KOM Building Materials is based in Redford Township, Michigan. We sell cabinets, countertops, and flooring, and we do it without the layers of markup that drive up prices at big-box stores.";
  const mission = about?.mission || "Most homeowners don't know what materials actually cost. They walk into a big-box store, pay retail, and assume that's the market price. It's not. KOM was built to close that gap.";
  const story = about?.story || "We run a physical showroom in Redford Township so you can see and touch the products before you buy. No guessing from photos. No surprises when the order arrives.";
  const values: { heading: string; body: string }[] = about?.values?.length ? about.values : defaultValues;

  return (
    <>
      <section className="bg-[var(--color-brand-green)] text-white py-14 px-4">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm text-[var(--color-brand-dark)] font-semibold mb-2">About</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{heading}</h1>
          <p className="mt-4 text-white/90 text-base leading-relaxed max-w-2xl">{intro}</p>
        </div>
      </section>

      <section className="py-14 px-4 bg-white">
        <div className="mx-auto max-w-3xl space-y-4 text-sm text-[var(--color-muted)] leading-relaxed">
          <h2 className="text-xl font-bold text-[var(--color-text)]">Our Mission</h2>
          <p>{mission}</p>
          <p>{story}</p>
        </div>
      </section>

      <section className="py-14 px-4 bg-[var(--color-background)]">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-xl font-bold text-[var(--color-text)] mb-8">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((v) => (
              <div key={v.heading}>
                <h3 className="font-semibold text-[var(--color-brand-dark)]">{v.heading}</h3>
                <p className="mt-2 text-sm text-[var(--color-muted)] leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xl font-bold text-[var(--color-text)]">Come See Us</h2>
          <p className="mt-3 text-sm text-[var(--color-muted)]">15497 Beech Daly Road, Redford Township, MI 48239</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="rounded bg-[var(--color-brand-green)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--color-brand-green-dark)] transition-colors">
              Get in Touch
            </Link>
            <Link href="/project-builder" className="rounded border border-gray-200 px-6 py-3 text-sm font-semibold text-[var(--color-text)] hover:bg-gray-50 transition-colors">
              Build Your Project
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
