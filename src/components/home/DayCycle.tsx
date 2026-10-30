"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import s from "./home.module.css";

gsap.registerPlugin(ScrollTrigger);

type Panel = {
  time: string;
  title: string;
  body: string;
  video: string;
  links: { label: string; href: string }[];
};

const PANELS: Panel[] = [
  {
    time: "05:30",
    title: "Breakfast is all you can eat.",
    body: "Rabbits are most awake at dawn and dusk. They wake up hungry, and hay should be most of what they eat: a pile about the size of their body, every single day.",
    video: "dawn-grass",
    links: [
      { label: "Best hay for rabbits", href: "/best-hay-for-rabbits/" },
      { label: "What do rabbits eat?", href: "/what-do-rabbits-eat/" },
    ],
  },
  {
    time: "09:00",
    title: "Greens first, treats second.",
    body: "A handful of fresh leafy greens every day. Fruit and carrots are sweets in rabbit terms, so offer them in tiny pieces, not by the bowl.",
    video: "hand-feed",
    links: [
      { label: "Can rabbits eat this?", href: "/can-rabbits-eat-this/" },
      { label: "Can rabbits eat carrots?", href: "/can-rabbits-eat-carrots/" },
    ],
  },
  {
    time: "13:00",
    title: "Nap o’clock.",
    body: "The middle of the day is for dozing. They need somewhere to hide, room to stretch out flat, and enough space to hop properly when they wake up.",
    video: "log-rest",
    links: [
      { label: "How big should their home be?", href: "/how-big-should-a-rabbits-cage-be/" },
      { label: "Best bedding for rabbits", href: "/best-bedding-for-rabbits/" },
    ],
  },
  {
    time: "19:00",
    title: "Zoomies hour.",
    body: "Second wind. Running, digging, chewing, rearranging the furniture. Give them safe things to destroy, or they’ll pick something for themselves.",
    video: "dusk-group",
    links: [
      { label: "Rabbit toys and enrichment", href: "/rabbit-toys/" },
      { label: "Rabbit behaviour explained", href: "/rabbit-behaviour/" },
    ],
  },
  {
    time: "22:00",
    title: "The nightly once-over.",
    body: "Are they eating? Are there plenty of poos? Bright eyes, clean bottom, normal breathing? A thirty-second check every evening catches problems early.",
    video: "night-veg",
    links: [
      { label: "Rabbit health guide", href: "/rabbit-health/" },
      { label: "Symptom checker", href: "/rabbit-symptom-checker/" },
    ],
  },
];

/** Sky colours through the day: [progress, top, bottom, text]. */
const SKY: [number, string, string, string][] = [
  [0, "#f3b59a", "#fbe3c4", "#2b1d14"],
  [0.25, "#a9d3ee", "#eef4dc", "#1d2a14"],
  [0.5, "#7fc1ea", "#f4f0d6", "#1d2a14"],
  [0.75, "#d9744c", "#f2b46f", "#2b140c"],
  [1, "#0b1530", "#1f2c4a", "#efe9da"],
];

function skyAt(p: number) {
  let i = 0;
  while (i < SKY.length - 2 && p > SKY[i + 1][0]) i++;
  const [p0, t0, b0, i0] = SKY[i];
  const [p1, t1, b1, i1] = SKY[i + 1];
  const k = Math.min(1, Math.max(0, (p - p0) / (p1 - p0)));
  const mix = gsap.utils.interpolate;
  return { top: mix(t0, t1, k), bottom: mix(b0, b1, k), ink: k < 0.5 ? i0 : i1 };
}

function clockAt(p: number) {
  const minutes = 5.5 * 60 + p * (22.5 - 5.5) * 60;
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function DayCycle() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current!;
    const pin = pinRef.current!;
    const track = trackRef.current!;
    const clock = clockRef.current!;

    const paint = (p: number) => {
      const sky = skyAt(p);
      pin.style.setProperty("--sky-top", sky.top);
      pin.style.setProperty("--sky-bottom", sky.bottom);
      pin.style.setProperty("--day-ink", sky.ink);
      pin.style.setProperty("--day-p", String(p));
      pin.style.setProperty("--night", String(Math.min(1, Math.max(0, (p - 0.78) / 0.2))));
      clock.textContent = clockAt(p);
    };

    // Play videos only while they are on screen.
    const videos = Array.from(section.querySelectorAll("video"));
    const vio = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.2 }
    );
    videos.forEach((v) => vio.observe(v));

    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => `+=${distance() * 1.15}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => paint(self.progress),
        },
      });
      paint(0);
    });
    mm.add("(max-width: 899px), (prefers-reduced-motion: reduce)", () => {
      // Stacked panels: each one takes the sky of its own time of day.
      const panels = Array.from(track.children) as HTMLElement[];
      panels.forEach((panel, i) => {
        const sky = skyAt(i / (panels.length - 1));
        panel.style.setProperty("--sky-top", sky.top);
        panel.style.setProperty("--sky-bottom", sky.bottom);
        panel.style.setProperty("--day-ink", sky.ink);
      });
      paint(0);
      return () => panels.forEach((p) => p.removeAttribute("style"));
    });

    return () => {
      mm.revert();
      vio.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className={s.day} aria-labelledby="day-title">
      <div ref={pinRef} className={s.dayPin}>
        <div className={s.sky} aria-hidden="true">
          <span className={s.stars} />
          <span className={s.orb} />
        </div>
        <header className={s.dayHead}>
          <h2 id="day-title" className={s.dayTitle}>
            A rabbit&rsquo;s <em>day</em>
          </h2>
          <span ref={clockRef} className={s.clock} aria-hidden="true">
            05:30
          </span>
        </header>
        <div ref={trackRef} className={s.dayTrack}>
          {PANELS.map((p) => (
            <article key={p.time} className={s.panel}>
              <div className={s.burrow}>
                <video
                  src={`/home/video/${p.video}.mp4`}
                  poster={`/home/video/${p.video}.jpg`}
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-hidden="true"
                />
              </div>
              <div className={s.panelText}>
                <p className={s.panelTime}>{p.time}</p>
                <h3 className={s.panelTitle}>{p.title}</h3>
                <p className={s.panelBody}>{p.body}</p>
                <ul className={s.panelLinks}>
                  {p.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href}>
                        {l.label} <span aria-hidden="true">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
