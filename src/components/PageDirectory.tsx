import Link from "next/link";
import type { PageMeta } from "@/lib/content";

const CATEGORY_META: Record<
  string,
  { title: string; blurb: string; icon: string; order: number }
> = {
  tool: {
    title: "Care tools",
    blurb: "Interactive checkers and calculators for everyday rabbit care.",
    icon: "🛠️",
    order: 1,
  },
  guide: {
    title: "Care guides",
    blurb: "Housing, diet, health, behaviour, bedding, toys and more.",
    icon: "📖",
    order: 2,
  },
  food: {
    title: "Can rabbits eat…?",
    blurb: "Detailed guides for individual fruits, vegetables and treats.",
    icon: "🥕",
    order: 3,
  },
  info: {
    title: "About this site",
    blurb: "Contact, author and site information.",
    icon: "ℹ️",
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
    <div className="directory">
      {showHero && (
        <header className="directory-hero">
          <span className="pill">Full site index</span>
          <h1>{heading}</h1>
          <p>{intro}</p>
          <p className="directory-count">
            <strong>{pages.length}</strong> pages available
          </p>
        </header>
      )}

      {categories.map(([category, items]) => {
        const meta = CATEGORY_META[category] ?? {
          title: category,
          blurb: "",
          icon: "📄",
        };
        const sorted = [...items].sort((a, b) =>
          a.title.localeCompare(b.title)
        );

        return (
          <section
            key={category}
            className="directory-section"
            id={category}
            aria-labelledby={`dir-${category}`}
          >
            <div className="directory-section-head">
              <span className="directory-icon" aria-hidden>
                {meta.icon}
              </span>
              <div>
                <h2 id={`dir-${category}`}>
                  {meta.title}{" "}
                  <span className="directory-badge">{sorted.length}</span>
                </h2>
                {meta.blurb && <p>{meta.blurb}</p>}
              </div>
            </div>

            <ul className="directory-list">
              {sorted.map((page) => (
                <li key={page.slug}>
                  <Link href={`/${page.slug}`}>
                    <span className="directory-link-title">{page.title}</span>
                    {page.description && (
                      <span className="directory-link-desc">
                        {page.description}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
