import Link from "next/link";
import { getAllPages, getPagesByCategory } from "@/lib/content";

const tools = [
  {
    href: "/can-rabbits-eat-this",
    icon: "🥕",
    title: "Food checker",
    blurb: "Can rabbits eat it? Quick safe / treat / caution answers.",
  },
  {
    href: "/rabbit-housing-size-calculator",
    icon: "🏡",
    title: "Housing calculator",
    blurb: "Check whether your rabbit’s setup is roomy enough.",
  },
  {
    href: "/rabbit-symptom-checker",
    icon: "🩺",
    title: "Symptom checker",
    blurb: "Know when to call a rabbit-savvy vet urgently.",
  },
  {
    href: "/new-rabbit-owner-checklist",
    icon: "✅",
    title: "Owner checklist",
    blurb: "A calm first-time rabbit owner guide.",
  },
];

export default function HomePage() {
  const guides = getPagesByCategory("guide");
  const foodGuides = getPagesByCategory("food");
  // Home + all content pages (learn-more redirects to /guides)
  const totalContent = getAllPages().filter((p) => p.slug !== "learn-more")
    .length;

  return (
    <>
      <section className="home-hero">
        <div>
          <span className="pill">Rabbit care for UK owners</span>
          <h1>Practical rabbit care advice, made simple</h1>
          <p className="lead">
            Learn how to feed, house, groom and care for rabbits with
            beginner-friendly guides on hay, bedding, behaviour, safe foods and
            common health warning signs.
          </p>
          <div className="btn-row">
            <Link className="btn btn-primary" href="/guides">
              Browse all {totalContent} pages
            </Link>
            <Link className="btn btn-secondary" href="/can-rabbits-eat-this">
              Use the food checker
            </Link>
          </div>
        </div>

        <aside className="home-hero-card" aria-label="Essentials">
          <h2>Start with the essentials</h2>
          <ul>
            <li>Unlimited good-quality hay every day</li>
            <li>Roomy housing with space to hop and hide</li>
            <li>Safe bedding, enrichment and toys</li>
            <li>Know when something is not quite right</li>
          </ul>
        </aside>
      </section>

      <section className="tool-grid">
        <div className="section-head">
          <span className="pill">Care tools</span>
          <h2>Quick helpers for everyday rabbit care</h2>
          <p>Interactive tools you can use right away.</p>
        </div>
        <div className="cards">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="card">
              <span className="card-icon" aria-hidden>
                {tool.icon}
              </span>
              <h3>{tool.title}</h3>
              <p>{tool.blurb}</p>
              <span className="card-link">Open →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="warning-strip" aria-label="Urgent vet signs">
        <span className="pill">Know the warning signs</span>
        <h2>When to call a rabbit-savvy vet urgently</h2>
        <p>
          Rabbits can become seriously unwell quickly. If your rabbit suddenly
          changes behaviour, stops eating, stops pooing or seems in pain,
          contact a vet for urgent advice.
        </p>
        <ul className="warning-list">
          {[
            "Not eating",
            "Not pooing",
            "Bloated belly",
            "Flystrike signs",
            "Head tilt",
            "Sudden weakness",
            "Breathing problems",
            "Severe diarrhoea",
          ].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="btn-row" style={{ marginTop: 18 }}>
          <Link className="btn btn-primary" href="/rabbit-symptom-checker">
            Use the symptom checker
          </Link>
          <Link className="btn btn-secondary" href="/rabbit-health">
            Read rabbit health guide
          </Link>
        </div>
      </section>

      <section className="guide-grid">
        <div className="section-head">
          <span className="pill">Care guides</span>
          <h2>Rabbit care guides</h2>
          <p>
            Housing, diet, health, behaviour, bedding, toys and first-time owner
            advice — all {guides.length} guides below.
          </p>
        </div>
        <div className="cards">
          {guides.map((guide) => (
            <Link key={guide.slug} href={`/${guide.slug}`} className="card">
              <h3>{guide.title}</h3>
              <p>{guide.description}</p>
              <span className="card-link">Read guide →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="guide-grid" style={{ paddingBottom: 24 }}>
        <div className="section-head">
          <span className="pill">Safe foods</span>
          <h2>Can rabbits eat…? ({foodGuides.length} guides)</h2>
          <p>
            Every individual food guide on the site is listed here. For a quick
            search, use the{" "}
            <Link href="/can-rabbits-eat-this" className="inline-link">
              food checker
            </Link>
            .
          </p>
        </div>
        <div className="food-link-grid">
          {foodGuides
            .slice()
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((page) => (
              <Link
                key={page.slug}
                href={`/${page.slug}`}
                className="food-link-card"
              >
                {page.title}
              </Link>
            ))}
        </div>
        <div className="btn-row" style={{ marginTop: 20 }}>
          <Link className="btn btn-primary" href="/can-rabbits-eat-this">
            Open full food checker
          </Link>
          <Link className="btn btn-secondary" href="/guides">
            View complete site index
          </Link>
        </div>
      </section>

      <section className="guide-grid" style={{ paddingBottom: 48 }}>
        <div className="all-pages-cta">
          <span className="pill">Full library</span>
          <h2>Looking for a specific page?</h2>
          <p>
            Open the complete index of all {totalContent} care pages, tools and
            guides.
          </p>
          <Link className="btn btn-primary" href="/guides">
            Browse all pages →
          </Link>
        </div>
      </section>
    </>
  );
}
