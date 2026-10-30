import Link from "next/link";
import type { PageMeta } from "@/lib/content";
import s from "@/components/guides/guide.module.css";

const CATEGORY_META: Record<
  string,
  { title: string; blurb: string; order: number }
> = {
  tool: {
    title: "Care tools",
    blurb: "Interactive checkers and calculators for everyday rabbit care.",
    order: 1,
  },
  guide: {
    title: "Care guides",
    blurb: "Housing, diet, health, behaviour, bedding, toys and more.",
    order: 2,
  },
  food: {
    title: "Can rabbits eat…?",
    blurb: "Detailed guides for individual fruits, vegetables and treats.",
    order: 3,
  },
  info: {
    title: "About this site",
    blurb: "Contact, author and site information.",
    order: 4,
  },
};

type Props = {
  pages: PageMeta[];
  heading?: string;
  intro?: string;
  showHero?: boolean;
};

export function PageDirectory({
  pages,
  heading = "All rabbit care pages",
  intro = "Every guide and tool on RabbitCare.co.uk in one place.",
  showHero = true,
}: Props) {
  const grouped = new Map<string, PageMeta[]>();
  for (const page of pages) {
    const key = page.category || "guide";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(page);
  }

  const categories = [...grouped.entries()].sort((a, b) => {
    const ao = CATEGORY_META[a[0]]?.order ?? 99;
    const bo = CATEGORY_META[b[0]]?.order ?? 99;
    return ao - bo;
  });

  return (
    <div className={s.guide}>
      {showHero && (
        <header className={`${s.section} ${s.compact}`}>
          <p className={s.eyebrow}>Full site index</p>
          <h1 className={s.h2}>{heading}</h1>
          <p className={s.sub}>{intro}</p>
          <p className={s.sub}>{pages.length} pages</p>
        </header>
      )}

      {categories.map(([category, items]) => {
        const meta = CATEGORY_META[category] ?? {
          title: category,
          blurb: "",
        };
        const sorted = [...items].sort((a, b) => a.title.localeCompare(b.title));

        return (
          <section className={`${s.section} ${s.compact}`} id={category} key={category} aria-labelledby={`dir-${category}`}>
            <h2 id={`dir-${category}`} className={s.title}>
              {meta.title}
            </h2>
            {meta.blurb && <p className={s.sub}>{meta.blurb}</p>}
            <ul className={s.ticks}>
              {sorted.map((page) => (
                <li key={page.slug}>
                  <Link href={`/${page.slug}/`}>{page.title}</Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
