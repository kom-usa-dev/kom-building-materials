import type { Metadata } from "next";
import Link from "next/link";
import { getFinancing } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Financing",
  description:
    "Flexible financing options for your kitchen or flooring project. Start your renovation now and pay over time. Contact us to learn more.",
};

const defaultFaqs = [
  { question: "Who is the financing through?", answer: "We work with third-party financing partners. Details are available in the showroom. We can walk you through your options and help you apply." },
  { question: "What can financing cover?", answer: "Financing can cover cabinets, countertops, and flooring materials. Ask us whether installation costs can also be included." },
  { question: "Is there a minimum project size?", answer: "Minimum amounts vary by financing partner. Bring your project estimate to the showroom and we can discuss what makes sense for your situation." },
  { question: "Will it affect my credit?", answer: "Most financing applications involve a credit check. The specific impact depends on the product and lender. We recommend asking in the showroom so we can explain the options clearly." },
];

export default async function FinancingPage() {
  const financing = await getFinancing();

  const intro = financing?.intro || "We offer flexible financing options so you can start your kitchen or flooring project now and pay over time. Talk to us in the showroom or reach out to learn what's available for your situation.";
  const partnerName = financing?.partnerName || null;
  const faqs: { question: string; answer: string }[] = financing?.faqs?.length ? financing.faqs : defaultFaqs;

  return (
    <>
      <section className="bg-[var(--color-brand-green)] text-white py-14 px-4">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm text-[var(--color-brand-dark)] font-semibold mb-2">Financing</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Don&apos;t Let Budget Stop Your Project</h1>
          <p className="mt-4 text-white/90 text-base leading-relaxed max-w-2xl">{intro}</p>
          {partnerName && (
            <p className="mt-3 text-sm font-semibold text-[var(--color-brand-dark)]">Financing partner: {partnerName}</p>
          )}
        </div>
      </section>

      <section className="py-14 px-4 bg-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-[var(--color-text)] mb-8">How it works</h2>
          <ol className="space-y-6">
            {[
              { step: "1", heading: "Build your project estimate", body: "Use our Project Builder to combine cabinets, countertops, and flooring. Get a rough total before you come in." },
              { step: "2", heading: "Come into the showroom", body: "Bring your estimate and measurements. We'll review the options and give you an official quote." },
              { step: "3", heading: "Apply for financing", body: "We'll walk you through the available financing products and help you apply on the spot." },
              { step: "4", heading: "Start your project", body: "Once approved, place your order. We'll coordinate delivery and can refer installers if you need them." },
            ].map((item) => (
              <li key={item.step} className="flex gap-5">
                <div className="flex-none w-9 h-9 rounded-full bg-[var(--color-brand-green)] text-white text-sm font-bold flex items-center justify-center shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-text)]">{item.heading}</h3>
                  <p className="mt-1 text-sm text-[var(--color-muted)] leading-relaxed">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-14 px-4 bg-[var(--color-background)]">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-[var(--color-text)] mb-8">Common Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="border-b border-gray-100 pb-6">
                <h3 className="font-semibold text-[var(--color-text)]">{faq.question}</h3>
                <p className="mt-2 text-sm text-[var(--color-muted)] leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-[var(--color-brand-green)] text-white">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xl font-bold">Ready to get started?</h2>
          <p className="mt-2 text-white/80 text-sm leading-relaxed">
            Build a project estimate online, then come in to discuss financing and get an official quote.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/project-builder" className="rounded bg-[var(--color-brand-dark)] px-6 py-3 text-sm font-semibold text-white hover:bg-black transition-colors">
              Build Your Project
            </Link>
            <Link href="/contact" className="rounded border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
