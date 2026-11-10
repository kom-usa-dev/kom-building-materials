import type { Metadata } from "next";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import { KITCHEN_DESIGNER } from "@/data/designer";

export const metadata: Metadata = {
  title: "Kitchen Designer",
  description:
    "Lay out a kitchen in 3D, price the materials, and send it to KOM Building Materials for a quote.",
  // Nothing to index: this page either forwards elsewhere or says "not yet".
  robots: { index: false, follow: false },
};

/**
 * The one KOM-owned address for Jordan's 3D kitchen designer.
 *
 * **Why a hop rather than linking at the planner directly.** It lives on a
 * ChatGPT Site, on a host this repo does not control, and it has already moved
 * once — from a personal account to the KOM workspace, within a day. Every link
 * this site publishes points here, and this file is the single place the real
 * destination is named, so the next move costs one line.
 *
 * ✅ **A permanent redirect (308) since T320, November 10th, 2026.** Until
 * then this was a 307 on purpose: the planner sat on a ChatGPT Site whose host
 * could change, and a cached permanent redirect would have stranded customers
 * on a dead address. It now lives on KOM's own subdomain, designer.kom-usa.com,
 * so the destination is stable. A 307 told Google this URL is the one to keep,
 * and Search Console flagged designer.kom-usa.com as a "duplicate without
 * user-selected canonical"; a 308 says the designer's own address is the real
 * one. Same change as kom-usa.com/kitchen-designer (kom-usa-platform #132).
 *
 * ✅ **Points at designer.kom-usa.com since 9 Oct** (KOM's Cloudflare, T53),
 * as kom-usa.com/kitchen-designer does. From 11 Sep to 9 Oct it pointed at the
 * KOM workspace ChatGPT Site (`kom-usa-0158.chatgpt.site`), which ends 28 Oct.
 *
 * ⚠️ **This page cannot tell whether the planner is reachable**, only whether a
 * URL is configured. The personal Site was returning 401 minutes before the
 * workspace one went live, and a URL filled in at that moment would have failed
 * on the far side of this hop, on an OpenAI "Sign in required" page, where the
 * customer has already committed to the click. **Check any new URL signed out
 * before putting it in `data/designer.ts`.**
 *
 * The twin of this page lives in `kom-usa-platform`. Two sites, same pattern,
 * because the same designer serves both.
 */
export default function Page() {
  if (KITCHEN_DESIGNER.url) permanentRedirect(KITCHEN_DESIGNER.url);

  /*
   * "Not yet" as a real page rather than a 404. People reach this from a link
   * somebody sent them, so it has to say what the thing is and hand them the
   * route that works today — which here is the estimator that already exists.
   */
  return (
    <>
      <section className="bg-[var(--color-brand-green)] text-white py-14 px-4">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm text-[var(--color-brand-dark)] font-semibold mb-2">
            Tools
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            3D Kitchen Designer
          </h1>
          <p className="mt-4 text-white/80 text-base leading-relaxed max-w-2xl">
            Our 3D designer is still in testing and is not open to the public
            yet. The Project Estimator does the pricing today.
          </p>
        </div>
      </section>

      <section className="bg-[var(--color-background)] px-4 py-14">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight">Not open yet</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed opacity-80">
            It lets you lay out cabinets, counters and appliances and see the
            materials priced as you go. Until it opens, build your estimate from
            the product list and send it to us for an official quote.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/project-builder"
              className="rounded bg-[var(--color-brand-green)] px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-[var(--color-brand-green-dark)]"
            >
              Use the Project Estimator
            </Link>
            <Link
              href="/contact"
              className="rounded border-2 border-[var(--color-brand-dark)] px-6 py-3 text-center font-semibold transition-colors hover:bg-[var(--color-brand-dark)] hover:text-white"
            >
              Ask us about your kitchen
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
