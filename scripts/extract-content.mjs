/**
 * Extract published content pages from a WordPress WXR export.
 * Usage: node scripts/extract-content.mjs [path-to-export.xml]
 *
 * Rewrites media URLs to local /wp-content/uploads/ (see scripts/sync-images.mjs).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const defaultXml = path.resolve(root, "..", "rabbitcare.WordPress.2026-07-30.xml");
const xmlPath = process.argv[2] ? path.resolve(process.argv[2]) : defaultXml;
const outDir = path.join(root, "content", "pages");

const SKIP_SLUGS = new Set([
  "cart",
  "checkout",
  "my-account",
  "orders-tracking",
  "shop",
  "shop-2",
  "basket",
  // home is written separately as content/home.html
]);

if (!fs.existsSync(xmlPath)) {
  console.error("Export not found:", xmlPath);
  process.exit(1);
}

const content = fs.readFileSync(xmlPath, "utf8");
const items = content.match(/<item>[\s\S]*?<\/item>/g) || [];

function cdata(item, tag) {
  const re = new RegExp(
    `<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`
  );
  const m = item.match(re);
  if (m) return m[1];
  const re2 = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`);
  const m2 = item.match(re2);
  return m2 ? m2[1] : "";
}

function cleanHtml(html) {
  if (!html) return "";
  let h = html;
  h = h.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "");
  // strip WP block comments only (keep HTML design comments)
  h = h.replace(/<!--\s*\/?wp:[\s\S]*?-->/g, "");

  // Local media paths for Vercel (files live in public/wp-content/uploads)
  h = h.replace(
    /https?:\/\/rabbitcare\.co\.uk\/wp-content\/uploads\//g,
    "/wp-content/uploads/"
  );
  // Any remaining absolute site links → relative
  h = h.replace(/https?:\/\/rabbitcare\.co\.uk\//g, "/");

  // Drop trailing slashes on internal hrefs (Next.js default)
  h = h.replace(/href="\/([^"#?]*?)\/"/g, 'href="/$1"');
  h = h.replace(/href="\/([^"#?]*?)\/#/g, 'href="/$1#');
  h = h.replace(/href="\/([^"#?]*?)\/\?/g, 'href="/$1?');

  // Homepage is /
  h = h.replace(/href="\/home"/g, 'href="/"');

  return h.trim();
}

function extractMetaDescription(html, title) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const cleaned = text
    .replace(/^.*?RabbitCare\.co\.uk[^.]*\.\s*/i, "")
    .replace(/Home\s*›\s*[^.]+/i, "")
    .trim();
  const source = cleaned.length > 80 ? cleaned : text;
  if (source.length > 40) {
    return source.slice(0, 158).replace(/\s+\S*$/, "") + "…";
  }
  return `${title} — practical rabbit care advice for UK owners.`;
}

function pageCategory(slug) {
  if (slug.startsWith("can-rabbits-eat") && slug !== "can-rabbits-eat-this")
    return "food";
  if (
    [
      "can-rabbits-eat-this",
      "rabbit-symptom-checker",
      "rabbit-housing-size-calculator",
      "new-rabbit-owner-checklist",
    ].includes(slug)
  )
    return "tool";
  if (["privacy-policy", "contact-us", "author", "learn-more"].includes(slug))
    return "info";
  if (slug === "home") return "home";
  return "guide";
}

fs.mkdirSync(outDir, { recursive: true });

const pages = [];
let homeBody = null;

for (const item of items) {
  const type = cdata(item, "wp:post_type");
  const status = cdata(item, "wp:status");
  if (type !== "page" || status !== "publish") continue;

  const title = cdata(item, "title") || "";
  const slug = cdata(item, "wp:post_name") || "";
  if (!slug || SKIP_SLUGS.has(slug)) continue;

  const body = cleanHtml(cdata(item, "content:encoded"));
  const date = cdata(item, "wp:post_date");
  const category = pageCategory(slug);
  const description = extractMetaDescription(body, title);

  if (slug === "home") {
    homeBody = body;
    fs.writeFileSync(path.join(root, "content", "home.html"), body);
    console.log("Wrote content/home.html", body.length, "chars");
    continue;
  }

  const page = { title, slug, date, category, description, body };
  fs.writeFileSync(path.join(outDir, `${slug}.json`), JSON.stringify(page, null, 2));
  pages.push({ title, slug, date, category, description });
}

pages.sort((a, b) => a.title.localeCompare(b.title));
fs.writeFileSync(
  path.join(root, "content", "index.json"),
  JSON.stringify(pages, null, 2)
);

// Extract foods array for React food checker
const foodPath = path.join(outDir, "can-rabbits-eat-this.json");
if (fs.existsSync(foodPath)) {
  const full = JSON.parse(fs.readFileSync(foodPath, "utf8"));
  const m = full.body.match(/const foods = (\[[\s\S]*?\]);/);
  if (m) {
    try {
      const foods = Function(`"use strict"; return (${m[1]})`)();
      for (const f of foods) {
        if (f.url) f.url = f.url.replace(/\/$/, "").replace(/https?:\/\/rabbitcare\.co\.uk/, "");
      }
      fs.writeFileSync(
        path.join(root, "content", "foods.json"),
        JSON.stringify(foods, null, 2)
      );
      console.log("Extracted foods:", foods.length);
    } catch (e) {
      console.warn("Could not parse foods array:", e.message);
    }
  }
}

console.log(`Extracted ${pages.length} pages → content/pages/`);
if (!homeBody) console.warn("No published Home page found in export");
const byCat = {};
for (const p of pages) byCat[p.category] = (byCat[p.category] || 0) + 1;
console.log(byCat);
