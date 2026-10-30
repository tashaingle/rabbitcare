"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import s from "./home.module.css";

export type Food = {
  name: string;
  aliases?: string[];
  status: string;
  summary: string;
  amount?: string;
  prepare?: string;
  url?: string;
};

const VERDICT: Record<string, { stamp: string; tone: string; mood: "yes" | "maybe" | "no" }> = {
  safe: { stamp: "Yes", tone: "#3f7a2a", mood: "yes" },
  treat: { stamp: "Treat", tone: "#b7791f", mood: "maybe" },
  caution: { stamp: "Careful", tone: "#c4561d", mood: "maybe" },
  avoid: { stamp: "No", tone: "#a3261b", mood: "no" },
  toxic: { stamp: "No", tone: "#a3261b", mood: "no" },
};

const CHIPS = ["carrot", "banana", "celery", "tomato", "lettuce", "grapes"];

const norm = (t: string) => t.toLowerCase().trim().replace(/s$/, "");

function find(foods: Food[], query: string) {
  const q = norm(query);
  if (q.length < 2) return null;
  const names = (f: Food) => [f.name, ...(f.aliases ?? [])].map(norm);
  return (
    foods.find((f) => names(f).includes(q)) ??
    foods.find((f) => names(f).some((n) => n.startsWith(q))) ??
    foods.find((f) => names(f).some((n) => n.includes(q))) ??
    "none"
  );
}

export function FoodStamp({ foods }: { foods: Food[] }) {
  const [query, setQuery] = useState("");
  const [term, setTerm] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // Wait for a pause in typing so the stamp doesn't slam on every letter.
  const ask = (value: string, now = false) => {
    setQuery(value);
    clearTimeout(timer.current);
    if (now) setTerm(value);
    else timer.current = setTimeout(() => setTerm(value), 380);
  };
  const result = useMemo(() => find(foods, term), [foods, term]);
  const stampRef = useRef<HTMLDivElement>(null);
  const bunRef = useRef<HTMLDivElement>(null);
  const key = result === null ? "" : result === "none" ? "none" : result.name;

  // Slam the stamp down and let the rabbit react whenever the answer changes.
  useEffect(() => {
    if (!key) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stamp = stampRef.current;
    const bun = bunRef.current;
    if (!stamp || !bun || reduced) return;
    gsap.fromTo(
      stamp,
      { scale: 2.6, rotation: -24, opacity: 0 },
      { scale: 1, rotation: -9, opacity: 1, duration: 0.32, ease: "power4.in" }
    );
    gsap.fromTo(stamp.parentElement, { y: 0 }, { y: 5, duration: 0.06, delay: 0.32, yoyo: true, repeat: 1 });
    const mood = result && result !== "none" ? VERDICT[result.status]?.mood : "maybe";
    gsap.killTweensOf(bun);
    gsap.set(bun, { y: 0, rotation: 0, scaleX: 1, scaleY: 1 });
    if (mood === "yes") {
      gsap.timeline({ delay: 0.35 })
        .to(bun, { scaleY: 0.85, duration: 0.12, transformOrigin: "50% 100%" })
        .to(bun, { y: -70, scaleY: 1.06, duration: 0.28, ease: "power2.out" })
        .to(bun, { y: 0, scaleY: 1, duration: 0.3, ease: "bounce.out" });
    } else if (mood === "no") {
      gsap.timeline({ delay: 0.35 })
        .to(bun, { rotation: -6, duration: 0.08, transformOrigin: "50% 90%", yoyo: true, repeat: 5 })
        .to(bun, { y: 40, duration: 0.4, ease: "power2.in" })
        .to(bun, { y: 0, duration: 0.6, delay: 1.2, ease: "power2.out" });
    } else {
      gsap.timeline({ delay: 0.35 })
        .to(bun, { rotation: 8, duration: 0.25, transformOrigin: "50% 100%", ease: "sine.inOut" })
        .to(bun, { rotation: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    }
  }, [key, result]);

  const verdict = result && result !== "none" ? VERDICT[result.status] ?? VERDICT.caution : null;

  return (
    <section id="can-they-eat-it" className={s.food} aria-labelledby="food-title">
      <div className={s.foodAsk}>
        <h2 id="food-title" className={s.foodTitle}>
          <label htmlFor="food-q">Can rabbits eat</label>
          <span className={s.foodField}>
            <input
              id="food-q"
              type="search"
              value={query}
              onChange={(e) => ask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && ask(query, true)}
              placeholder="…"
              autoComplete="off"
              spellCheck={false}
            />
            <span aria-hidden="true">?</span>
          </span>
        </h2>
        <div className={s.chips} aria-label="Try one of these">
          {CHIPS.map((c) => (
            <button key={c} type="button" onClick={() => ask(c, true)}>
              {c}
            </button>
          ))}
        </div>
        <p className={s.foodNote}>
          {foods.length} foods checked so far. <Link href="/can-rabbits-eat-this/">Open the full food checker →</Link>
        </p>
      </div>

      <div className={s.foodCard} aria-live="polite">
        {result === null && (
          <p className={s.foodIdle}>Type a food and we&rsquo;ll stamp the answer.</p>
        )}
        {result === "none" && (
          <>
            <div ref={stampRef} className={s.stamp} style={{ color: "#5b4a3a" }}>
              ???
            </div>
            <p className={s.foodSummary}>
              That one isn&rsquo;t in our checker yet. If in doubt, leave it out, and stick to hay and leafy greens.
            </p>
          </>
        )}
        {verdict && result && result !== "none" && (
          <>
            <div ref={stampRef} className={s.stamp} style={{ color: verdict.tone }}>
              {verdict.stamp}
            </div>
            <h3 className={s.foodName}>{result.name}</h3>
            <p className={s.foodSummary}>{result.summary}</p>
            <dl className={s.foodFacts}>
              {result.amount && (
                <div>
                  <dt>How much</dt>
                  <dd>{result.amount}</dd>
                </div>
              )}
              {result.prepare && (
                <div>
                  <dt>Prepare</dt>
                  <dd>{result.prepare}</dd>
                </div>
              )}
            </dl>
            {result.url && (
              <Link className={s.foodMore} href={result.url.replace(/\/?$/, "/")}>
                Read the full {result.name.toLowerCase()} guide →
              </Link>
            )}
          </>
        )}
        <div ref={bunRef} className={s.foodBun} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/home/cutouts/honey-lop.webp" alt="" />
        </div>
      </div>
    </section>
  );
}
