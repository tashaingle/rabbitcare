/**
 * Mirror the rendered design of the live WordPress site into this project so
 * pages look exactly like rabbitcare.co.uk (theme CSS, fonts, header, footer,
 * page HTML, images).
 *
 * Usage: node scripts/sync-live.mjs
 *
 * Writes:
 *   content/live/<slug>.json   per-page { title, bodyClass, css, html }
 *   content/chrome/header.html header template part (used by shop pages)
 *   content/chrome/footer.html footer template part (used by shop pages)
 *   public/wp/site.css         theme + block styles shared by every page
 *   public/wp-content/...      any referenced media / fonts not already present
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const ORIGIN = "https://rabbitcare.co.uk";
const publicDir = path.join(root, "public");
const liveDir = path.join(root, "content", "live");

// WooCommerce pages are rebuilt in Next.js (shop, product, cart, Stripe).
const SKIP_SLUGS = new Set([
  "cart",
  "checkout",
  "my-account",
  "orders-tracking",
  "shop",
  "shop-2",
  "basket",
]);

// Plugin stylesheets for WooCommerce widgets that are not rendered here.
const SKIP_CSS = /woocommerce|bopo|fewc|woo-cart-all-in-one|woo-notification|wc-blocks/;

async function get(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": "RabbitCare-sync" } });
    if (res.ok) return res;
    if (res.status === 404) return null;
    await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
  }
  return null;
}

const downloaded = new Set();

/** Download a same-site asset into public/ (keeping its path) if missing. */
async function ensureAsset(absUrl) {
  const u = new URL(absUrl);
  const rel = decodeURIComponent(u.pathname);
  if (downloaded.has(rel)) return;
  downloaded.add(rel);
  const dest = path.join(publicDir, rel);
  if (fs.existsSync(dest)) return;
  const res = await get(u.origin + u.pathname);
  if (!res) {
    console.warn("  missing asset", rel);
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

const ASSET_RE =
  /https?:(?:\\?\/){2}(?:www\.)?rabbitcare\.co\.uk((?:\\?\/)wp-(?:content|includes)(?:\\?\/)[^\s"'()<>,\\]*(?:\\\/[^\s"'()<>,\\]*)*)/g;

/** Download every referenced asset and make all site URLs root-relative. */
async function localise(text) {
  const assets = new Set();
  for (const m of text.matchAll(ASSET_RE)) {
    const p = m[1].replace(/\\\//g, "/").split(/[?#]/)[0];
    if (/\.(png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|otf|mp4|webm)$/i.test(p)) {
      assets.add(ORIGIN + p);
    }
  }
  for (const a of assets) await ensureAsset(a);

  return text
    .replace(/https?:\/\/(?:www\.)?rabbitcare\.co\.uk(?=\/|["'])/g, "")
    .replace(/https?:\\\/\\\/(?:www\.)?rabbitcare\.co\.uk(?=\\\/|["'])/g, "")
    .replace(/(["'(])\/(wp-(?:content|includes)\/[^"')?\s]+)\?ver=[^"')\s]*/g, "$1/$2");
}

/** Make relative url(...) references in a stylesheet absolute to its origin. */
function absolutiseCss(css, cssUrl) {
  return css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (all, q, ref) => {
    if (/^(data:|https?:|\/\/|#)/.test(ref)) return all;
    return `url(${q}${new URL(ref, cssUrl).href}${q})`;
  });
}

function splitPage(html) {
  const headEnd = html.indexOf("</head>");
  const head = html.slice(0, headEnd);
  const body = html.slice(headEnd);

  const title = (head.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || "";
  const description =
    (head.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "";
  const bodyClass = (body.match(/<body[^>]*class="([^"]*)"/) || [])[1] || "";

  const inlineStyles = [...head.matchAll(/<style([^>]*)>([\s\S]*?)<\/style>/g)].map(
    (m) => ({ id: (m[1].match(/id=['"]([^'"]+)/) || [])[1] || "", css: m[2] })
  );
  const links = [...head.matchAll(/<link rel='stylesheet'[^>]*href='([^']+)'[^>]*?(?:media='([^']*)')?\s*\/>/g)].map(
    (m) => ({ href: m[1], media: m[2] || "all" })
  );

  const blocksStart = body.indexOf('<div class="wp-site-blocks">');
  const mainStart = body.indexOf('<main id="wp--skip-link--target"', blocksStart);
  const footerStart = body.indexOf('<footer class="wp-block-template-part">', mainStart);
  const footerEnd = body.lastIndexOf("</footer>") + "</footer>".length;
  if (blocksStart < 0 || mainStart < 0 || footerStart < 0) {
    throw new Error("Unexpected page structure");
  }

  const header = body.slice(blocksStart + '<div class="wp-site-blocks">'.length, mainStart);
  const main = body.slice(mainStart, footerStart);
  const footer = body.slice(footerStart, footerEnd);

  // Styles WordPress prints late, after the template (block styles etc.)
  const lateStyles = [...body.slice(footerEnd).matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)]
    .map((m) => m[1])
    .join("\n");

  return { title, description, bodyClass, inlineStyles, links, header, main, footer, lateStyles };
}

async function main() {
  fs.mkdirSync(liveDir, { recursive: true });
  fs.mkdirSync(path.join(publicDir, "wp"), { recursive: true });

  const list = await (await get(`${ORIGIN}/wp-json/wp/v2/pages?per_page=100&_fields=slug,link`)).json();
  const pages = list.filter((p) => !SKIP_SLUGS.has(p.slug));
  console.log(`Syncing ${pages.length} pages…`);

  // Site-wide CSS comes from the homepage: linked theme/core stylesheets + inline styles.
  const homeHtml = await (await get(`${ORIGIN}/`)).text();
  const home = splitPage(homeHtml);
  const siteCss = [];
  for (const link of home.links) {
    if (SKIP_CSS.test(link.href)) continue;
    const res = await get(link.href);
    if (!res) continue;
    let css = absolutiseCss(await res.text(), link.href);
    if (link.media !== "all") css = `@media ${link.media} {\n${css}\n}`;
    siteCss.push(`/* ${link.href} */\n${css}`);
  }
  const sharedIds = new Set();
  for (const s of home.inlineStyles) {
    if (SKIP_CSS.test(s.id)) continue;
    // Per-page layout rules differ by page, so they live with each page.
    if (s.id === "core-block-supports-inline-css") continue;
    sharedIds.add(s.id);
    siteCss.push(`/* ${s.id} */\n${s.css}`);
  }
  fs.writeFileSync(path.join(publicDir, "wp", "site.css"), await localise(siteCss.join("\n\n")));

  fs.writeFileSync(path.join(root, "content", "chrome", "header.html"), await localise(home.header));
  fs.writeFileSync(path.join(root, "content", "chrome", "footer.html"), await localise(home.footer));

  const write = async (slug, page) => {
    const pageCss = page.inlineStyles
      .filter((s) => !sharedIds.has(s.id) && !SKIP_CSS.test(s.id))
      .map((s) => s.css)
      .concat(page.lateStyles)
      .join("\n");
    const data = {
      title: page.title,
      description: page.description,
      bodyClass: page.bodyClass,
      css: await localise(pageCss),
      html: await localise(page.header + page.main + page.footer),
    };
    fs.writeFileSync(path.join(liveDir, `${slug}.json`), JSON.stringify(data, null, 1));
  };

  await write("_home", home);
  for (const p of pages) {
    if (p.link.replace(/\/$/, "") === ORIGIN) continue; // homepage already written
    const res = await get(p.link);
    if (!res) {
      console.warn("  failed", p.slug);
      continue;
    }
    try {
      await write(p.slug, splitPage(await res.text()));
      console.log("  ✓", p.slug);
    } catch (err) {
      console.warn("  skipped", p.slug, err.message);
    }
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
