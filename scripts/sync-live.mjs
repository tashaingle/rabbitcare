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
import { parseHTML } from "linkedom";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const ORIGIN = "https://rabbitcare.co.uk";
const publicDir = path.join(root, "public");
const liveDir = path.join(root, "content", "live");

// WooCommerce pages: the shop is closed on this site for now.
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

const SHOP_HREF = /^(https?:\/\/(www\.)?rabbitcare\.co\.uk)?\/(shop|product|product-category|basket|cart|checkout|my-account)(\/|$)/;

/**
 * The shop is closed for now: drop the menu, footer column, shop sections,
 * product cards and any other links into WooCommerce.
 */
function removeShop(html) {
  const { document } = parseHTML(`<!doctype html><html><body>${html}</body></html>`);
  const text = (el) => el.textContent.trim();
  const removeLink = (a) => {
    const li = a.parentElement?.tagName === "LI" ? a.parentElement : null;
    (li || a).remove();
  };

  // Header "Shop" dropdown
  for (const label of [...document.querySelectorAll(".rc-header-dropdown-label")]) {
    if (text(label) === "Shop") label.closest(".rc-header-item")?.remove();
  }
  // Footer "Shop" column
  for (const h of [...document.querySelectorAll("footer h2, footer h3, footer summary")]) {
    if (text(h) === "Shop") h.parentElement?.remove();
  }
  // Whole shop sections, recognised by their "RabbitCare shop" label
  const removedIds = new Set();
  for (const el of [...document.querySelectorAll("[class*='pill']")]) {
    if (text(el).toLowerCase() !== "rabbitcare shop") continue;
    const section = el.closest("section");
    if (section) {
      if (section.id) removedIds.add(section.id);
      section.remove();
    }
  }
  // The homepage "Toys and enrichment" card points at the toys guide instead
  for (const a of [...document.querySelectorAll("a.rc-card-link")]) {
    if (SHOP_HREF.test(a.getAttribute("href") || "")) {
      a.setAttribute("href", "/rabbit-toys/");
      a.textContent = "Explore rabbit toys";
    }
  }
  // Any remaining links into the shop, or to the sections removed above
  for (const a of [...document.querySelectorAll("a[href]")]) {
    const href = a.getAttribute("href");
    if (SHOP_HREF.test(href) || (href.startsWith("#") && removedIds.has(href.slice(1)))) {
      removeLink(a);
    }
  }
  // Button rows left empty
  for (const row of [...document.querySelectorAll("[class*='btns']")]) {
    if (!row.querySelector("a, button")) row.remove();
  }
  // Calls to action that only pointed at the shop (homepage "Ready to browse?")
  for (const section of [...document.querySelectorAll("section")]) {
    if (!section.querySelector("a") && /RabbitCare shop/i.test(section.textContent)) section.remove();
  }

  return document.body.innerHTML
    .replace(/UK rabbit advice &(amp;|#038;) shop/g, "UK rabbit advice")
    .replace(/,\s*plus carefully chosen rabbit care accessories,[^.<]*gift products\./g, ".");
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
    siteCss.push(`/* ${s.id} */\n${s.css}`);
    // Per-page layout rules differ by page, so each page also keeps its own.
    // The homepage's copy is shared because it covers the header and footer
    // that Next.js-only pages render.
    if (s.id !== "core-block-supports-inline-css") sharedIds.add(s.id);
  }
  fs.writeFileSync(path.join(publicDir, "wp", "site.css"), await localise(siteCss.join("\n\n")));

  fs.writeFileSync(path.join(root, "content", "chrome", "header.html"), await localise(removeShop(home.header)));
  fs.writeFileSync(path.join(root, "content", "chrome", "footer.html"), await localise(removeShop(home.footer)));

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
      html: await localise(removeShop(page.header + page.main + page.footer)),
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
