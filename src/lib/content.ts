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
