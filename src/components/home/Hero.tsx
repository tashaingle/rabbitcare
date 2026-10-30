"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Meadow, type Pointer } from "./meadow";
import s from "./home.module.css";

/** Rabbits hiding in the grass: left %, size (% of the photo's height), depth blur, delay before first peek. */
const PEEKERS = [
  { src: "/home/cutouts/agouti.webp", left: 9, size: 30, blur: 0.5, delay: 1.2, flip: true },
  { src: "/home/cutouts/wild-ears.webp", left: 85, size: 40, blur: 0, delay: 2.1, flip: false },
  { src: "/home/cutouts/lionhead.webp", left: 46, size: 24, blur: 0.9, delay: 2.8, flip: false },
];

const HIDDEN = 108; // % of own height pushed below the hero
const EARS = 70; // just ear tips showing
const PEEK = 28; // head and shoulders out of the grass

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLCanvasElement>(null);
  const midRef = useRef<HTMLCanvasElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);
  const rabbitRefs = useRef<(HTMLDivElement | null)[]>([]);
  const toastRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const hero = heroRef.current!;
    // The photo, grass and rabbits: the whole hero on desktop, the lower half on phones.
    const stage = stageRef.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const meadow = new Meadow(backRef.current!, midRef.current!, frontRef.current!);
    const pointer: Pointer = { x: -9999, y: -9999, vx: 0, vy: 0, inside: false };
    const rabbits = rabbitRefs.current.filter(Boolean) as HTMLDivElement[];
    const state = rabbits.map(() => ({ out: false, busy: false }));
    let speed = 0;
    let calmSince = performance.now();
    let warned = false;
    let last = { x: 0, y: 0, t: 0 };

    const resize = () => meadow.resize(stage.clientWidth, stage.clientHeight);
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(stage);

    gsap.set(rabbits, { yPercent: HIDDEN });

    const peek = (i: number, delay = 0) => {
      const r = rabbits[i];
      if (state[i].out || state[i].busy) return;
      state[i].busy = true;
      gsap.timeline({
        delay,
        onComplete: () => {
          state[i].out = true;
          state[i].busy = false;
        },
      })
        // Cautious: ears first, a pause to listen, then the head.
        .to(r, { yPercent: EARS, duration: 0.9, ease: "power2.out" })
        .to(r, { yPercent: PEEK, duration: 0.7, ease: "back.out(1.6)" }, "+=0.55")
        .to(r, { rotation: 2.5, duration: 0.09, yoyo: true, repeat: 3, ease: "sine.inOut", transformOrigin: "50% 100%" })
        .set(r, { rotation: 0 });
    };

    const duck = (i: number) => {
      const r = rabbits[i];
      gsap.killTweensOf(r);
      state[i] = { out: false, busy: false };
      gsap.to(r, { yPercent: HIDDEN, rotation: 0, duration: 0.2, ease: "power3.in" });
      if (!warned && toastRef.current) {
        warned = true;
        const box = r.getBoundingClientRect();
        const stageBox = stage.getBoundingClientRect();
        const toast = toastRef.current;
        // Next to the rabbit that ducked, but never off the edge of the screen.
        const left = box.left - stageBox.left + box.width / 2 - toast.offsetWidth / 2;
        toast.style.left = `${Math.max(12, Math.min(left, stageBox.width - toast.offsetWidth - 12))}px`;
        gsap.fromTo(toast, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "back.out(2)" });
        gsap.to(toast, { autoAlpha: 0, y: -8, delay: 4.5, duration: 0.5 });
      }
    };

    if (reduced) {
      gsap.set(rabbits, { yPercent: PEEK });
      rabbits.forEach((_, i) => (state[i].out = true));
    } else {
      PEEKERS.forEach((p, i) => peek(i, p.delay));
    }

    const onMove = (e: PointerEvent) => {
      const box = stage.getBoundingClientRect();
      const x = e.clientX - box.left;
      const y = e.clientY - box.top;
      const now = performance.now();
      const dt = Math.max(1, now - last.t);
      const vx = (x - last.x) / dt;
      const vy = (y - last.y) / dt;
      last = { x, y, t: now };
      pointer.x = x;
      pointer.y = y;
      pointer.vx = pointer.vx * 0.6 + vx * 0.4;
      pointer.vy = pointer.vy * 0.6 + vy * 0.4;
      pointer.inside = true;
      speed = speed * 0.7 + Math.hypot(vx, vy) * 0.3;
      hero.style.setProperty("--mx", String(x / box.width - 0.5));
      hero.style.setProperty("--my", String(y / box.height - 0.5));

      if (reduced) return;
      if (speed > 1.5) {
        calmSince = now;
        rabbits.forEach((r, i) => {
          if (!state[i].out && !state[i].busy) return;
          const rb = r.getBoundingClientRect();
          const d = Math.hypot(rb.left + rb.width / 2 - e.clientX, rb.top + rb.height * 0.4 - e.clientY);
          if (d < Math.max(360, box.width * 0.28)) duck(i);
        });
      } else if (speed > 0.5) {
        calmSince = now;
      }
    };
    const onLeave = () => {
      pointer.inside = false;
    };
    const onDown = (e: PointerEvent) => {
      // A tap is a sudden movement too.
      speed = 3;
      onMove(e);
    };
    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerdown", onDown);
    hero.addEventListener("pointerleave", onLeave);

    let raf = 0;
    let prev = performance.now();
    let visible = true;
    const loop = (t: number) => {
      const dt = Math.min(0.033, (t - prev) / 1000);
      prev = t;
      speed *= 0.92;
      pointer.vx *= 0.9;
      pointer.vy *= 0.9;
      meadow.step(t, dt, pointer);
      meadow.draw();
      // After a calm spell, hidden rabbits risk another look.
      if (!reduced && t - calmSince > 1400) {
        state.forEach((st, i) => {
          if (!st.out && !st.busy) peek(i, i * 0.5 + Math.random() * 0.6);
        });
        calmSince = t;
      }
      raf = visible ? requestAnimationFrame(loop) : 0;
    };
    if (reduced) {
      meadow.step(0, 0.016, pointer);
      meadow.draw();
    } else {
      raf = requestAnimationFrame(loop);
    }

    // Pause the simulation when the hero is off screen.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf && !reduced) {
        prev = performance.now();
        raf = requestAnimationFrame(loop);
      }
    });
    io.observe(hero);

    // Scroll parallax: the photo drifts, the copy lifts away.
    const onScroll = () => {
      const p = Math.min(1, Math.max(0, window.scrollY / hero.clientHeight));
      hero.style.setProperty("--scroll", String(p));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerdown", onDown);
      hero.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(rabbits);
    };
  }, []);

  return (
    <section ref={heroRef} className={s.hero} aria-labelledby="home-title">
      <div ref={stageRef} className={s.stage}>
        <picture className={s.heroPhoto}>
          <source media="(max-width: 960px)" srcSet="/home/photos/magpie-960.webp" />
          <img
            src="/home/photos/magpie-1920.webp"
            alt="A black and white rabbit sitting in the grass with one ear up and one ear down"
          />
        </picture>
        <canvas ref={backRef} className={`${s.grass} ${s.grassBack}`} aria-hidden="true" />
        <div className={s.peekers} aria-hidden="true">
          {PEEKERS.map((p, i) => (
            <div
              key={p.src}
              ref={(el) => {
                rabbitRefs.current[i] = el;
              }}
              className={s.peeker}
              style={{ left: `${p.left}%`, height: `${p.size}%`, filter: p.blur ? `blur(${p.blur}px)` : undefined }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt="" style={p.flip ? { transform: "scaleX(-1)" } : undefined} />
            </div>
          ))}
        </div>
        <canvas ref={midRef} className={`${s.grass} ${s.grassMid}`} aria-hidden="true" />
        <canvas ref={frontRef} className={`${s.grass} ${s.grassFront}`} aria-hidden="true" />

        <p ref={toastRef} className={s.toast} role="status">
          <strong>Eep, too fast!</strong> Rabbits are prey animals, so sudden movement means danger. Keep still and
          they&rsquo;ll come back.
        </p>
      </div>

      <div className={s.heroCopy}>
        <p className={s.kicker}>RabbitCare.co.uk · Rabbit care for UK owners</p>
        <h1 id="home-title" className={s.heroTitle}>
          Rabbits notice <em>everything.</em>
          <span className={s.srOnly}> Practical rabbit care advice for UK owners.</span>
        </h1>
        <p className={s.heroLede}>
          Food, homes, behaviour and knowing when to worry. Straightforward advice for people who want their
          rabbits to be properly happy.
        </p>
        <div className={s.heroActions}>
          <Link className={s.btnDark} href="/new-rabbit-owner-information/">
            New to rabbits? Start here
          </Link>
          <Link className={s.btnGhost} href="#can-they-eat-it">
            Can they eat it?
          </Link>
        </div>
        <p className={s.hint}>
          <span aria-hidden="true">↘</span> Move slowly through the grass. They&rsquo;re watching you.
        </p>
      </div>
    </section>
  );
}
