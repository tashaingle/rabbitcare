import type { Picks } from "@/lib/picks";
import s from "./guide.module.css";

/** "Our picks" affiliate box inside a guide, with the disclosure UK ad rules ask for. */
export function PicksBox({ picks }: { picks: Picks }) {
  const amazon = picks.picks.some((pick) => /amazon/i.test(pick.shop) && pick.url);

  return (
    <section className={`${s.section} ${s.cream}`} id="our-picks" aria-labelledby="our-picks-title">
      <p className={s.eyebrow}>Our picks</p>
      <h2 id="our-picks-title" className={s.title}>
        {picks.title}
      </h2>
      <p className={s.sub}>{picks.intro}</p>

      <ul className={s.picks}>
        {picks.picks.map((pick) => (
          <li key={pick.product}>
            <span className={s.pickBadge}>{pick.badge}</span>
            <strong>{pick.product}</strong>
            <p>{pick.why}</p>
            {pick.url ? (
              <a className={s.pickLink} href={pick.url} target="_blank" rel="sponsored nofollow noopener">
                View at {pick.shop} <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <span className={s.pickMissing}>Link needed (hidden on the live site)</span>
            )}
          </li>
        ))}
      </ul>

      <p className={s.pickNote}>
        Some of these are affiliate links: if you buy through them we may earn a small commission, at no extra cost to
        you. It never changes what we recommend, and rabbit welfare always comes first.
        {amazon && " As an Amazon Associate, RabbitCare.co.uk earns from qualifying purchases."}
      </p>
    </section>
  );
}
