import fs from "fs";
import path from "path";

export type Pick = { badge: string; product: string; why: string; shop: string; url: string };
export type Picks = { title: string; intro: string; picks: Pick[] };

/**
 * Affiliate product picks for a guide (content/picks.json). Picks without a
 * link are left out of production builds, so unfinished ones never go live;
 * in development they still show so the layout can be previewed.
 */
export function getPicks(slug: string): Picks | null {
  const file = path.join(process.cwd(), "content", "picks.json");
  const all = JSON.parse(fs.readFileSync(file, "utf8")) as Record<string, Picks | string>;
  const entry = all[slug];
  if (!entry || typeof entry === "string") return null;
  const preview = process.env.NODE_ENV !== "production";
  const picks = entry.picks.filter((pick) => pick.url || preview);
  return picks.length > 0 ? { ...entry, picks } : null;
}
