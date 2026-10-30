import type { Metadata } from "next";
import { Binky } from "@/components/home/Binky";
import { DayCycle } from "@/components/home/DayCycle";
import { FoodStamp, type Food } from "@/components/home/FoodStamp";
import { Hero } from "@/components/home/Hero";
import { Lineup } from "@/components/home/Lineup";
import { Thump } from "@/components/home/Thump";
import s from "@/components/home/home.module.css";
import { Footer } from "@/components/nav/Footer";
import { SiteNav } from "@/components/nav/SiteNav";
import { getFoods } from "@/lib/content";

const TITLE = "RabbitCare.co.uk | Practical Rabbit Care Advice for UK Owners";
// Kept identical to the WordPress homepage so search snippets don't change.
const DESCRIPTION =
  "Practical rabbit care advice for UK owners, including feeding, housing, bedding, behaviour, bonding, enrichment and rabbit health warning signs.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    images: [{ url: "/home/photos/magpie-1920.webp", width: 1920, height: 1277 }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

// Site identity for Google, carried over from WordPress.
const SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://rabbitcare.co.uk/#website",
      name: "RabbitCare.co.uk",
      alternateName: "RabbitCare",
      url: "https://rabbitcare.co.uk/",
      description: DESCRIPTION,
      publisher: { "@id": "https://rabbitcare.co.uk/#organization" },
      inLanguage: "en-GB",
    },
    {
      "@type": "Organization",
      "@id": "https://rabbitcare.co.uk/#organization",
      name: "RabbitCare.co.uk",
      alternateName: "RabbitCare",
      url: "https://rabbitcare.co.uk/",
      logo: {
        "@type": "ImageObject",
        url: "https://rabbitcare.co.uk/wp-content/uploads/2026/05/6aa59d6f-d9e8-458f-bcc1-d015064d4a36.png",
      },
    },
  ],
};

export default function HomePage() {
  const foods: Food[] = getFoods();
  return (
    <div className={`home ${s.home}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />
      <SiteNav />
      <main>
        <Hero />
        <Binky />
        <DayCycle />
        <FoodStamp foods={foods} />
        <Thump />
        <Lineup />
      </main>
      <Footer />
    </div>
  );
}
