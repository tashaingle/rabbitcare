import type { MetadataRoute } from "next";
import { getLiveSlugs } from "@/lib/content";

const base = "https://rabbitcare.co.uk";

// Same addresses as the old WordPress sitemap (trailing slashes included), so
// Search Console sees the pages it already knows.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    ...getLiveSlugs().map((slug) => ({
      url: `${base}/${slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
