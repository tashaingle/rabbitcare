import type { MetadataRoute } from "next";
import { getAllPages } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://rabbitcare.co.uk";
  const pages = getAllPages().filter((p) => p.slug !== "learn-more");

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/guides`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const contentRoutes: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `${base}/${page.slug}`,
    lastModified: page.date ? new Date(page.date) : new Date(),
    changeFrequency: "monthly" as const,
    priority: page.category === "tool" ? 0.85 : 0.7,
  }));

  return [...staticRoutes, ...contentRoutes];
}
