import type { ReactNode } from "react";
import Link from "next/link";
import Script from "next/script";
import type { Article as ArticleData, Block, LinkItem } from "@/lib/article";
import { Footer } from "@/components/nav/Footer";
import { SiteNav } from "@/components/nav/SiteNav";
import type { Picks } from "@/lib/picks";
import { PicksBox } from "./PicksBox";
import s from "./guide.module.css";

const POSITIONS = ["50% 42%", "64% 40%", "38% 36%", "72% 48%", "46% 58%"];

export function Article({ article, picks }: { article: ArticleData; picks?: Picks | null }) {
  const { lead, em } = emphasis(article.title);
  const quickbar = article.quickbar.slice(0, 4);
  const showQuick = article.quick.length > 0 && article.quick.length <= 6;
  const used = new Set<string>([article.photos[0]]);
  const take = (preferred?: string) => takePhoto(used, article.photos, preferred);
  // How many prose blocks come before each block (decides which get photos).
  const proseBefore = article.blocks.map(
    (_, index) => article.blocks.slice(0, index).filter((block) => block.type === "prose").length
  );
  // Product picks go just before the FAQ, related guides or closing section.
  const picksAt = picks ? firstIndex(article.blocks, ["faq", "related", "close"]) : -1;

  return (
    <div className={s.guide}>
      {article.jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: article.jsonLd }} />
      )}
      <SiteNav />
      <main>
        <header className={s.hero}>
          <picture className={s.heroPhoto}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.photos[0]} alt="" style={{ objectPosition: photoSpot(article.slug) }} />
          </picture>
          <div className={s.heroCopy}>
            <p className={s.kicker}>{article.eyebrow}</p>
            <h1 className={s.heroTitle}>
              {lead} {em && <em>{em}</em>}
            </h1>
            {(article.lede || article.summary) && (
              <p className={s.heroLede}>{article.lede || article.summary}</p>
            )}
            {article.summary && article.lede && <p className={s.hint}>{article.summary}</p>}
            {article.buttons.length > 0 && (
              <div className={s.actions}>
                {article.buttons.slice(0, 2).map((button, index) => (
                  <SmartLink key={`${button.href}-${index}`} item={button} className={index === 0 ? s.btnDark : s.btnGhost} />
                ))}
              </div>
            )}
          </div>
        </header>

        {quickbar.length > 0 && (
          <nav className={s.dayOne} aria-label="On this page">
            <ol className={s.tools}>
              {quickbar.map((item, index) => (
                <li key={`${item.href}-${index}`}>
                  <SmartLink item={item}>
                    <span className={s.toolNum}>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{item.label}</strong>
                    {item.note && <span>{item.note}</span>}
                    <span className={s.toolArrow} aria-hidden="true">
                      ↓
                    </span>
                  </SmartLink>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {showQuick && (
          <section className={s.section} aria-label="Quick answer">
            <p className={s.eyebrow}>Quick answer</p>
            <ul className={article.quick.length > 4 ? s.signWords : s.ticks}>
              {article.quick.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {article.contents.length > 0 && (
          <nav className={`${s.contents} ${s.contentsBar}`} aria-label="In this guide">
            <span>In this guide</span>
            <ol>
              {article.contents.map((item, index) => (
                <li key={`${item.href}-${index}`}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {article.blocks.map((block, index) => {
          const box = index === picksAt && picks ? <PicksBox key="picks" picks={picks} /> : null;
          if (block.type === "prose") {
            const amount = block.paragraphs.join(" ").length + block.items.join(" ").length;
            const prose = proseBefore[index];
            const withPhoto = prose === 0 || (prose % 3 === 0 && amount < 900);
            return (
              <Prose
                key={blockKey(block, index)}
                block={block}
                photo={withPhoto ? take(block.image) : undefined}
                large={prose === 0}
              />
            );
          }
          const view = <BlockView key={blockKey(block, index)} block={block} take={take} />;
          return box ? [box, view] : view;
        })}
        {picks && picksAt === -1 && <PicksBox picks={picks} />}
      </main>
      <Footer />
      {article.script && (
        <Script id={`tool-${article.slug}`} strategy="afterInteractive">
          {article.script}
        </Script>
      )}
    </div>
  );
}

function BlockView({
  block,
  take,
}: {
  block: Exclude<Block, { type: "prose" }>;
  take: (preferred?: string) => string | undefined;
}) {
  if (block.type === "cards") return <Cards block={block} />;
  if (block.type === "warning") return <Warning block={block} />;
  if (block.type === "faq") return <Faq block={block} />;
  if (block.type === "related") return <Related block={block} take={take} />;
  if (block.type === "close") return <Close block={block} photo={take()} />;
  if (block.type === "note") {
    return (
      <p className={s.note} dangerouslySetInnerHTML={{ __html: block.text }} />
    );
  }
  if (block.type === "widget") {
    return (
      <section className={s.section} id={block.id}>
        <div className={s.widget} dangerouslySetInnerHTML={{ __html: block.html }} />
      </section>
    );
  }
  return <p className={s.disclaimer}>{block.text}</p>;
}

function Prose({
  block,
  photo,
  large,
}: {
  block: Extract<Block, { type: "prose" }>;
  photo?: string;
  large: boolean;
}) {
  const titled = block.items.filter((item) => item.includes("<strong>")).length >= 2;

  return (
    <section className={s.section} id={block.id && !block.title ? block.id : undefined}>
      <div className={s.prose}>
        {block.eyebrow && <p className={s.eyebrow}>{block.eyebrow}</p>}
        {block.title && (
          <h2 id={block.id} className={large ? s.h2 : s.title}>
            {block.title}
          </h2>
        )}
        {block.paragraphs.map((paragraph, index) => (
          <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
        ))}
        {block.items.length > 0 && (
          <ul className={titled ? s.tips : s.ticks}>
            {block.items.map((item, index) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        )}
      </div>
      {photo && (
        <figure className={`${s.frame} ${s.band}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt="" />
        </figure>
      )}
    </section>
  );
}

function Cards({ block }: { block: Extract<Block, { type: "cards" }> }) {
  return (
    <section className={s.section} id={block.id}>
      {block.eyebrow && <p className={s.eyebrow}>{block.eyebrow}</p>}
      {block.title && <h2 className={s.title}>{block.title}</h2>}
      {block.intro && <p className={s.sub} dangerouslySetInnerHTML={{ __html: block.intro }} />}
      <ul className={block.cards.length === 4 ? s.facts : s.cards}>
        {block.cards.map((card, index) => (
          <li key={`${card.title}-${index}`}>
            {card.href ? (
              <Link href={card.href}>
                <strong>{card.title}</strong>
                {card.text && <span dangerouslySetInnerHTML={{ __html: card.text }} />}
              </Link>
            ) : (
              <>
                <strong>{card.title}</strong>
                {card.text && <span dangerouslySetInnerHTML={{ __html: card.text }} />}
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Warning({ block }: { block: Extract<Block, { type: "warning" }> }) {
  return (
    <section className={s.urgent} id={block.id} aria-labelledby={block.id ? `${block.id}-title` : undefined}>
      <div>
        <p className={s.eyebrow}>{block.eyebrow}</p>
        <h2 id={block.id ? `${block.id}-title` : undefined} className={s.title}>
          {block.title}
        </h2>
        <div className={s.prose}>
          {block.paragraphs.map((paragraph, index) => (
            <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
          ))}
        </div>
      </div>
      {block.items.length > 0 && (
        <ol className={s.signs}>
          {block.items.map((item, index) => (
            <li key={index}>
              <strong dangerouslySetInnerHTML={{ __html: item }} />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function Faq({ block }: { block: Extract<Block, { type: "faq" }> }) {
  return (
    <section className={`${s.section} ${s.cream}`} id={block.id || "faq"}>
      {block.eyebrow && <p className={s.eyebrow}>{block.eyebrow}</p>}
      <h2 className={s.h2}>{block.title}</h2>
      {block.intro && <p className={s.sub} dangerouslySetInnerHTML={{ __html: block.intro }} />}
      <div className={s.faqList}>
        {block.items.map((item) => (
          <details key={item.q}>
            <summary>{item.q}</summary>
            <p dangerouslySetInnerHTML={{ __html: item.a }} />
          </details>
        ))}
      </div>
    </section>
  );
}

function Related({
  block,
  take,
}: {
  block: Extract<Block, { type: "related" }>;
  take: (preferred?: string) => string | undefined;
}) {
  return (
    <section className={s.section} aria-labelledby="related-title">
      <div className={s.relatedHead}>
        <h2 id="related-title" className={s.title}>
          {block.title}
        </h2>
      </div>
      <div className={s.relatedGrid}>
        {block.links.slice(0, 3).map((link, index) => {
          const src = take(link.image);
          if (!src) return null;
          return (
            <Link key={link.href} href={link.href}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" style={{ objectPosition: POSITIONS[index % POSITIONS.length] }} />
              <span>
                <strong>{link.title}</strong>
                {link.text && <em>{link.text}</em>}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function Close({ block, photo }: { block: Extract<Block, { type: "close" }>; photo?: string }) {
  return (
    <section className={s.section} id={block.id}>
      <p className={s.eyebrow}>{block.eyebrow}</p>
      <h2 className={block.title.length > 42 ? s.title : s.moment}>{block.title}</h2>
      <div className={s.prose}>
        {block.paragraphs.map((paragraph, index) => (
          <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
        ))}
      </div>
      {block.links.length > 0 && (
        <div className={s.actions}>
          {block.links.slice(0, 2).map((link, index) => (
            <SmartLink key={link.href} item={link} className={index === 0 ? s.btnDark : s.btnGhost} />
          ))}
        </div>
      )}
      {photo && (
        <figure className={`${s.frame} ${s.band}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt="" />
        </figure>
      )}
    </section>
  );
}

function takePhoto(used: Set<string>, photos: string[], preferred?: string): string | undefined {
  const src = [preferred, ...photos].find((item) => item && !used.has(item));
  if (!src) return undefined;
  used.add(src);
  return src;
}

function SmartLink({ item, className, children }: { item: LinkItem; className?: string; children?: ReactNode }) {
  const content = children ?? item.label;
  if (item.href.startsWith("#")) {
    return (
      <a className={className} href={item.href}>
        {content}
      </a>
    );
  }
  if (/^https?:/i.test(item.href) || item.href.startsWith("mailto:") || item.href.startsWith("tel:")) {
    return (
      <a className={className} href={item.href}>
        {content}
      </a>
    );
  }
  return (
    <Link className={className} href={item.href}>
      {content}
    </Link>
  );
}

function emphasis(title: string): { lead: string; em: string } {
  const words = title.replace(/\s+/g, " ").trim().split(" ");
  if (words.length < 2) return { lead: title, em: "" };
  const count = words.length >= 7 ? 3 : words.length >= 4 ? 2 : 1;
  return { lead: words.slice(0, -count).join(" "), em: words.slice(-count).join(" ") };
}

function photoSpot(slug: string): string {
  const n = [...slug].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return POSITIONS[n % POSITIONS.length];
}

function firstIndex(blocks: Block[], types: Block["type"][]): number {
  return blocks.findIndex((block) => types.includes(block.type));
}

function blockKey(block: Block, index: number): string {
  if (block.type === "disclaimer" || block.type === "note") return `${block.type}-${index}`;
  if (block.type === "widget") return `widget-${block.id || index}`;
  if (block.type === "related") return "related";
  return `${block.type}-${"title" in block ? block.title : ""}-${index}`;
}
