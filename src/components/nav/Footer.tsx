"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import s from "./footer.module.css";

const COLUMNS = [
  {
    title: "Care guides",
    links: [
      ["New rabbit owner information", "/new-rabbit-owner-information/"],
      ["Rabbit housing size", "/how-big-should-a-rabbits-cage-be/"],
      ["Best bedding for rabbits", "/best-bedding-for-rabbits/"],
      ["Rabbit toys", "/rabbit-toys/"],
      ["Rabbit behaviour", "/rabbit-behaviour/"],
      ["Rabbit health", "/rabbit-health/"],
    ],
  },
  {
    title: "Food",
    links: [
      ["What do rabbits eat?", "/what-do-rabbits-eat/"],
      ["Best hay for rabbits", "/best-hay-for-rabbits/"],
      ["Can rabbits eat carrots?", "/can-rabbits-eat-carrots/"],
      ["Can rabbits eat apples?", "/can-rabbits-eat-apples/"],
      ["Can rabbits eat bananas?", "/can-rabbits-eat-bananas/"],
      ["All food guides", "/can-rabbits-eat-this/"],
    ],
  },
  {
    title: "Tools",
    links: [
      ["Food checker", "/can-rabbits-eat-this/"],
      ["Housing calculator", "/rabbit-housing-size-calculator/"],
      ["Symptom checker", "/rabbit-symptom-checker/"],
      ["New owner checklist", "/new-rabbit-owner-checklist/"],
    ],
  },
  {
    title: "About",
    links: [
      ["About the author", "/author/"],
      ["Contact us", "/contact-us/"],
      ["Every guide", "/learn-more/"],
      ["Privacy policy & cookies", "/privacy-policy/"],
    ],
  },
];

/** Site footer: a rabbit keeps watch over the top edge and hops if you say hello. */
export function Footer() {
  const bunRef = useRef<HTMLButtonElement>(null);

  const hop = () => {
    const bun = bunRef.current;
    if (!bun || gsap.isTweening(bun) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap
      .timeline()
      .to(bun, { scaleY: 0.86, scaleX: 1.06, duration: 0.12, ease: "power2.in", transformOrigin: "50% 100%" })
      .to(bun, { y: -70, scaleY: 1.06, scaleX: 0.96, duration: 0.28, ease: "power2.out" })
      .to(bun, { y: 0, scaleY: 1, scaleX: 1, duration: 0.28, ease: "power2.in" })
      .to(bun, { scaleY: 0.9, scaleX: 1.05, duration: 0.07 })
      .to(bun, { scaleY: 1, scaleX: 1, duration: 0.45, ease: "elastic.out(1, 0.4)" });
  };

  return (
    <footer className={s.footer}>
      <button ref={bunRef} type="button" className={s.bun} onPointerEnter={hop} onClick={hop} aria-label="Say hello">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/home/cutouts/big-lop.webp" alt="" loading="lazy" />
      </button>

      <div className={s.top}>
        <div className={s.intro}>
          <p className={s.lede}>
            Simple, practical rabbit care guides for <em>UK owners.</em>
          </p>
          <p className={s.contact}>
            Got a question or an idea for a guide?
            <a href="mailto:natasha@rabbitcare.co.uk">natasha@rabbitcare.co.uk</a>
          </p>
          <p className={s.notice}>
            <strong>Important:</strong> RabbitCare.co.uk provides general information only. If your rabbit stops eating,
            stops pooing, seems in pain or is suddenly unwell, contact a rabbit-savvy vet urgently.{" "}
            <Link href="/rabbit-health/">Urgent signs →</Link>
          </p>
        </div>

        <nav className={s.columns} aria-label="Footer">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className={s.colTitle}>{col.title}</p>
              <ul>
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className={s.bottom}>
        <p>© {new Date().getFullYear()} RabbitCare.co.uk. Created by Natasha Card. All rights reserved.</p>
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          Back to the top ↑
        </button>
      </div>

    </footer>
  );
}
