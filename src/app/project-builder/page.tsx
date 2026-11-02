import type { Metadata } from "next";
import { Suspense } from "react";
import ProjectEstimator from "@/components/ProjectEstimator";
import { KITCHEN_DESIGNER, plannerIsLive } from "@/data/designer";
import type { Product } from "@/types/product";
import lvpData from "@/data/lvp-flooring.json";
import hardwoodData from "@/data/hardwood-flooring.json";
import cabinetsData from "@/data/cabinets.json";
import countertopsData from "@/data/countertops.json";

export const metadata: Metadata = {
  title: "Build Your Project",
  description:
    "Two ways to start: plan a kitchen in 3D, or build a quick material estimate from cabinets, countertops, LVP and hardwood flooring. See a running total and request an official quote.",
};

/** Where "Start your estimate" scrolls to. Named once, used twice. */
const ESTIMATOR_ANCHOR = "material-estimator";

/**
 * Two ways to start, then the estimator.
 *
 * **This page stopped being "the estimator" on 11 Sep.** It carries two tools
 * now, so the top has to let a customer choose between them before either one
 * starts asking for input. The choice is framed by what they already know —
 * layout help, or products and sizes — because that is the thing a customer can
 * answer about themselves without knowing anything about our software.
 *
 * ⚠️ **The 3D planner is a card, not an advertisement.** It spent a few hours
 * as a full-width promotional block above the estimator, which read as though
 * the estimator were the fallback. Two equal cards say what is true: two
 * starting points, neither a consolation prize.
 *
 * ⚠️ **"Both paths lead to one official quote request" is NOT on this page**,
 * though it was specified for it. It is not true yet: the estimator submits
 * through the contact form to Netlify, and the planner writes to its own
 * database and forwards only if a webhook is configured. See `data/designer.ts`.
 * Ship that sentence when the intakes actually meet, not before.
 */
export default function ProjectBuilderPage() {
  const lvp = lvpData as Product[];
  const hardwood = hardwoodData as Product[];
  const cabinets = cabinetsData as Product[];
  const countertops = countertopsData as Product[];

  return (
    <>
      <section className="bg-[var(--color-brand-dark)] px-4 py-14 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--color-brand-green)]">
            Two ways to start
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Build Your Project
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80">
            Choose the tool that matches what you know today. You can review the
            result with the KOM team before you order.
          </p>

          {/*
            Equal by construction: one grid, `items-stretch` by default, and the
            action pinned to the bottom of each card with `mt-auto`. A card that
            grew because its copy was longer would read as the more important
            one — a claim neither card should make by accident.
          */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <PlannerCard />
            <EstimateCard />
          </div>
        </div>
      </section>

      <section
        id={ESTIMATOR_ANCHOR}
        // Cleared past the sticky header, or the heading lands underneath it.
        className="min-h-screen scroll-mt-24 bg-[var(--color-background)]"
      >
        <div className="mx-auto max-w-4xl px-4 pt-10">
          <h2 className="text-2xl font-bold tracking-tight">
            Build your estimate from the product list
          </h2>
        </div>
        {/* Suspense: the estimator reads ?group= (useSearchParams) on the client; the page itself stays static. */}
        <Suspense fallback={null}>
          <ProjectEstimator
            lvpProducts={lvp.filter((p) => p.price > 0)}
            hardwoodProducts={hardwood}
            cabinetCatalog={cabinets[0]}
            countertopProducts={countertops}
          />
        </Suspense>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* The two cards                                                       */
/* ------------------------------------------------------------------ */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col border border-white/20 p-6">
      {children}
    </div>
  );
}

/** Green chip, dark text — the readable direction of that colour pair. */
function Status({ children }: { children: React.ReactNode }) {
  return (
    <p className="self-start bg-[var(--color-brand-green)] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--color-text)]">
      {children}
    </p>
  );
}

/** The rule above "Best if". */
function Rule() {
  return <hr className="my-5 border-white/20" />;
}

/** py-3 plus the line box clears the 44px minimum touch target. */
const BUTTON = "mt-auto block px-6 py-3 text-center font-bold transition-colors";
const PRIMARY = `${BUTTON} bg-[var(--color-brand-green)] text-[var(--color-text)] hover:bg-[var(--color-brand-green-dark)] hover:text-white`;
const SECONDARY = `${BUTTON} border border-white/40 text-white hover:bg-white hover:text-[var(--color-text)]`;

/**
 * The 3D planner.
 *
 * ⚠️ **The link points at `/kitchen-designer` on our own domain in BOTH
 * states.** That route is the single place the real destination is named, so
 * moving the planner to another Site is one value change and every published
 * link survives it. The planner's own URL never appears in anything a customer
 * can see.
 */
function PlannerCard() {
  const live = plannerIsLive();
  const { card } = KITCHEN_DESIGNER;

  return (
    <Card>
      <Status>{live ? card.statusLive : card.statusSoon}</Status>

      <h2 className="mt-5 text-2xl font-bold tracking-tight">{card.title}</h2>
      <p className="mt-3 text-base leading-relaxed text-white/70">
        {card.description}
      </p>
      <p className="mt-2 text-sm text-white/70">{card.scope}</p>

      <Rule />
      <p className="mb-5 text-base font-semibold">{card.bestIf}</p>

      {live ? (
        <a
          href="/kitchen-designer"
          // A different host with its own saved-design state. Losing this page
          // mid-estimate to go and look at a planner helps nobody.
          target="_blank"
          rel="noopener noreferrer"
          className={PRIMARY}
        >
          {card.actionLive}
          {/*
            Sighted users get the new tab itself as the signal. Without this a
            screen-reader user gets no warning before their context changes.
          */}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : (
        // Same address either way: it serves the coming-soon page while the
        // planner is unavailable, so there is no dead link to maintain.
        <a href="/kitchen-designer" className={SECONDARY}>
          {card.actionSoon}
        </a>
      )}
    </Card>
  );
}

/**
 * The material estimate, which is already on this page.
 *
 * Its button scrolls rather than navigates: the tool is a few hundred pixels
 * below, and a page load to reach it would be theatre.
 */
function EstimateCard() {
  return (
    <Card>
      <Status>Available now</Status>

      <h2 className="mt-5 text-2xl font-bold tracking-tight">
        Build a quick material estimate
      </h2>
      <p className="mt-3 text-base leading-relaxed text-white/70">
        Choose cabinets, countertops, and flooring from the catalog and see a
        running material total.
      </p>

      <Rule />
      <p className="mb-5 text-base font-semibold">
        Best if: You already know the products and sizes you need.
      </p>

      <a href={`#${ESTIMATOR_ANCHOR}`} className={PRIMARY}>
        Start your estimate
      </a>
    </Card>
  );
}
