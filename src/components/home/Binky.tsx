"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import s from "./home.module.css";

gsap.registerPlugin(ScrollTrigger);

const WORDS = ["Happy", "rabbits"];

const TOOLS = [
  { n: "01", title: "Food checker", text: "Can they eat it?", href: "/can-rabbits-eat-this/" },
  { n: "02", title: "Housing calculator", text: "Is their space big enough?", href: "/rabbit-housing-size-calculator/" },
  { n: "03", title: "Symptom checker", text: "Should I call the vet?", href: "/rabbit-symptom-checker/" },
  { n: "04", title: "Owner checklist", text: "Everything for day one", href: "/new-rabbit-owner-checklist/" },
];

/** Little puff of dust where the rabbit lands. */
function puff(stage: HTMLElement, x: number, y: number) {
  for (let i = 0; i < 9; i++) {
    const d = document.createElement("span");
    d.className = s.dust;
    stage.appendChild(d);
    const size = 6 + Math.random() * 12;
    gsap.set(d, { x, y, width: size, height: size, opacity: 0.7 });
    gsap.to(d, {
      x: x + (Math.random() - 0.5) * 140,
      y: y - Math.random() * 40,
      scale: 1.8,
      opacity: 0,
      duration: 0.7 + Math.random() * 0.4,
      ease: "power2.out",
      onComplete: () => d.remove(),
    });
  }
}

export function Binky() {
  const stageRef = useRef<HTMLDivElement>(null);
  const rabbitRef = useRef<HTMLButtonElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const stage = stageRef.current!;
    const rabbit = rabbitRef.current!;
    const img = rabbit.querySelector("img")!;
    const words = wordRefs.current.filter(Boolean) as HTMLSpanElement[];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let side: "left" | "right" = "left";
    let running = false;

    const ends = () => {
      const w = stage.clientWidth;
      const rw = rabbit.offsetWidth;
      return { left: 0, right: w - rw };
    };
    gsap.set(rabbit, { x: ends().left });

    const binky = () => {
      if (running || reduced) return;
      running = true;
      const { left, right } = ends();
      const to = side === "left" ? right : left;
      const dir = side === "left" ? 1 : -1;
      const apex = -stage.clientHeight * 0.92;
      const bumped = new Set<HTMLSpanElement>();
      const stageBox = stage.getBoundingClientRect();
      const centres = words.map((w) => {
        const b = w.getBoundingClientRect();
        return b.left - stageBox.left + b.width / 2;
      });

      const tl = gsap.timeline({
        onComplete: () => {
          side = side === "left" ? "right" : "left";
          running = false;
          // Turn round, ready to go back.
          gsap.to(img, { scaleX: side === "left" ? 1 : -1, duration: 0.25, delay: 0.6 });
        },
      });
      // Crouch.
      tl.to(rabbit, { scaleY: 0.78, scaleX: 1.12, duration: 0.22, ease: "power2.in", transformOrigin: "50% 100%" })
        // Launch: stretch.
        .addLabel("air")
        .to(rabbit, { scaleY: 1.08, scaleX: 0.94, duration: 0.15, ease: "power2.out" }, "air")
        .to(
          rabbit,
          {
            x: to,
            duration: 1.15,
            ease: "none",
            onUpdate() {
              const x = Number(gsap.getProperty(rabbit, "x")) + rabbit.offsetWidth / 2;
              centres.forEach((c, i) => {
                if (!bumped.has(words[i]) && Math.abs(c - x) < 70) {
                  bumped.add(words[i]);
                  gsap
                    .timeline()
                    .to(words[i], { y: -26, duration: 0.18, ease: "power2.out" })
                    .to(words[i], { y: 0, duration: 0.8, ease: "elastic.out(1.1, 0.3)" });
                }
              });
            },
          },
          "air"
        )
        .to(rabbit, { y: apex, duration: 0.575, ease: "power2.out" }, "air")
        .to(rabbit, { y: 0, duration: 0.575, ease: "power2.in" }, "air+=0.575")
        // The twist and kick that makes it a binky.
        .to(rabbit, { rotation: -16 * dir, duration: 0.3, ease: "power1.out" }, "air")
        .to(rabbit, { rotation: 32 * dir, skewX: -14 * dir, duration: 0.22, ease: "power2.inOut" }, "air+=0.42")
        .to(rabbit, { rotation: -6 * dir, skewX: 0, duration: 0.3, ease: "power2.inOut" }, "air+=0.64")
        .to(rabbit, { rotation: 0, duration: 0.2 }, "air+=0.95")
        .add(() => puff(stage, to + rabbit.offsetWidth / 2, stage.clientHeight - 8), "air+=1.12")
        // Land: squash and settle.
        .to(rabbit, { scaleY: 0.82, scaleX: 1.1, duration: 0.09, ease: "power2.out" }, "air+=1.15")
        .to(rabbit, { scaleY: 1, scaleX: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    };

    rabbit.addEventListener("click", binky);
    const st = ScrollTrigger.create({ trigger: stage, start: "top 62%", once: true, onEnter: () => setTimeout(binky, 250) });
    const onResize = () => {
      if (!running) gsap.set(rabbit, { x: ends()[side] });
    };
    window.addEventListener("resize", onResize);

    return () => {
      rabbit.removeEventListener("click", binky);
      window.removeEventListener("resize", onResize);
      st.kill();
    };
  }, []);

  return (
    <section className={s.binky} aria-labelledby="binky-title">
      <div className={s.binkyStage} ref={stageRef}>
        <h2 id="binky-title" className={s.binkyTitle}>
          {WORDS.map((w, i) => (
            <span
              key={w}
              className={s.binkyWord}
              ref={(el) => {
                wordRefs.current[i] = el;
              }}
            >
              {w}
            </span>
          ))}{" "}
          <em
            className={s.binkyWord}
            ref={(el) => {
              wordRefs.current[WORDS.length] = el;
            }}
          >
            binky.
          </em>
        </h2>
        <button ref={rabbitRef} type="button" className={s.binkyRabbit} aria-label="Make the rabbit binky">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/home/cutouts/dalmatian.webp" alt="" />
        </button>
      </div>

      <div className={s.binkyBody}>
        <p className={s.binkyLede}>
          A binky is a sudden leap with a twist and a kick. It&rsquo;s the clearest sign a rabbit feels safe, healthy
          and completely delighted with life. Everything here is about giving yours more reasons to do it.
        </p>
        <p className={s.binkyNote}>Tap the rabbit to see another.</p>
      </div>

      <ol className={s.tools} aria-label="Rabbit care tools">
        {TOOLS.map((t) => (
          <li key={t.n}>
            <Link href={t.href}>
              <span className={s.toolNum}>{t.n}</span>
              <strong>{t.title}</strong>
              <span>{t.text}</span>
              <span className={s.toolArrow} aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
