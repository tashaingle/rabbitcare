import Link from "next/link";
import { Footer } from "@/components/nav/Footer";
import { SiteNav } from "@/components/nav/SiteNav";
import s from "@/components/guides/guide.module.css";

export default function NotFound() {
  return (
    <div className={s.guide}>
      <SiteNav solid />
      <main className={s.section} style={{ paddingTop: 140 }}>
        <p className={s.eyebrow}>Missing page</p>
        <h1 className={s.h2}>Page not found</h1>
        <p className={s.sub}>Sorry, that page doesn’t exist.</p>
        <div className={s.actions}>
          <Link className={s.btnDark} href="/">
            Back to home
          </Link>
          <Link className={s.btnGhost} href="/learn-more/">
            Browse guides
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
