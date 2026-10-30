"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MENU, type MenuItem } from "./menu";
import s from "./nav.module.css";

/**
 * Site header: transparent over page heroes, a compact cream bar once you
 * scroll, tucked away while scrolling down and back as soon as you scroll up.
 * `solid` starts it as the cream bar, for pages without a hero photo.
 */
export function SiteNav({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [sheet, setSheet] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 320);
        lastY = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setSheet(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
    };
  }, []);

  // Keep the page still behind the phone menu.
  useEffect(() => {
    document.documentElement.style.overflow = sheet ? "hidden" : "";
  }, [sheet]);

  const hover = (label: string | null) => {
    clearTimeout(closeTimer.current);
    if (label) setOpen(label);
    else closeTimer.current = setTimeout(() => setOpen(null), 160);
  };

  const state = [s.nav, scrolled || solid || sheet ? s.solid : "", hidden && !open && !sheet ? s.tucked : ""].join(" ");

  return (
    <header ref={navRef} className={state}>
      <div className={s.bar}>
        <Link href="/" className={s.brand} aria-label="RabbitCare.co.uk home">
          <span className={s.rabbit}>rabbit</span>
          <span className={s.care}>care</span>
          <span className={s.tld}>.co.uk</span>
        </Link>

        <nav aria-label="Main" className={s.menu}>
          <ul>
            {MENU.map((item) => (
              <TopItem key={item.label} item={item} open={open === item.label} onHover={hover} onToggle={setOpen} />
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className={s.menuButton}
          aria-expanded={sheet}
          aria-controls="site-sheet"
          onClick={() => setSheet((v) => !v)}
        >
          <span className={s.burger} aria-hidden="true" />
          {sheet ? "Close" : "Menu"}
        </button>
      </div>

      <div id="site-sheet" className={`${s.sheet} ${sheet ? s.sheetOpen : ""}`} hidden={!sheet}>
        <ul>
          {MENU.map((item) =>
            "href" in item ? (
              <li key={item.label}>
                <Link href={item.href} className={item.urgent ? s.sheetUrgent : s.sheetLink} onClick={() => setSheet(false)}>
                  {item.label}
                </Link>
              </li>
            ) : (
              <li key={item.label}>
                <details className={s.sheetGroup}>
                  <summary>{item.label}</summary>
                  {item.groups.map((g, i) => (
                    <div key={i} className={s.sheetSub}>
                      {g.title && <p className={s.sheetTitle}>{g.title}</p>}
                      <ul className={g.wide ? s.sheetCols : undefined}>
                        {g.links.map((l) => (
                          <li key={l.href}>
                            <Link href={l.href} onClick={() => setSheet(false)}>
                              {l.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </details>
              </li>
            )
          )}
        </ul>
      </div>
    </header>
  );
}

function TopItem({
  item,
  open,
  onHover,
  onToggle,
}: {
  item: MenuItem;
  open: boolean;
  onHover: (label: string | null) => void;
  onToggle: (label: string | null) => void;
}) {
  if ("href" in item) {
    return (
      <li>
        <Link href={item.href} className={item.urgent ? s.urgent : s.top}>
          {item.label}
        </Link>
      </li>
    );
  }
  const id = `menu-${item.label.toLowerCase().replace(/\W+/g, "-")}`;
  return (
    <li onPointerEnter={() => onHover(item.label)} onPointerLeave={() => onHover(null)}>
      <button
        type="button"
        className={s.top}
        aria-expanded={open}
        aria-controls={id}
        onClick={(e) => {
          e.stopPropagation();
          onToggle(open ? null : item.label);
        }}
      >
        {item.label}
        <svg className={s.caret} viewBox="0 0 10 6" aria-hidden="true">
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      <div id={id} className={`${s.panel} ${s[item.layout]} ${open ? s.panelOpen : ""}`}>
        {item.groups.map((g, i) => (
          <div key={i} className={g.wide ? s.groupWide : s.group}>
            {g.title && <p className={s.groupTitle}>{g.title}</p>}
            <ul>
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={() => onToggle(null)}>
                    <strong>{l.label}</strong>
                    {l.note && <span>{l.note}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </li>
  );
}
