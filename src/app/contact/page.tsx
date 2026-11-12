import { getSiteSettings } from "@/sanity/lib/queries";
import ContactForm from "@/components/ContactForm";

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const phone = settings?.phone || "(313) 559-1888";
  const email = settings?.email || "BuildingMaterials@KOM-USA.com";
  const address = settings?.address || "15497 Beech Daly Road\nRedford Township, MI 48239";
  const hours: { days: string; hours: string }[] = settings?.showroomHours || [];

  return (
    <>
      <section className="bg-[var(--color-brand-green)] text-white py-14 px-4">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm text-[var(--color-brand-dark)] font-semibold mb-2">Contact</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Get in Touch</h1>
          <p className="mt-4 text-white/90 text-base leading-relaxed max-w-2xl">
            Reach us by phone, email, or stop by the showroom. Bring your measurements, photos, and
            questions. We&apos;ll help you figure out the right products and put together an estimate.
          </p>
        </div>
      </section>

      <section className="py-14 px-4 bg-white">
        <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text)] mb-6">Showroom &amp; Contact</h2>
            <dl className="space-y-5 text-sm">
              <div>
                <dt className="font-semibold text-[var(--color-brand-dark)]">Address</dt>
                <dd className="mt-1 text-[var(--color-muted)] whitespace-pre-line">{address}</dd>
                <dd className="mt-2 inline-block rounded bg-[var(--color-brand-green)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--color-brand-dark)]">
                  New Garden City showroom coming soon
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--color-brand-dark)]">Phone</dt>
                <dd className="mt-1">
                  <a href={`tel:${phone.replace(/\D/g, '')}`} className="text-[var(--color-muted)] hover:text-[var(--color-brand-dark)] transition-colors">
                    {phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--color-brand-dark)]">Email</dt>
                <dd className="mt-1">
                  <a href={`mailto:${email}`} className="text-[var(--color-muted)] hover:text-[var(--color-brand-dark)] transition-colors">
                    {email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--color-brand-dark)]">Showroom Hours</dt>
                <dd className="mt-1 text-[var(--color-muted)] space-y-0.5">
                  {hours.map((h, i) => (
                    <p key={i}>{h.days}: {h.hours}</p>
                  ))}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[var(--color-text)] mb-6">Send Us a Message</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
