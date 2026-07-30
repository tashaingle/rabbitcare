import Link from "next/link";
import { getPagesByCategory } from "@/lib/content";

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
  {
    href: "/best-bedding-for-rabbits",
    icon: "🧺",
    title: "Best bedding",
    blurb: "Safe, absorbent options for a clean setup.",
  },
  {
    href: "/best-hay-for-rabbits",
    icon: "🌾",
    title: "Best hay",
    blurb: "Why hay is the main food — and how to choose it.",
  },
];

export default function HomePage() {
  const guides = getPagesByCategory("guide");
  const foodGuides = getPagesByCategory("food").slice(0, 9);

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
            <Link className="btn btn-primary" href="/can-rabbits-eat-this">
              Use the food checker
            </Link>
            <Link className="btn btn-secondary" href="/learn-more">
              Browse all guides
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
          <p>
            Jump into the most useful tools and guides in one calm place.
          </p>
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
          <span className="pill">Featured reading</span>
          <h2>Popular rabbit care guides</h2>
          <p>Move straight into the most useful care articles.</p>
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

      <section className="guide-grid" style={{ paddingBottom: 48 }}>
        <div className="section-head">
          <span className="pill">Safe foods</span>
          <h2>Can rabbits eat…?</h2>
          <p>
            Detailed guides for common fruits and vegetables — or use the full
            food checker for a quick answer.
          </p>
        </div>
        <div className="cards">
          {foodGuides.map((page) => (
            <Link key={page.slug} href={`/${page.slug}`} className="card">
              <h3>{page.title}</h3>
              <span className="card-link">Read →</span>
            </Link>
          ))}
        </div>
        <div className="btn-row" style={{ marginTop: 20 }}>
          <Link className="btn btn-primary" href="/can-rabbits-eat-this">
            Open full food checker
          </Link>
        </div>
      </section>
    </>
  );
}
