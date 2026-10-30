"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import s from "./home.module.css";

/** Cut-outs and their sitting height (relative), with a made-up name each. */
const BUNS = [
  { src: "soot", name: "Soot", h: 0.62 },
  { src: "magpie-lop", name: "Pepper", h: 0.92 },
  { src: "ginger-lop", name: "Marmalade", h: 0.8 },
  { src: "panda", name: "Domino", h: 0.78 },
  { src: "big-lop", name: "Cloud", h: 1 },
  { src: "lionhead", name: "Biscuit", h: 0.8 },
  { src: "grey-chatter", name: "Pebble", h: 0.9 },
  { src: "fawn-lop", name: "Hazel", h: 0.74 },
  { src: "cream-lop", name: "Custard", h: 0.84 },
  { src: "silver-lop", name: "Willow", h: 0.82 },
];

export function Lineup() {
  const rowRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const row = rowRef.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const buns = Array.from(row.querySelectorAll<HTMLElement>(`.${s.bun}`));
    const busy = new WeakSet<HTMLElement>();

    const hop = (li: HTMLElement, big = false) => {
      if (busy.has(li)) return;
      busy.add(li);
      const body = li.querySelector<HTMLElement>(`.${s.bunBody}`)!;
      const shadow = li.querySelector<HTMLElement>(`.${s.bunShadow}`)!;
      const height = big ? -120 : -55;
      const tl = gsap.timeline({
        onComplete: () => {
          busy.delete(li);
        },
      });
      tl.to(body, { scaleY: 0.86, scaleX: 1.06, duration: 0.12, ease: "power2.in", transformOrigin: "50% 100%" })
        .to(body, { y: height, scaleY: 1.06, scaleX: 0.96, duration: big ? 0.38 : 0.26, ease: "power2.out" })
        .to(shadow, { scale: 0.55, opacity: 0.25, duration: big ? 0.38 : 0.26, ease: "power2.out" }, "<");
      if (big) tl.to(body, { rotation: 360, duration: 0.6, ease: "power1.inOut" }, "<");
      tl.to(body, { y: 0, scaleY: 1, scaleX: 1, duration: big ? 0.38 : 0.26, ease: "power2.in" })
        .to(shadow, { scale: 1, opacity: 1, duration: big ? 0.38 : 0.26, ease: "power2.in" }, "<")
        .set(body, { rotation: 0 })
        .to(body, { scaleY: 0.9, scaleX: 1.05, duration: 0.07 })
        .to(body, { scaleY: 1, scaleX: 1, duration: 0.45, ease: "elastic.out(1, 0.4)" });
    };

    const handlers = buns.map((li) => {
      const enter = () => hop(li);
      const click = () => hop(li, true);
      li.addEventListener("pointerenter", enter);
      li.addEventListener("click", click);
      return () => {
        li.removeEventListener("pointerenter", enter);
        li.removeEventListener("click", click);
      };
    });

    // Every so often someone hops on their own, but only while visible.
    let timer: ReturnType<typeof setTimeout>;
    let visible = false;
    const idle = () => {
      if (visible) hop(buns[Math.floor(Math.random() * buns.length)]);
      timer = setTimeout(idle, 1800 + Math.random() * 2600);
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(row);
    timer = setTimeout(idle, 1500);

    return () => {
      handlers.forEach((off) => off());
      clearTimeout(timer);
      io.disconnect();
    };
  }, []);

  return (
    <section className={s.lineup} aria-labelledby="lineup-title">
      <div className={s.lineupHead}>
        <h2 id="lineup-title" className={s.lineupTitle}>
          Every one&rsquo;s a <em>character.</em>
        </h2>
        <p>
          Lops, lionheads, tiny dwarfs and giant softies. Different shapes, same needs: space, company, hay, and an
          owner who pays attention. Say hello. They hop.
        </p>
      </div>
      <ul ref={rowRef} className={s.row}>
        {BUNS.map((b) => (
          <li key={b.src} className={s.bun} style={{ ["--h" as string]: b.h }} tabIndex={0} aria-label={b.name}>
            <span className={s.bunShadow} />
            <span className={s.bunBody}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/home/cutouts/${b.src}.webp`} alt="" loading="lazy" />
            </span>
            <span className={s.bunName}>{b.name}</span>
          </li>
        ))}
      </ul>
      <div className={s.lineupActions}>
        <Link className={s.btnDark} href="/new-rabbit-owner-checklist/">
          Build your new owner checklist
        </Link>
        <Link className={s.btnGhost} href="/learn-more/">
          Browse every guide
        </Link>
      </div>
    </section>
  );
}
