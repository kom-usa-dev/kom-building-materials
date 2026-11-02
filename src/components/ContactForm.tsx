"use client";

import { useState, useEffect } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [fields, setFields] = useState({
    name: "",
    phone: "",
    email: "",
    interest: "",
    message: "",
  });

  useEffect(() => {
    const estimate = localStorage.getItem("kom_estimate");
    if (estimate) {
      // One-time pre-fill from browser storage on page load (the estimator's "Request a quote"
      // hands the cart text over this way). The rule can't tell this apart from a render loop.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFields((prev) => ({ ...prev, message: estimate, interest: "Multiple / Not sure yet" }));
      localStorage.removeItem("kom_estimate");
    }
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/netlify-forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ "form-name": "contact", ...fields }).toString(),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg bg-green-50 border border-green-100 p-6 text-center">
        <p className="font-semibold text-green-800">Message sent!</p>
        <p className="mt-1 text-sm text-green-700">We&apos;ll get back to you within one business day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-xs font-medium text-[var(--color-text)] mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name" name="name" type="text" required
            value={fields.name} onChange={handleChange}
            className="w-full rounded border border-gray-200 px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-brand-green)] focus:ring-1 focus:ring-[var(--color-brand-green)]"
            placeholder="Jane Smith"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-xs font-medium text-[var(--color-text)] mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            id="phone" name="phone" type="tel" required
            value={fields.phone} onChange={handleChange}
            className="w-full rounded border border-gray-200 px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-brand-green)] focus:ring-1 focus:ring-[var(--color-brand-green)]"
            placeholder="(313) 555-0100"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-xs font-medium text-[var(--color-text)] mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email" name="email" type="email" required
          value={fields.email} onChange={handleChange}
          className="w-full rounded border border-gray-200 px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-brand-green)] focus:ring-1 focus:ring-[var(--color-brand-green)]"
          placeholder="jane@example.com"
        />
      </div>

      <div>
        <label htmlFor="interest" className="block text-xs font-medium text-[var(--color-text)] mb-1">
          I&apos;m interested in
        </label>
        <select
          id="interest" name="interest"
          value={fields.interest} onChange={handleChange}
          className="w-full rounded border border-gray-200 px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-brand-green)] focus:ring-1 focus:ring-[var(--color-brand-green)] bg-white"
        >
          <option value="">Select a category</option>
          <option>Cabinets</option>
          <option>Countertops</option>
          <option>LVP Flooring</option>
          <option>Hardwood Flooring</option>
          <option>Full Kitchen Package</option>
          <option>Multiple / Not sure yet</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-medium text-[var(--color-text)] mb-1">
          Tell us about your project
        </label>
        <textarea
          id="message" name="message" rows={4}
          value={fields.message} onChange={handleChange}
          className="w-full rounded border border-gray-200 px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-brand-green)] focus:ring-1 focus:ring-[var(--color-brand-green)] resize-none"
          placeholder="Room size, timeline, questions, anything helpful..."
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">Something went wrong — please try again or call us directly.</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded bg-[var(--color-brand-green)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--color-brand-green-dark)] transition-colors disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
