import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/nav/Footer";
import { SiteNav } from "@/components/nav/SiteNav";
import s from "./guide.module.css";

const TITLE = "New Rabbit Owner Information - Rabbit Care";
const DESCRIPTION =
  "A beginner-friendly rabbit care guide covering enclosure setup, feeding, litter training, social needs, enrichment, health checks and signs of a happy rabbit.";

export const newOwnerMetadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/new-rabbit-owner-information/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/new-rabbit-owner-information/",
    images: [{ url: "/guides/new-owner/hero-1920.webp", width: 1920, height: 1080 }],
  },
};

const SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://rabbitcare.co.uk/new-rabbit-owner-information/#article",
      headline: "New Rabbit Owner Information",
      description: DESCRIPTION,
      url: "https://rabbitcare.co.uk/new-rabbit-owner-information/",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": "https://rabbitcare.co.uk/new-rabbit-owner-information/",
      },
      image: [
        "https://rabbitcare.co.uk/guides/new-owner/hero-1920.webp",
        "https://rabbitcare.co.uk/guides/new-owner/companions.webp",
      ],
      author: { "@type": "Organization", name: "RabbitCare.co.uk", url: "https://rabbitcare.co.uk/" },
      publisher: { "@type": "Organization", name: "RabbitCare.co.uk", url: "https://rabbitcare.co.uk/" },
      about: ["Rabbit care", "New rabbit owners", "Rabbit housing", "Rabbit diet", "Rabbit enrichment"].map(
        (name) => ({ "@type": "Thing", name })
      ),
      articleSection: "Rabbit Care",
      keywords: [
        "new rabbit owner information",
        "new rabbit owner guide",
        "rabbit care for beginners",
        "how to care for a rabbit",
        "rabbit enclosure",
        "rabbit diet",
        "rabbit litter training",
        "rabbit enrichment",
        "rabbit health",
      ],
      isPartOf: { "@type": "WebSite", name: "RabbitCare.co.uk", url: "https://rabbitcare.co.uk/" },
    },
    {
      "@type": "FAQPage",
      "@id": "https://rabbitcare.co.uk/new-rabbit-owner-information/#faq",
      mainEntity: [
        ["What should a new rabbit owner prepare first?", "A new rabbit owner should prepare a roomy enclosure or pen, unlimited hay, fresh water, safe flooring, a litter tray, hiding places, chew toys and the contact details for a rabbit-savvy vet before the rabbit arrives."],
        ["What is the most important food for a new rabbit?", "Hay is the most important food for rabbits. Fresh feeding hay should be available at all times because it supports digestion and helps wear rabbit teeth naturally."],
        ["Can rabbits live in a small cage?", "Rabbits should not live in a small cage as their main space. They need enough room to stand, stretch, hop, explore, hide and exercise every day."],
        ["Are rabbits easy to litter train?", "Many rabbits can learn to use a litter tray, especially when the tray is placed in their chosen toilet corner and hay is offered nearby."],
        ["When should a new rabbit owner call a vet?", "Contact a rabbit-savvy vet urgently if a rabbit stops eating, stops pooing, seems bloated, has breathing problems, has severe diarrhoea, shows head tilt, collapses or suddenly seems very unwell."],
      ].map(([name, text]) => ({
        "@type": "Question",
        name,
        acceptedAnswer: { "@type": "Answer", text },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://rabbitcare.co.uk/new-rabbit-owner-information/#breadcrumb",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://rabbitcare.co.uk/" },
        {
          "@type": "ListItem",
          position: 2,
          name: "New Rabbit Owner Information",
          item: "https://rabbitcare.co.uk/new-rabbit-owner-information/",
        },
      ],
    },
  ],
};

const CONTENTS = [
  ["#enclosure", "Enclosure"],
  ["#feeding", "Feeding"],
  ["#litter", "Litter training"],
  ["#social", "Company"],
  ["#enrichment", "Enrichment"],
  ["#health", "Health"],
  ["#happy", "Happy signs"],
  ["#faq", "FAQs"],
];

const DAY_ONE = [
  ["01", "The enclosure", "Room to stand, stretch and hop", "#enclosure"],
  ["02", "Hay first", "Most of what they eat, every day", "#feeding"],
  ["03", "A litter tray", "In the corner they already use", "#litter"],
  ["04", "Company", "Calm time with you, every day", "#social"],
];

const DIET = [
  ["80–90%", "Hay", "Hay provides fibre and helps keep your rabbit’s teeth healthy."],
  ["Daily", "Fresh vegetables", "Leafy greens such as romaine lettuce, parsley, basil and coriander are great choices."],
  ["A little", "Rabbit pellets", "Pellets should only be given in small amounts."],
  ["Always", "Fresh water", "Clean water should always be available."],
];

const AVOID = [
  ["Processed foods", "Avoid crisps, biscuits, sweets and other human snacks."],
  ["Chocolate", "Chocolate is not suitable for rabbits."],
  ["Bread", "Bread does not support a rabbit’s digestive needs."],
  ["Dairy products", "Rabbits should not be fed milk, cheese or yoghurt."],
];

const LITTER = [
  ["01", "Choose their corner", "Place a litter tray in the corner where your rabbit usually goes."],
  ["02", "Use rabbit-safe litter", "Paper-based bedding is a useful rabbit-safe litter option."],
  ["03", "Add hay nearby", "Add hay to the litter area to encourage your rabbit to use it."],
];

const ENRICHMENT = [
  ["Cardboard tunnels", "Tunnels give rabbits somewhere to explore, hide and run through."],
  ["Willow balls", "Willow toys can encourage safe chewing and play."],
  ["Wooden chew toys", "Untreated wooden chew toys help satisfy natural chewing behaviour."],
  ["Digging boxes", "Boxes filled with paper or hay can provide natural digging enrichment."],
  ["Hideouts", "Hiding spaces help rabbits feel safe and secure."],
  ["Rotating toys", "Changing toys regularly can keep enrichment interesting."],
];

const HAPPY = [
  ["Zoomies", "Running and jumping can show excitement and energy."],
  ["Relaxed lying", "Stretching out or flopping can show comfort and trust."],
  ["Nose nudges", "Gentle nudges can be a social or curious behaviour."],
  ["Tooth purring", "Soft tooth purring while being petted can show contentment."],
];

const URGENT = [
  ["Stops eating", "Food is there, and they leave it"],
  ["Stops pooing", "Or the belly looks bloated"],
  ["Breathing problems", "Fast, noisy, or with the mouth open"],
  ["Severe diarrhoea", "Very runny, not normal droppings"],
  ["Head tilt", "Or they lose their balance"],
  ["Collapse", "Or they seem suddenly very unwell"],
];

const FAQS: [string, string][] = [
  ["What should a new rabbit owner prepare first?", "A new rabbit owner should prepare a roomy enclosure or pen, unlimited hay, fresh water, safe flooring, a litter tray, hiding places, chew toys and the contact details for a rabbit-savvy vet before the rabbit arrives."],
  ["What is the most important food for a new rabbit?", "Hay is the most important food for rabbits. Fresh feeding hay should be available at all times because it supports digestion and helps wear rabbit teeth naturally."],
  ["Can rabbits live in a small cage?", "Rabbits should not live in a small cage as their main space. They need enough room to stand, stretch, hop, explore, hide and exercise every day."],
  ["Are rabbits easy to litter train?", "Many rabbits can learn to use a litter tray, especially when the tray is placed in their chosen toilet corner and hay is offered nearby."],
  ["When should a new rabbit owner call a vet?", "Contact a rabbit-savvy vet urgently if a rabbit stops eating, stops pooing, seems bloated, has breathing problems, has severe diarrhoea, shows head tilt, collapses or suddenly seems very unwell."],
];

const RELATED = [
  ["/home/photos/meadow-960.webp", "50% 40%", "/how-big-should-a-rabbits-cage-be/", "Housing size", "Space, exercise and a safe setup"],
  ["/guides/library/11.webp", "50% 55%", "/best-hay-for-rabbits/", "Best hay", "Why fresh hay is there all day"],
  ["/guides/new-owner/dutch.webp", "70% 40%", "/rabbit-health/", "Rabbit health", "Warning signs, and when to call"],
];

export function NewOwner() {
  return (
    <div className={s.guide}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />
      <SiteNav />
      <main>
        <header className={s.hero}>
          <picture className={s.heroPhoto}>
            <source media="(max-width: 960px)" srcSet="/guides/new-owner/hero-960.webp" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/guides/new-owner/hero-1920.webp"
              alt="A white rabbit lying in the grass with both ears up"
            />
          </picture>
          <div className={s.heroCopy}>
            <p className={s.kicker}>RabbitCare.co.uk · Beginner guide</p>
            <h1 className={s.heroTitle}>
              New rabbit owner
              <em>information.</em>
            </h1>
            <p className={s.heroLede}>
              Start with space, hay, routine and trust. Bringing a rabbit home is exciting, and the first setup
              is what makes the rest easier.
            </p>
            <div className={s.actions}>
              <Link className={s.btnDark} href="#enclosure">
                Start with the enclosure
              </Link>
              <Link className={s.btnGhost} href="#feeding">
                Feeding basics
              </Link>
            </div>
            <p className={s.hint}>A complete guide for people bringing a rabbit home.</p>
          </div>
        </header>

        <nav className={s.dayOne} aria-label="First things to set up">
          <ol className={s.tools}>
            {DAY_ONE.map(([n, title, text, href]) => (
              <li key={n}>
                <Link href={href}>
                  <span className={s.toolNum}>{n}</span>
                  <strong>{title}</strong>
                  <span>{text}</span>
                  <span className={s.toolArrow} aria-hidden="true">
                    ↓
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          <p className={s.checklistLink}>
            Want a list to tick off before they arrive?{" "}
            <Link href="/new-rabbit-owner-checklist/">The owner checklist</Link>
          </p>
        </nav>

        <section className={s.section} aria-labelledby="welcome-title">
          <div className={s.welcomeGrid}>
            <div className={s.prose}>
              <p className={s.eyebrow}>Welcome home</p>
              <h2 id="welcome-title" className={s.h2}>
                Bringing a rabbit home for the first time
              </h2>
              <p>
                Bringing a rabbit home for the first time can be an exciting experience. Rabbits are intelligent,
                social animals that can form strong bonds with their owners. However, they also have specific care
                needs that are different from many other small pets.
              </p>
              <p>
                If you’re a new rabbit owner, learning the basics of rabbit care will help ensure your pet stays
                happy and healthy. This guide covers everything you need to know to get started.
              </p>
            </div>
            <figure className={`${s.frame} ${s.portrait}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/guides/new-owner/youngster.webp" alt="A young white lop rabbit sitting in the grass" />
              <figcaption>Have hay, water, a tray and a hiding place ready before they arrive.</figcaption>
            </figure>
          </div>
          <nav className={s.contents} aria-label="In this guide">
            <span>In this guide</span>
            <ol>
              {CONTENTS.map(([href, label]) => (
                <li key={href}>
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ol>
          </nav>
        </section>

        <section className={`${s.section} ${s.cream}`} id="enclosure" aria-labelledby="enclosure-title">
          <div className={s.split}>
            <figure className={`${s.frame} ${s.wide}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/guides/new-owner/grass.webp" alt="A white rabbit sitting in long grass" />
              <figcaption>Enough room to stand up, stretch out and hop a few steps.</figcaption>
            </figure>
            <div>
              <p className={s.eyebrow}>The enclosure</p>
              <h2 id="enclosure-title" className={s.h2}>
                Room to move, stretch and explore
              </h2>
              <div className={s.prose}>
                <p>
                  Rabbits need plenty of space to move, stretch and explore. Many cages sold in pet stores are too
                  small for rabbits.
                </p>
                <p>
                  A rabbit enclosure should allow your rabbit to stand fully upright, stretch out comfortably and hop
                  several steps in any direction. Many owners prefer large exercise pens or indoor enclosures instead
                  of small cages.
                </p>
                <p>
                  The enclosure should include a litter box, hay feeder, food and water bowls, a hiding area and toys
                  for enrichment. Giving rabbits enough space helps prevent boredom and supports healthy exercise.
                </p>
              </div>
              <ul className={s.ticks}>
                <li>A litter box with rabbit-safe litter.</li>
                <li>A hay feeder or hay area with fresh hay available at all times.</li>
                <li>Food and water bowls, with clean water always available.</li>
                <li>A hiding area where your rabbit can feel safe.</li>
                <li>Toys and enrichment to encourage natural behaviour.</li>
              </ul>
              <div className={s.actions}>
                <Link className={s.btnDark} href="/how-big-should-a-rabbits-cage-be/">
                  Read the housing guide
                </Link>
                <Link className={s.btnGhost} href="/best-bedding-for-rabbits/">
                  Read the bedding guide
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className={s.section} id="feeding" aria-labelledby="feeding-title">
          <p className={s.eyebrow}>Feeding</p>
          <h2 id="feeding-title" className={s.moment}>
            Mostly <em>hay.</em>
          </h2>
          <p className={s.sub}>
            A healthy rabbit diet should be based mostly on hay, with fresh vegetables, small amounts of pellets and
            clean water.
          </p>
          <ul className={s.facts}>
            {DIET.map(([kicker, title, text]) => (
              <li key={title}>
                <b>{kicker}</b>
                <strong>{title}</strong>
                <span>{text}</span>
              </li>
            ))}
          </ul>
          <p className={s.more}>
            <Link href="/best-hay-for-rabbits/">Best hay for rabbits</Link>
            <Link href="/what-do-rabbits-eat/">What do rabbits eat?</Link>
          </p>
          <figure className={`${s.frame} ${s.graze} ${s.photoBreak}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/guides/new-owner/graze.webp" alt="Rabbits grazing in the grass" />
            <figcaption>Hay all day, then a pile of safe leafy greens.</figcaption>
          </figure>

          <div className={s.follow}>
            <p className={s.eyebrow}>Foods to avoid</p>
            <h2 className={s.h2}>Some human foods are unsafe</h2>
            <p className={s.sub}>
              Avoid giving rabbits processed foods, chocolate, bread or dairy products. Rabbits need a high-fibre diet
              built around hay, not human snacks.
            </p>
            <ul className={s.facts}>
              {AVOID.map(([title, text]) => (
                <li key={title}>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={`${s.section} ${s.cream}`} id="litter" aria-labelledby="litter-title">
          <p className={s.eyebrow}>Litter training</p>
          <h2 id="litter-title" className={s.h2}>
            Many rabbits learn a tray
          </h2>
          <p className={s.sub}>
            Many people are surprised to learn that rabbits can be easily litter trained. Most rabbits learn quickly
            and prefer using a litter tray once they understand where it is.
          </p>
          <ol className={s.steps}>
            {LITTER.map(([n, title, text]) => (
              <li key={n}>
                <b>{n}</b>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={s.section} id="social" aria-labelledby="social-title">
          <div className={s.split}>
            <div>
              <p className={s.eyebrow}>Company</p>
              <h2 id="social-title" className={s.h2}>
                Rabbits are very social animals
              </h2>
              <div className={s.prose}>
                <p>
                  Rabbits are very social animals. In the wild, they live in groups and rely on companionship. Your
                  rabbit will benefit from daily interaction with you, toys and enrichment, and time outside their
                  enclosure.
                </p>
                <p>
                  Many rabbits also enjoy living with another rabbit, though proper introductions are important.
                  Bonding rabbits should be done carefully and calmly.
                </p>
              </div>
              <ul className={s.ticks}>
                <li>Spend calm time with your rabbit every day.</li>
                <li>Allow safe time outside the enclosure.</li>
                <li>Provide toys, tunnels and activities.</li>
                <li>Research rabbit bonding carefully before introductions.</li>
              </ul>
              <p className={s.more}>
                <Link href="/rabbit-behaviour/">Read about rabbit behaviour</Link>
              </p>
            </div>
            <figure className={`${s.frame} ${s.wide}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/guides/new-owner/companions.webp"
                alt="Two rabbits lying nose to nose in the grass"
              />
              <figcaption>Many rabbits do best with another rabbit. Introductions need to be slow.</figcaption>
            </figure>
          </div>
        </section>

        <section className={`${s.section} ${s.cream}`} id="enrichment" aria-labelledby="enrichment-title">
          <p className={s.eyebrow}>Toys and enrichment</p>
          <h2 id="enrichment-title" className={s.h2}>
            Keep curious rabbits busy
          </h2>
          <p className={s.sub}>
            Rabbits are curious animals that enjoy exploring and chewing. Providing enrichment keeps rabbits mentally
            stimulated and helps prevent boredom.
          </p>
          <ul className={s.cards}>
            {ENRICHMENT.map(([title, text]) => (
              <li key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
          <p className={s.more}>
            <Link href="/rabbit-toys/">More toy ideas</Link>
          </p>
        </section>

        <section className={s.section} id="health" aria-labelledby="health-title">
          <p className={s.eyebrow}>Health and grooming</p>
          <h2 id="health-title" className={s.h2}>
            Regular care, quietly done
          </h2>
          <p className={s.sub}>
            Regular health care is important for rabbits. Basic care includes brushing long-haired rabbits, checking
            nails, monitoring eating habits and watching droppings.
          </p>
          <ul className={s.facts}>
            <li>
              <strong>Grooming</strong>
              <span>Brush long-haired rabbits regularly to prevent matting.</span>
            </li>
            <li>
              <strong>Nails</strong>
              <span>Check nails and trim them when needed.</span>
            </li>
            <li>
              <strong>Daily checks</strong>
              <span>Monitor eating habits and droppings.</span>
            </li>
            <li>
              <strong>Vet care</strong>
              <span>See a rabbit-savvy veterinarian for vaccinations and health checks.</span>
            </li>
          </ul>
        </section>

        <section className={s.urgent} aria-labelledby="urgent-title">
          <div>
            <p className={s.kicker}>When to call a vet</p>
            <h2 id="urgent-title" className={s.moment}>
              Today, <em>not tomorrow.</em>
            </h2>
            <div className={s.prose}>
              <p>
                Rabbits hide illness well, and they can go downhill fast. Contact a rabbit-savvy vet urgently if a
                rabbit stops eating, stops pooing, seems bloated, has breathing problems, has severe diarrhoea, shows
                head tilt, collapses or suddenly seems very unwell.
              </p>
            </div>
            <div className={s.actions}>
              <Link className={s.btnLight} href="/rabbit-health/">
                Read the health guide
              </Link>
              <Link className={s.btnLine} href="/rabbit-symptom-checker/">
                Use the symptom checker
              </Link>
            </div>
          </div>
          <ol className={s.signs}>
            {URGENT.map(([title, text]) => (
              <li key={title}>
                <strong>{title}</strong>
                <span>{text}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className={s.section} id="happy" aria-labelledby="happy-title">
          <div className={s.happyGrid}>
            <figure className={`${s.frame} ${s.portrait}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/guides/new-owner/portrait.webp" alt="A tan lop rabbit sitting in the grass, facing the camera" />
              <figcaption>A flop, a nudge, a soft tooth purr.</figcaption>
            </figure>
            <div>
              <p className={s.eyebrow}>Signs of a happy rabbit</p>
              <h2 id="happy-title" className={s.h2}>
                How they show they feel safe
              </h2>
              <p className={s.sub}>
                Healthy and content rabbits often show behaviours that suggest they feel safe, comfortable and relaxed.
              </p>
              <ul className={s.signWords}>
                {HAPPY.map(([title, text]) => (
                  <li key={title}>
                    <strong>{title}</strong>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className={`${s.section} ${s.cream}`} id="faq" aria-labelledby="faq-title">
          <p className={s.eyebrow}>FAQs</p>
          <h2 id="faq-title" className={s.h2}>
            New rabbit owner questions
          </h2>
          <div className={s.faqList}>
            {FAQS.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className={s.section} aria-labelledby="close-title">
          <div className={s.closeGrid}>
            <div>
              <p className={s.eyebrow}>Final thoughts</p>
              <h2 id="close-title" className={s.moment}>
                A good start <em>lasts years.</em>
              </h2>
              <div className={s.prose}>
                <p>
                  Rabbits can make wonderful pets when their needs are properly understood. With the right enclosure,
                  diet and daily interaction, rabbits can live happy and healthy lives for 8–12 years or more.
                </p>
                <p>
                  Learning about rabbit care early will help you build a strong bond with your new pet and provide the
                  best possible home.
                </p>
              </div>
              <div className={s.actions}>
                <Link className={s.btnDark} href="/learn-more/">
                  Browse more guides
                </Link>
                <Link className={s.btnGhost} href="/contact-us/">
                  Contact RabbitCare
                </Link>
              </div>
            </div>
            <figure className={`${s.frame} ${s.wide}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/home/photos/pair-1920.webp"
                alt="Two rabbits lying side by side indoors, tucked together"
              />
              <figcaption>Home is room, hay, and someone to be with.</figcaption>
            </figure>
          </div>
        </section>

        <section className={`${s.section} ${s.cream}`} aria-label="Related rabbit care guides">
          <div className={s.relatedHead}>
            <h2 className={s.h2}>
              Keep <em>reading.</em>
            </h2>
          </div>
          <div className={s.relatedGrid}>
            {RELATED.map(([src, position, href, title, text]) => (
              <Link key={href} href={href}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" style={{ objectPosition: position }} />
                <span>
                  <strong>{title}</strong>
                  <em>{text}</em>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <div className={s.note}>
          <p>
            <strong>RabbitCare.co.uk provides general rabbit care information for UK owners.</strong> It does not
            replace advice from a rabbit-savvy vet. If your rabbit stops eating, stops pooing, seems in pain or is
            suddenly unwell, contact a vet urgently.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
