/**
 * Extract published WooCommerce products from the WordPress export
 * into content/products.json for the Next.js shop.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const xmlPath = path.resolve(root, "..", "rabbitcare.WordPress.2026-07-30.xml");
const outPath = path.join(root, "content", "products.json");
const categoriesOut = path.join(root, "content", "product-categories.json");

if (!fs.existsSync(xmlPath)) {
  console.error("Export not found:", xmlPath);
  process.exit(1);
}

const xml = fs.readFileSync(xmlPath, "utf8");
const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];

function cdata(item, tag) {
  const m = item.match(
    new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`)
  );
  if (m) return m[1];
  const m2 = item.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
  return m2 ? m2[1] : "";
}

function getMeta(item) {
  const meta = {};
  const re =
    /<wp:meta_key><!\[CDATA\[([^\]]+)\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[([\s\S]*?)\]\]><\/wp:meta_value>/g;
  let m;
  while ((m = re.exec(item))) {
    meta[m[1]] = m[2];
  }
  return meta;
}

function cleanText(html) {
  return (html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

// attachment id -> file URL path
const attachments = new Map();
for (const item of items) {
  if (cdata(item, "wp:post_type") !== "attachment") continue;
  const id = cdata(item, "wp:post_id");
  const meta = getMeta(item);
  let url =
    meta._wp_attached_file ||
    (item.match(/<wp:attachment_url><!\[CDATA\[([^\]]+)\]\]><\/wp:attachment_url>/) ||
      [])[1] ||
    "";
  if (url.startsWith("http")) {
    url = url.replace(/^https?:\/\/rabbitcare\.co\.uk\/wp-content\/uploads\//, "");
  }
  // _wp_attached_file is often "2026/05/name.webp"
  if (url) {
    attachments.set(id, url.replace(/^\/+/, "").replace(/^wp-content\/uploads\//, ""));
  }
}

function imagePath(file) {
  if (!file) return null;
  const rel = file.replace(/^\/+/, "").replace(/^wp-content\/uploads\//, "");
  return `/wp-content/uploads/${rel}`;
}

// product categories from domain=product_cat
const catTerms = new Map();
const catBlocks = xml.match(/<wp:category>[\s\S]*?<\/wp:category>/g) || [];
// also wp:term with product_cat
const termBlocks = xml.match(/<wp:term>[\s\S]*?<\/wp:term>/g) || [];
for (const block of termBlocks) {
  const tax = cdata(block, "wp:term_taxonomy");
  if (tax !== "product_cat") continue;
  const slug = cdata(block, "wp:term_slug");
  const name = cdata(block, "wp:term_name");
  catTerms.set(slug, name);
}

const products = [];
for (const item of items) {
  if (cdata(item, "wp:post_type") !== "product") continue;
  if (cdata(item, "wp:status") !== "publish") continue;

  const title = cdata(item, "title");
  const slug = cdata(item, "wp:post_name");
  if (!slug) continue;

  const meta = getMeta(item);
  const content = cdata(item, "content:encoded");
  const excerpt = cdata(item, "excerpt:encoded");

  const price = parseFloat(meta._regular_price || meta._price || "0") || 0;
  const salePrice = meta._sale_price ? parseFloat(meta._sale_price) : null;
  const sku = meta._sku || "";

  // categories
  const categories = [];
  const catRe =
    /<category\s+domain="product_cat"\s+nicename="([^"]+)"[^>]*><!\[CDATA\[([^\]]*)\]\]><\/category>/g;
  let cm;
  while ((cm = catRe.exec(item))) {
    categories.push({ slug: cm[1], name: cm[2] });
  }

  // images: thumbnail + gallery
  const imageIds = [];
  if (meta._thumbnail_id) imageIds.push(meta._thumbnail_id);
  if (meta._product_image_gallery) {
    for (const id of meta._product_image_gallery.split(",")) {
      const t = id.trim();
      if (t && !imageIds.includes(t)) imageIds.push(t);
    }
  }

  const images = imageIds
    .map((id) => imagePath(attachments.get(id)))
    .filter(Boolean);

  // fallback: any upload path in content
  if (!images.length) {
    const found = [
      ...content.matchAll(
        /(?:https?:\/\/rabbitcare\.co\.uk)?\/wp-content\/uploads\/([0-9]{4}\/[0-9]{2}\/[^"'?\s)]+)/g
      ),
    ];
    for (const m of found) {
      const p = imagePath(m[1].replace(/\/$/, ""));
      if (p && !images.includes(p)) images.push(p);
    }
  }

  const description = cleanText(excerpt || content).slice(0, 500);
  const bodyHtml = (content || "")
    .replace(/https?:\/\/rabbitcare\.co\.uk\/wp-content\/uploads\//g, "/wp-content/uploads/")
    .replace(/https?:\/\/rabbitcare\.co\.uk\//g, "/")
    .trim();

  products.push({
    id: cdata(item, "wp:post_id"),
    title,
    slug,
    sku,
    price,
    salePrice: salePrice && !Number.isNaN(salePrice) ? salePrice : null,
    currency: "GBP",
    categories,
    images,
    description,
    bodyHtml: bodyHtml.slice(0, 20000),
    stockStatus: meta._stock_status || "instock",
  });
}

products.sort((a, b) => a.title.localeCompare(b.title));

// category index
const catMap = new Map();
for (const p of products) {
  for (const c of p.categories) {
    if (!catMap.has(c.slug)) catMap.set(c.slug, { slug: c.slug, name: c.name, count: 0 });
    catMap.get(c.slug).count++;
  }
}
const categories = [...catMap.values()].sort((a, b) => a.name.localeCompare(b.name));

fs.writeFileSync(outPath, JSON.stringify(products, null, 2));
fs.writeFileSync(categoriesOut, JSON.stringify(categories, null, 2));

const withImg = products.filter((p) => p.images.length).length;
const withPrice = products.filter((p) => p.price > 0).length;
console.log(`Products: ${products.length}`);
console.log(`With images: ${withImg}`);
console.log(`With price: ${withPrice}`);
console.log(`Categories: ${categories.length}`);
console.log(categories.map((c) => `  ${c.name} (${c.count})`).join("\n"));
console.log("Wrote", outPath);
