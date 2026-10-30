import fs from "fs";
import path from "path";

const contentRoot = path.join(process.cwd(), "content");

export type PageMeta = {
  title: string;
  slug: string;
  date: string;
  category: "guide" | "food" | "tool" | "info" | string;
  description: string;
};

export type PageContent = PageMeta & {
  body: string;
};

export type FoodItem = {
  name: string;
  aliases?: string[];
  emoji: string;
  category: string;
  status: "safe" | "treat" | "caution" | "unsafe" | string;
  label: string;
  summary: string;
  frequency?: string;
  amount?: string;
  prepare?: string;
  warning?: string;
  url?: string;
};

/** A page mirrored from the live site by scripts/sync-live.mjs. */
export type LivePageData = {
  title: string;
  description: string;
  bodyClass: string;
  css: string;
  html: string;
};

const liveRoot = path.join(contentRoot, "live");

export function getLivePage(slug: string): LivePageData | null {
  const file = path.join(liveRoot, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8")) as LivePageData;
}

export function getLiveSlugs(): string[] {
  return fs
    .readdirSync(liveRoot)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
    .map((f) => f.replace(/\.json$/, ""));
}

/** Decode the HTML entities WordPress puts in titles and meta tags. */
export function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export function getAllPages(): PageMeta[] {
  const indexPath = path.join(contentRoot, "index.json");
  return JSON.parse(fs.readFileSync(indexPath, "utf8")) as PageMeta[];
}

export function getPage(slug: string): PageContent | null {
  const file = path.join(contentRoot, "pages", `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8")) as PageContent;
}

export function getPagesByCategory(category: string): PageMeta[] {
  return getAllPages().filter((p) => p.category === category);
}

export function getFoods(): FoodItem[] {
  const file = path.join(contentRoot, "foods.json");
  return JSON.parse(fs.readFileSync(file, "utf8")) as FoodItem[];
}

export function getGuideNav(): PageMeta[] {
  return getAllPages().filter((p) =>
    ["guide", "tool"].includes(p.category)
  );
}
