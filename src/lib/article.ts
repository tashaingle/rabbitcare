import { parseHTML } from "linkedom";
import { getLivePage, type LivePageData } from "@/lib/content";

export type LinkItem = { href: string; label: string; note?: string };

export type Card = { title: string; text: string; href?: string };

export type Block =
  | { type: "prose"; id?: string; eyebrow?: string; title: string; paragraphs: string[]; items: string[]; image?: string }
  | { type: "cards"; id?: string; eyebrow?: string; title: string; intro?: string; cards: Card[] }
  | { type: "warning"; id?: string; eyebrow?: string; title: string; paragraphs: string[]; items: string[] }
  | { type: "faq"; id?: string; eyebrow?: string; title: string; intro?: string; items: { q: string; a: string }[] }
  | { type: "related"; title: string; intro?: string; links: { href: string; title: string; text: string; image?: string }[] }
  | { type: "close"; id?: string; eyebrow?: string; title: string; paragraphs: string[]; links: LinkItem[] }
  | { type: "note"; text: string }
  | { type: "widget"; id?: string; html: string }
  | { type: "disclaimer"; text: string };

export type Article = {
  slug: string;
  eyebrow: string;
  title: string;
  deck: string;
  lede: string;
  summary: string;
  buttons: LinkItem[];
  quick: string[];
  quickbar: LinkItem[];
  contents: LinkItem[];
  photos: string[];
  jsonLd?: string;
  script?: string;
  blocks: Block[];
};

const PHOTOS = [
  "/home/photos/meadow-1920.webp",
  "/home/photos/pair-1920.webp",
  "/home/photos/duo-1920.webp",
  "/home/photos/snow-1920.webp",
  "/home/photos/magpie-1920.webp",
  "/guides/new-owner/grass.webp",
  "/guides/new-owner/graze.webp",
  "/guides/new-owner/companions.webp",
  "/guides/new-owner/dutch.webp",
  "/guides/new-owner/portrait.webp",
  "/guides/new-owner/youngster.webp",
  ...Array.from({ length: 21 }, (_, i) => `/guides/library/${String(i + 1).padStart(2, "0")}.webp`),
];

const cache = new Map<string, Article | null>();

export function getArticle(slug: string): Article | null {
  if (cache.has(slug)) return cache.get(slug) ?? null;
  const page = getLivePage(slug);
  const article = page ? parseArticle(slug, page) : null;
  cache.set(slug, article);
  return article;
}

export function isBoilerplate(text: string): boolean {
  return /does not replace advice|rabbit-savvy vet/i.test(text);
}

function parseArticle(slug: string, page: LivePageData): Article | null {
  const { document } = parseHTML(page.html);
  const root = document.querySelector("section[class*='-page']");
  if (!root) return null;
  const header = root.querySelector("header");
  const title = text(header?.querySelector("h1"));
  if (!title) return null;

  const photos = rotated(slug);
  const blocks: Block[] = [];
  const main = root.querySelector("main");
  for (const section of [...(main?.children ?? [])]) {
    if (section.tagName !== "SECTION") continue;
    blocks.push(...blocksFrom(section as Element));
  }

  const scripts = [...root.querySelectorAll("script")];
  const jsonRaw = scripts
    .map((script) => script.textContent || "")
    .find((source) => source.trim().startsWith("{"));
  let jsonLd: string | undefined;
  if (jsonRaw) {
    try {
      jsonLd = JSON.stringify(JSON.parse(jsonRaw));
    } catch {
      jsonLd = undefined;
    }
  }
  const script = scripts
    .map((node) => node.textContent || "")
    .find((source) => source.includes("getElementById"));

  return {
    slug,
    eyebrow: text(header?.querySelector("[class*='title-overlay'] [class*='pill']")) || "RabbitCare.co.uk",
    title,
    deck: text(header?.querySelector("[class*='title-overlay'] p")),
    lede: text(header?.querySelector("[class*='intro-heading']")) || text(header?.querySelector("h2")),
    summary: text(header?.querySelector("[class*='subtitle']")),
    buttons: [...(header?.querySelectorAll("[class*='btns'] a") ?? [])].map(linkFrom).filter(isLink),
    quick: [...(header?.querySelector("aside")?.querySelectorAll("li") ?? [])].map((li) => text(li)).filter(Boolean),
    quickbar: [...root.querySelectorAll("[class*='quickbar'] a")].map(quickFrom).filter(isLink),
    contents: uniqueByHref([...root.querySelectorAll("aside a[href^='#']")].map(linkFrom).filter(isLink)),
    photos,
    jsonLd,
    script: script?.trim() || undefined,
    blocks: blocks.filter(hasContent),
  };
}

function blocksFrom(section: Element): Block[] {
  const name = className(section);
  const id = section.id || undefined;

  if (name.includes("tool-section") || name.includes("calc-section")) {
    return [{ type: "widget", id, html: strip(section.innerHTML) }];
  }
  if (name.includes("related")) return [relatedBlock(section)];
  if (name.includes("disclaimer")) return [{ type: "disclaimer", text: text(section) }];
  if (name.includes("faq") || section.querySelector("details")) return [faqBlock(section, id)];
  if (name.includes("warning") || name.includes("notice")) return [warningBlock(section, id)];
  if (name.includes("final") || name.includes("thanks")) return [closeBlock(section, id)];

  const panels = [...section.querySelectorAll("[class*='-panel']")];
  if (panels.length) {
    const blocks: Block[] = panels.map((panel) => proseBlock(panel, panel.id || undefined));
    const note = section.querySelector("[class*='-note']");
    if (note) blocks.push({ type: "note", text: text(note) });
    return blocks;
  }

  const cardEls = [...section.querySelectorAll("[class*='-card']")].filter((el) => el.querySelector("h3"));
  if (cardEls.length >= 2) return [cardsOrFaq(section, id, cardEls.map(cardFrom))];

  const headings = [...section.querySelectorAll("h3")];
  if (headings.length >= 2) return [cardsOrFaq(section, id, headings.map(headingCard))];

  return [proseBlock(section, id)];
}

function proseBlock(root: Element, id?: string): Block {
  const title = text(root.querySelector("h2"));
  return {
    type: "prose",
    id,
    eyebrow: pill(root),
    title: /^(in this guide|jump to|on this page)$/i.test(title) ? "" : title,
    paragraphs: paras(root),
    items: items(root),
    image: usableImage(root.querySelector("img")),
  };
}

function cardsOrFaq(section: Element, id: string | undefined, cards: Card[]): Block {
  const usable = cards.filter((card) => card.title);
  const intro = introText(section);
  const eyebrow = pill(section);
  const title = text(section.querySelector("h2"));
  if (usable.length >= 2 && usable.every((card) => card.title.includes("?"))) {
    return {
      type: "faq",
      id,
      eyebrow,
      title: title || "Questions",
      intro,
      items: usable.map((card) => ({ q: card.title, a: card.text })),
    };
  }
  return { type: "cards", id, eyebrow, title, intro, cards: usable };
}

function cardFrom(el: Element): Card {
  const href = el.tagName === "A" ? el.getAttribute("href") : el.closest("a")?.getAttribute("href");
  return {
    title: text(el.querySelector("h3")),
    text: rich(el.querySelector("p")),
    href: href ? normalizeHref(href) : undefined,
  };
}

function headingCard(heading: Element): Card {
  let node = heading.nextElementSibling;
  const parts: string[] = [];
  while (node && node.tagName !== "H2" && node.tagName !== "H3") {
    if (node.tagName === "P") parts.push(rich(node));
    node = node.nextElementSibling;
  }
  const href = heading.closest("a")?.getAttribute("href") || undefined;
  return {
    title: text(heading),
    text: parts.filter(Boolean).join(" "),
    href: href ? normalizeHref(href) : undefined,
  };
}

function warningBlock(section: Element, id?: string): Block {
  return {
    type: "warning",
    id,
    eyebrow: pill(section) || "Important",
    title: text(section.querySelector("h2")),
    paragraphs: paras(section),
    items: items(section),
  };
}

function faqBlock(section: Element, id?: string): Block {
  const details = [...section.querySelectorAll("details")];
  const items = details.length
    ? details.map((detail) => ({
        q: text(detail.querySelector("summary")),
        a: answer(detail),
      }))
    : [...section.querySelectorAll("h3")].map(headingCard).map((card) => ({ q: card.title, a: card.text }));
  return {
    type: "faq",
    id: id || section.querySelector("[id]")?.id || undefined,
    eyebrow: pill(section) || "FAQs",
    title: text(section.querySelector("h2")) || "Questions",
    intro: introText(section),
    items: items.filter((item) => item.q && item.a),
  };
}

function relatedBlock(section: Element): Block {
  return {
    type: "related",
    title: text(section.querySelector("h2")) || "Related guides",
    intro: introText(section),
    links: [...section.querySelectorAll("a[href]")]
      .map((anchor) => ({
        href: normalizeHref(anchor.getAttribute("href") || ""),
        title: text(anchor.querySelector("h3")) || text(anchor),
        text: text(anchor.querySelector("p")),
        image: usableImage(anchor.querySelector("img")),
      }))
      .filter((link) => link.href && link.title),
  };
}

function closeBlock(section: Element, id?: string): Block {
  return {
    type: "close",
    id,
    eyebrow: pill(section) || "Final thoughts",
    title: text(section.querySelector("h2")),
    paragraphs: paras(section),
    links: [...section.querySelectorAll("a[href]")].map(linkFrom).filter(isLink),
  };
}

function paras(root: Element): string[] {
  return [...root.querySelectorAll("p")]
    .filter((p) => !nestedCard(p, root) && !p.closest("details") && !p.closest("[class*='section-header']"))
    .map(rich)
    .filter(Boolean);
}

function items(root: Element): string[] {
  return [...root.querySelectorAll("li")]
    .filter((li) => !nestedCard(li, root) && !li.closest("details") && !li.closest("aside"))
    .map(rich)
    .filter(Boolean);
}

/** Skip the small repeated cards, but keep copy inside a wrapper that also holds the section heading. */
function nestedCard(el: Element, root: Element): boolean {
  const card = el.closest("[class*='-card']");
  if (!card || !root.contains(card)) return false;
  const heading = root.querySelector("h2");
  return !(heading && card.contains(heading));
}

function introText(section: Element): string | undefined {
  const header = section.querySelector("[class*='section-header'] p");
  const value = header ? rich(header) : "";
  return value || undefined;
}

function answer(detail: Element): string {
  const clone = detail.cloneNode(true) as Element;
  clone.querySelector("summary")?.remove();
  const html = [...clone.querySelectorAll("p")].map(rich).filter(Boolean).join(" ");
  return html || text(clone);
}

function pill(root: Element): string | undefined {
  const value = text(root.querySelector("[class*='pill']"));
  return value && value.length < 48 ? value : undefined;
}

function quickFrom(anchor: Element): LinkItem {
  const strong = anchor.querySelector("strong");
  const note = strong?.parentElement?.querySelector("span");
  if (strong) {
    return { href: normalizeHref(anchor.getAttribute("href") || ""), label: text(strong), note: text(note) || undefined };
  }
  return linkFrom(anchor);
}

function linkFrom(anchor: Element): LinkItem {
  return {
    href: normalizeHref(anchor.getAttribute("href") || ""),
    label: text(anchor),
  };
}

function uniqueByHref(links: LinkItem[]): LinkItem[] {
  const seen = new Set<string>();
  return links.filter((link) => {
    if (seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });
}

function isLink(link: LinkItem): boolean {
  return Boolean(link.href && link.label);
}

function hasContent(block: Block): boolean {
  if (block.type === "prose") return Boolean(block.title || block.paragraphs.length || block.items.length);
  if (block.type === "cards") return block.cards.length > 0;
  if (block.type === "faq") return block.items.length > 0;
  if (block.type === "warning") return Boolean(block.title || block.items.length);
  if (block.type === "related") return block.links.length > 0;
  if (block.type === "close") return Boolean(block.title || block.paragraphs.length);
  if (block.type === "note" || block.type === "disclaimer") return Boolean(block.text);
  if (block.type === "widget") return Boolean(block.html);
  return false;
}

function usableImage(img: Element | null): string | undefined {
  const src = img?.getAttribute("src") || "";
  if (!src || /chatgpt/i.test(src)) return undefined;
  return src;
}

function rotated(slug: string): string[] {
  const start = [...slug].reduce((sum, char) => sum + char.charCodeAt(0), 0) % PHOTOS.length;
  return [...PHOTOS.slice(start), ...PHOTOS.slice(0, start)];
}

function text(el: Element | null | undefined): string {
  return (el?.textContent || "").replace(/\s+/g, " ").trim();
}

function className(el: Element): string {
  return typeof el.className === "string" ? el.className : "";
}

function normalizeHref(href: string): string {
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return href;
  if (/^https?:/i.test(href)) return href;
  const [path, hash] = href.split("#");
  const withSlash = path.endsWith("/") ? path : `${path}/`;
  return hash ? `${withSlash}#${hash}` : withSlash;
}

function rich(el: Element | null | undefined): string {
  if (!el) return "";
  const cleaned = el.innerHTML
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "<br>")
    .replace(/<(\/?)(strong|em|b|i)\b[^>]*>/gi, (_, slash, tag) => `<${slash}${tag === "b" ? "strong" : tag === "i" ? "em" : tag}>`)
    .replace(/<a\b([^>]*)>/gi, (_, attrs: string) => {
      const href = /href\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1] || "";
      if (!href || /^\s*javascript:/i.test(href)) return "<a>";
      return `<a href="${normalizeHref(href).replace(/"/g, "&quot;")}">`;
    })
    .replace(/<\/a>/gi, "</a>")
    .replace(/<(?!\/?(a|strong|em|br)\b)[^>]+>/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned === "<br>" ? "" : cleaned;
}

function strip(html: string): string {
  return html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
}
