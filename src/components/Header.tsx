"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/guides", label: "All pages" },
  { href: "/can-rabbits-eat-this", label: "Food checker" },
  { href: "/rabbit-symptom-checker", label: "Symptom checker" },
  { href: "/rabbit-housing-size-calculator", label: "Housing calculator" },
  { href: "/new-rabbit-owner-checklist", label: "Owner checklist" },
  { href: "/contact-us", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header site-header--compact">
      <div className="site-header-inner">
        <Link href="/" className="site-logo" onClick={() => setOpen(false)}>
          <span className="site-logo-mark" aria-hidden>
            🐇
          </span>
          <span>
            <strong>RabbitCare</strong>
            <small>.co.uk</small>
          </span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>

        <nav
          id="site-nav"
          className={`site-nav ${open ? "is-open" : ""}`}
          aria-label="Main"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
