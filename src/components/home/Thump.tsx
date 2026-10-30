"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import s from "./home.module.css";

gsap.registerPlugin(ScrollTrigger);

const SIGNS = [
  ["Not eating", "for more than a few hours"],
  ["Few or no poos", "or very small, dry ones"],
  ["Bloated belly", "hard, swollen or tight"],
  ["Hunched and still", "pressing into a corner, teeth grinding"],
  ["Head tilt", "or rolling, loss of balance"],
  ["Flies or maggots", "around the bottom (flystrike)"],
  ["Breathing hard", "or through the mouth"],
  ["Sudden weakness", "floppy, cold or collapsed"],
];

export function Thump() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current!;
    const word = section.querySelector<HTMLElement>(`.${s.thumpWord}`)!;
    const bun = section.querySelector<HTMLElement>(`.${s.thumpBun}`)!;
    const items = section.querySelectorAll<HTMLElement>(`.${s.signs} li`);
    const ground = section.querySelector<HTMLElement>(`.${s.thumpGround}`)!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.set(items, { opacity: 0, x: -10 });
    const thump = () => {
      const tl = gsap.timeline();
      tl.fromTo(word, { yPercent: -60, opacity: 0, scaleY: 1.2 }, { yPercent: 0, opacity: 1, scaleY: 1, duration: 0.28, ease: "power4.in" })
        // Impact: the whole section jolts once, like a hind foot hitting the floor.
        .to(section, { y: 7, duration: 0.05, ease: "power1.out" })
        .to(section, { y: 0, duration: 0.45, ease: "elastic.out(1.2, 0.3)" })
        .to(word, { scaleY: 0.86, scaleX: 1.04, duration: 0.05, transformOrigin: "50% 100%" }, "<-0.05")
        .to(word, { scaleY: 1, scaleX: 1, duration: 0.5, ease: "elastic.out(1, 0.35)" }, "<0.05")
        .fromTo(bun, { y: 0 }, { y: -14, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out" }, "<-0.05")
        .fromTo(ground, { scaleX: 0.2, opacity: 0.9 }, { scaleX: 1.6, opacity: 0, duration: 0.8, ease: "power2.out" }, "<")
        .to(items, { opacity: 1, x: 0, duration: 0.35, stagger: 0.07, ease: "power2.out" }, "<0.1");
      return tl;
    };
    const st = ScrollTrigger.create({ trigger: section, start: "top 55%", once: true, onEnter: thump });
    word.addEventListener("click", thump);
    return () => {
      st.kill();
      word.removeEventListener("click", thump);
    };
  }, []);

  return (
    <section ref={ref} className={s.thump} aria-labelledby="thump-title">
      <div className={s.thumpHead}>
        <h2 id="thump-title" className={s.thumpWord}>
          Thump.
        </h2>
        <p className={s.thumpLede}>
          A rabbit thumps its back foot to warn the others that something is wrong. These are the signs that mean{" "}
          <strong>call a rabbit-savvy vet today</strong>, not tomorrow. Rabbits hide illness well, and they can go
          downhill fast.
        </p>
        <div className={s.thumpActions}>
          <Link className={s.btnLight} href="/rabbit-symptom-checker/">
            Use the symptom checker
          </Link>
          <Link className={s.btnLine} href="/rabbit-health/">
            Read the health guide
          </Link>
        </div>
      </div>
      <ol className={s.signs}>
        {SIGNS.map(([a, b]) => (
          <li key={a}>
            <strong>{a}</strong>
            <span>{b}</span>
          </li>
        ))}
      </ol>
      <div className={s.thumpBun} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/home/cutouts/agouti.webp" alt="" />
        <span className={s.thumpGround} />
      </div>
    </section>
  );
}
