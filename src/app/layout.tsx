import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getSiteSettings } from "@/sanity/lib/queries";
import { SanityLive } from "@/sanity/lib/live";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "KOM Building Materials — Cabinets, Countertops & Flooring in Metro Detroit",
    template: "%s | KOM Building Materials",
  },
  description:
    "Visit our Redford Township showroom or browse online. Cabinets, countertops, LVP and hardwood flooring — expert guidance, competitive prices.",
  metadataBase: new URL("https://screwthemiddleman.com"),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased bg-[var(--color-background)]">
        <Header
          announcement={
            settings?.announcementBar ||
              "New Garden City showroom coming soon — Redford Township open now."
          }
        />
        <main className="flex-1">{children}</main>
        <Footer />
        <SanityLive />
      </body>
    </html>
  );
}
