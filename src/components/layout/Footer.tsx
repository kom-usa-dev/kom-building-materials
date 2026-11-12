import Link from "next/link";
import { getSiteSettings } from "@/sanity/lib/queries";

const categories = [
  { label: "Cabinets", href: "/cabinets" },
  { label: "Countertops", href: "/countertops" },
  { label: "LVP Flooring", href: "/lvp-flooring" },
  { label: "Hardwood Flooring", href: "/hardwood-flooring" },
];

const company = [
  { label: "About Us", href: "/about" },
  { label: "Financing", href: "/financing" },
  { label: "Contact", href: "/contact" },
  { label: "Build Your Project", href: "/project-builder" },
];

const external = [
  { label: "KOM USA", href: "https://kom-usa.com", description: "KOM family of services" },
];

export default async function Footer() {
  const settings = await getSiteSettings();

  const phone = settings?.phone || "(313) 559-1888";
  const email = settings?.email || "BuildingMaterials@KOM-USA.com";
  const address: string = settings?.address || "15497 Beech Daly Road\nRedford Township, MI 48239";
  const hours: { days: string; hours: string }[] = settings?.showroomHours || [];

  return (
    <footer className="bg-[var(--color-brand-dark)] text-white/80 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="text-white font-black text-xl tracking-tight">
              <span className="text-[var(--color-brand-green)]">KOM</span> Building Materials
            </p>
            <p className="mt-3 text-sm leading-relaxed max-w-xs">
              An online showroom backed by a physical location in Redford Township.
              Professional guidance, premium products, competitive prices.
            </p>
            {hours.length > 0 && (
              <div className="mt-4 text-xs text-white/60 space-y-0.5">
                {hours.map((h, i) => (
                  <p key={i}>{h.days}: {h.hours}</p>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-white text-sm font-semibold tracking-wide uppercase mb-4">Products</p>
            <ul className="space-y-2">
              {categories.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-white text-sm font-semibold tracking-wide uppercase mb-4">Company</p>
            <ul className="space-y-2 mb-6">
              {company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
            <address className="not-italic text-sm space-y-1">
              {address.split("\n").map((line, i) => <p key={i}>{line}</p>)}
              <a href={`tel:${phone.replace(/\D/g, "")}`} className="block hover:text-white transition-colors mt-2">{phone}</a>
              <a href={`mailto:${email}`} className="block hover:text-white transition-colors">{email}</a>
            </address>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-white/40">
          <div className="space-y-1">
            <p>Small orders are typically available immediately. For larger orders, contact us to confirm availability before ordering.</p>
            <p>© {new Date().getFullYear()} KOM Building Materials. All rights reserved.</p>
          </div>
          <div className="shrink-0">
            {external.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/70 transition-colors"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
