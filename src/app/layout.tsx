import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang="en-GB">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        <main className="site-main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
