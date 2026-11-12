"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import type { Product, CabinetGroup } from "@/types/product";
import { groupKey, groupLabel, groupSlug, sizeCount } from "@/data/cabinet-labels";

interface CartItem {
  sku: string;
  name: string;
  image: string;
  price: number;
  priceUnit: "per-sqft" | "per-unit";
  quantity: number;
}

interface Props {
  lvpProducts: Product[];
  hardwoodProducts: Product[];
  cabinetCatalog: Product;
  countertopProducts: Product[];
}

const CABINET_SECTIONS = ["Wall Cabinets", "Base Cabinets", "Pantry Cabinets", "Accessories", "Specialty Cabinets", "Vanity Cabinets"];

export default function ProjectEstimator({ lvpProducts, hardwoodProducts, cabinetCatalog, countertopProducts }: Props) {
  const router = useRouter();
  // Deep link from the catalog (T306): /project-builder?group=<slug> opens that group's section and row.
  // An unknown or missing group leaves the estimator as it always opened: Cabinets, Wall Cabinets, every row closed.
  const searchParams = useSearchParams();
  const linkedGroup = useMemo(() => {
    const slug = searchParams.get("group");
    if (!slug) return null;
    return (cabinetCatalog.cabinetGroups ?? []).find((g) => groupSlug(g.section, g.group) === slug) ?? null;
  }, [searchParams, cabinetCatalog]);
  const [activeTab, setActiveTab] = useState<"lvp" | "hardwood" | "cabinets" | "countertops">("cabinets");
  const [activeCabinetSection, setActiveCabinetSection] = useState(linkedGroup?.section ?? "Wall Cabinets");
  // Which cabinet groups are open; kept while the visitor switches sections and comes back.
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set(linkedGroup ? [groupKey(linkedGroup.section, linkedGroup.group)] : []),
  );
  // Scroll the linked row into view once. Next.js scrolls to the top of the page on its own after a client
  // navigation, sometimes after this effect has run, so the scroll is repeated over the first second and once
  // more when the page has loaded, each time only if the row isn't in view yet and the visitor hasn't scrolled.
  const scrolledToLink = useRef(false);
  useEffect(() => {
    if (!linkedGroup || scrolledToLink.current) return;
    scrolledToLink.current = true;
    const id = `cabinet-group-${groupSlug(linkedGroup.section, linkedGroup.group)}`;
    let userScrolled = false;
    const markUser = () => { userScrolled = true; };
    const inView = () => {
      const r = document.getElementById(id)?.getBoundingClientRect();
      return !!r && r.top >= 0 && r.top < window.innerHeight / 2;
    };
    const scroll = () => { if (!userScrolled && !inView()) document.getElementById(id)?.scrollIntoView({ block: "start" }); };
    for (const ev of ["wheel", "touchmove", "keydown"]) window.addEventListener(ev, markUser, { passive: true });
    scroll();
    const frame = requestAnimationFrame(scroll);
    const timers = [100, 300, 600, 1000, 1500].map((ms) => window.setTimeout(scroll, ms));
    const onLoad = () => window.setTimeout(scroll, 0);
    if (document.readyState === "complete") onLoad(); else window.addEventListener("load", onLoad, { once: true });
    return () => {
      cancelAnimationFrame(frame);
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("load", onLoad);
      for (const ev of ["wheel", "touchmove", "keydown"]) window.removeEventListener(ev, markUser);
    };
  }, [linkedGroup]);

  function toggleGroup(key: string, open: boolean) {
    setOpenGroups((prev) => {
      if (prev.has(key) === open) return prev;
      const next = new Set(prev);
      if (open) next.add(key); else next.delete(key);
      return next;
    });
  }
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sqftInputs, setSqftInputs] = useState<Record<string, string>>({});

  // --- Cart helpers ---
  function addToCart(item: Omit<CartItem, "quantity">, qty: number) {
    setCart((prev) => {
      const existing = prev.find((c) => c.sku === item.sku);
      if (existing) {
        return prev.map((c) => c.sku === item.sku ? { ...c, quantity: c.quantity + qty } : c);
      }
      return [...prev, { ...item, quantity: qty }];
    });
  }

  function removeFromCart(sku: string) {
    setCart((prev) => prev.filter((c) => c.sku !== sku));
  }

  function updateQty(sku: string, qty: number) {
    if (qty <= 0) { removeFromCart(sku); return; }
    setCart((prev) => prev.map((c) => c.sku === sku ? { ...c, quantity: qty } : c));
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + (item.priceUnit === "per-unit" ? item.quantity : 1), 0);

  function handleAddFlooring(product: Product) {
    const sqft = parseFloat(sqftInputs[product.sku] || "");
    if (!sqft || sqft <= 0) return;
    addToCart({
      sku: product.sku,
      name: product.name,
      image: product.image,
      price: product.price,
      priceUnit: "per-sqft",
    }, sqft);
    setSqftInputs((prev) => ({ ...prev, [product.sku]: "" }));
  }

  function handleAddCabinet(item: { sku: string; dimensions: string; price?: number }, groupImage: string, groupName: string) {
    addToCart({
      sku: item.sku,
      name: `${groupName}, ${item.dimensions}`,
      image: groupImage,
      price: item.price ?? 0,
      priceUnit: "per-unit",
    }, 1);
  }

  function handleRequestQuote() {
    if (cart.length === 0) return;

    const lines: string[] = ["My estimate from the KOM Project Builder:\n"];

    const categories: Record<string, CartItem[]> = {};
    for (const item of cart) {
      const cat = item.priceUnit === "per-sqft" ? "Flooring" : "Cabinets";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(item);
    }

    for (const [cat, items] of Object.entries(categories)) {
      lines.push(`${cat}:`);
      for (const item of items) {
        const subtotal = item.price * item.quantity;
        const qtyLabel = item.priceUnit === "per-sqft"
          ? `${item.quantity.toLocaleString()} sqft`
          : `qty ${item.quantity}`;
        lines.push(`  • ${item.name} (${qtyLabel}): $${subtotal.toLocaleString()}`);
      }
      lines.push("");
    }

    lines.push(`Estimated total: $${cartTotal.toLocaleString()}`);
    lines.push("(Rough estimate only. Final pricing confirmed by KOM team.)");

    const text = lines.join("\n");
    localStorage.setItem("kom_estimate", text);
    router.push("/contact");
  }

  // --- Tab nav ---
  const tabs = [
    { key: "cabinets",     label: "Cabinets",     short: "Cabinets" },
    { key: "lvp",          label: "LVP Flooring", short: "LVP" },
    { key: "hardwood",     label: "Hardwood",     short: "Hardwood" },
    { key: "countertops",  label: "Countertops",  short: "Countertops" },
  ] as const;

  // --- Cabinet groups for active section ---
  const cabinetGroups = (cabinetCatalog.cabinetGroups ?? []).filter(
    (g) => g.section === activeCabinetSection
  );

  // --- Render ---
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* ── Left: Product browser ── */}
        <div className="w-full flex-1 min-w-0">

          {/* Category tabs */}
          <div className="grid grid-cols-4 gap-1 mb-6 sm:flex sm:pb-1 sm:border-b sm:border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-1 py-2 text-xs font-medium rounded text-center whitespace-nowrap sm:px-4 sm:text-sm sm:rounded-b-none transition-colors ${
                  activeTab === tab.key
                    ? "bg-[var(--color-brand-green)] text-white"
                    : "bg-gray-100 text-[var(--color-muted)] hover:text-[var(--color-text)] sm:bg-transparent"
                }`}
              >
                <span className="sm:hidden">{tab.short}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* ── LVP ── */}
          {activeTab === "lvp" && (
            <div>
              <p className="text-xs text-[var(--color-muted)] mb-5">Enter square footage for each collection and click Add.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {lvpProducts.map((p) => (
                  <div key={p.sku} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    {p.image && (
                      <div className="relative aspect-[16/7] bg-gray-50">
                        <Image src={p.image} alt={p.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
                      </div>
                    )}
                    <div className="p-4">
                      <p className="font-semibold text-[var(--color-text)] text-sm">{p.name}</p>
                      <p className="text-xs text-[var(--color-muted)] mt-0.5">{p.dimensions}</p>
                      <p className="mt-1 text-sm font-bold text-[var(--color-brand-green)]">${p.price.toFixed(2)} <span className="text-xs font-normal text-[var(--color-muted)]">/ sqft</span></p>
                      <div className="mt-3 flex gap-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="Sqft"
                          value={sqftInputs[p.sku] ?? ""}
                          onChange={(e) => setSqftInputs((prev) => ({ ...prev, [p.sku]: e.target.value }))}
                          className="w-24 rounded border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:border-[var(--color-brand-green)]"
                        />
                        <button
                          onClick={() => handleAddFlooring(p)}
                          className="flex-1 rounded bg-[var(--color-brand-green)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--color-brand-dark)] transition-colors"
                        >
                          + Add to Estimate
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Hardwood ── */}
          {activeTab === "hardwood" && (
            <div>
              <p className="text-xs text-[var(--color-muted)] mb-5">All widths are <strong>$3.59/sqft</strong>. Enter square footage and click Add.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {hardwoodProducts.filter(p => p.priceUnit === "per-sqft").map((p) => (
                  <div key={p.sku} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    {p.image && (
                      <div className="relative aspect-[16/7] bg-gray-50">
                        <Image src={p.image} alt={p.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
                      </div>
                    )}
                    <div className="p-4">
                      <p className="font-semibold text-[var(--color-text)] text-sm">{p.name}</p>
                      <p className="text-xs text-[var(--color-muted)] mt-0.5">{p.dimensions}</p>
                      <p className="mt-1 text-sm font-bold text-[var(--color-brand-green)]">${p.price.toFixed(2)} <span className="text-xs font-normal text-[var(--color-muted)]">/ sqft</span></p>
                      <div className="mt-3 flex gap-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="Sqft"
                          value={sqftInputs[p.sku] ?? ""}
                          onChange={(e) => setSqftInputs((prev) => ({ ...prev, [p.sku]: e.target.value }))}
                          className="w-24 rounded border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:border-[var(--color-brand-green)]"
                        />
                        <button
                          onClick={() => handleAddFlooring(p)}
                          className="flex-1 rounded bg-[var(--color-brand-green)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--color-brand-dark)] transition-colors"
                        >
                          + Add to Estimate
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Cabinets ── */}
          {activeTab === "cabinets" && (
            <div>
              {/* Section pills */}
              <div className="flex gap-2 flex-wrap mb-6">
                {CABINET_SECTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setActiveCabinetSection(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      activeCabinetSection === s
                        ? "bg-[var(--color-brand-green)] text-white"
                        : "bg-gray-100 text-[var(--color-muted)] hover:bg-gray-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                {cabinetGroups.map((group: CabinetGroup) => {
                  const key = groupKey(group.section, group.group);
                  const label = groupLabel(group.section, group.group);
                  return (
                  <details
                    key={group.group}
                    id={`cabinet-group-${groupSlug(group.section, group.group)}`}
                    open={openGroups.has(key)}
                    onToggle={(e) => toggleGroup(key, e.currentTarget.open)}
                    className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden scroll-mt-24"
                  >
                    {/* One collapsible row per group (T306): thumbnail, the same name as the catalog, size count */}
                    <summary className="flex items-center gap-3 px-4 py-3 min-h-[48px] cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:bg-gray-50 group-open:bg-gray-50 group-open:border-b group-open:border-gray-100">
                      <span className="relative shrink-0 w-12 h-12 rounded-lg bg-gray-50 overflow-hidden">
                        {group.image ? (
                          <Image src={group.image} alt="" fill className="object-contain p-1" sizes="48px" />
                        ) : null}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block font-semibold text-sm text-[var(--color-text)]">{label}</span>
                        <span className="block text-xs text-[var(--color-muted)]">{sizeCount(group.items)}</span>
                      </span>
                      <svg aria-hidden="true" viewBox="0 0 20 20" className="shrink-0 w-5 h-5 text-[var(--color-muted)] transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </summary>

                    {/* Items table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-50">
                            <th className="text-left px-4 py-2 font-semibold text-[var(--color-muted)] uppercase tracking-wide">Size</th>
                            <th className="text-right px-2 py-2 font-semibold text-[var(--color-muted)] uppercase tracking-wide">Price</th>
                            <th className="px-3 py-2 w-10"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.items.map((item, idx) => {
                            const inCart = cart.find((c) => c.sku === item.sku);
                            return (
                              <tr key={item.sku} className={`border-b border-gray-50 last:border-0 ${idx % 2 === 0 ? "" : "bg-gray-50/30"}`}>
                                <td className="px-4 py-2 text-[var(--color-text)]">{item.dimensions}</td>
                                <td className="px-2 py-2 text-right font-medium text-[var(--color-text)] whitespace-nowrap">
                                  {item.price ? `$${item.price}` : "n/a"}
                                </td>
                                <td className="px-3 py-2 text-right">
                                  {inCart ? (
                                    <span className="text-[var(--color-brand-green)] font-semibold">✓ {inCart.quantity}</span>
                                  ) : (
                                    <button
                                      onClick={() => handleAddCabinet(item, group.image, label)}
                                      className="w-6 h-6 rounded-full bg-[var(--color-brand-green)] text-white text-sm font-bold hover:bg-[var(--color-brand-dark)] transition-colors flex items-center justify-center"
                                    >
                                      +
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </details>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Countertops ── */}
          {activeTab === "countertops" && (
            <div>
              <p className="text-xs text-[var(--color-muted)] mb-5">Enter square footage for each material and click Add. Sink cutout included in quartz pricing.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {countertopProducts.filter((p) => p.priceUnit === "per-sqft").map((p) => (
                  <div key={p.sku} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    {p.image && (
                      <div className="relative aspect-[16/7] bg-gray-50">
                        <Image src={p.image} alt={p.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
                      </div>
                    )}
                    <div className="p-4">
                      <p className="font-semibold text-[var(--color-text)] text-sm">{p.name}</p>
                      <p className="text-xs text-[var(--color-muted)] mt-0.5">{p.dimensions}</p>
                      <p className="mt-1 text-sm font-bold text-[var(--color-brand-green)]">${p.price.toFixed(2)} <span className="text-xs font-normal text-[var(--color-muted)]">/ sqft</span></p>
                      <p className="text-xs text-[var(--color-muted)] mt-1 leading-relaxed">{p.notes}</p>
                      <div className="mt-3 flex gap-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="Sqft"
                          value={sqftInputs[p.sku] ?? ""}
                          onChange={(e) => setSqftInputs((prev) => ({ ...prev, [p.sku]: e.target.value }))}
                          className="w-24 rounded border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:border-[var(--color-brand-green)]"
                        />
                        <button
                          onClick={() => handleAddFlooring(p)}
                          className="flex-1 rounded bg-[var(--color-brand-green)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--color-brand-dark)] transition-colors"
                        >
                          + Add to Estimate
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Cart sidebar ── */}
        <div className="w-full lg:w-80 lg:sticky lg:top-24 shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-[var(--color-brand-green)] px-4 py-3">
              <h2 className="font-bold text-white text-sm">Your Estimate</h2>
              {cart.length > 0 && (
                <p className="text-white/70 text-xs mt-0.5">{cartCount} item{cartCount !== 1 ? "s" : ""} selected</p>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-[var(--color-muted)]">No items yet.</p>
                <p className="text-xs text-[var(--color-muted)] mt-1">Browse products and click + to add.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {cart.map((item) => (
                  <div key={item.sku} className="px-4 py-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[var(--color-text)] truncate">{item.name}</p>
                        <p className="text-xs text-[var(--color-muted)] mt-0.5">
                          {item.priceUnit === "per-sqft"
                            ? `${item.quantity.toLocaleString()} sqft × $${item.price}/sqft`
                            : `$${item.price} each`}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.sku)}
                        className="text-gray-300 hover:text-red-400 text-xs shrink-0"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Qty controls */}
                    <div className="flex items-center justify-between mt-2">
                      {item.priceUnit === "per-unit" ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQty(item.sku, item.quantity - 1)} className="w-5 h-5 rounded border border-gray-200 text-xs flex items-center justify-center hover:border-gray-300">−</button>
                          <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQty(item.sku, item.quantity + 1)} className="w-5 h-5 rounded border border-gray-200 text-xs flex items-center justify-center hover:border-gray-300">+</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQty(item.sku, parseFloat(e.target.value) || 0)}
                            className="w-16 rounded border border-gray-200 px-2 py-0.5 text-xs focus:outline-none focus:border-[var(--color-brand-green)]"
                          />
                          <span className="text-xs text-[var(--color-muted)]">sqft</span>
                        </div>
                      )}
                      <p className="text-xs font-bold text-[var(--color-text)]">
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total + CTA */}
            <div className="px-4 py-4 border-t border-gray-100 bg-gray-50/50">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-[var(--color-text)]">Est. Total</span>
                <span className="text-lg font-bold text-[var(--color-text)]">
                  ${cartTotal.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-[var(--color-muted)] mb-4">
                Rough estimate only. Prices subject to confirmation with our team.
              </p>
              <button
                onClick={handleRequestQuote}
                disabled={cart.length === 0}
                className="w-full rounded bg-[var(--color-brand-green)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--color-brand-dark)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Request Official Quote →
              </button>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="w-full mt-2 text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
                >
                  Clear estimate
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile sticky bar ── */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg px-4 py-3 flex items-center justify-between lg:hidden z-50">
          <div>
            <p className="text-xs text-[var(--color-muted)]">{cartCount} item{cartCount !== 1 ? "s" : ""}</p>
            <p className="text-sm font-bold text-[var(--color-text)]">${cartTotal.toLocaleString()} est.</p>
          </div>
          <button
            onClick={handleRequestQuote}
            className="rounded bg-[var(--color-brand-green)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-brand-dark)] transition-colors"
          >
            Request Quote →
          </button>
        </div>
      )}
    </div>
  );
}
