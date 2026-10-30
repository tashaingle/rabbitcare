import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Serif } from "next/font/google";
import "./globals.css";

// Used by the site header everywhere and the homepage design.
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RabbitCare.co.uk | Practical Rabbit Care Advice for UK Owners",
    template: "%s | RabbitCare.co.uk",
  },
  description:
    "Rabbit care advice for UK owners. Guides on hay, bedding, behaviour, safe foods, housing and when to call a vet.",
  metadataBase: new URL("https://rabbitcare.co.uk"),
  openGraph: {
    siteName: "RabbitCare.co.uk",
    locale: "en_GB",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${display.variable} ${serif.variable}`}>
      <head>
        {/* Theme and block styles copied from WordPress (scripts/sync-live.mjs) */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/wp/site.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
