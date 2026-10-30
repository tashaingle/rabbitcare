import { Footer } from "@/components/nav/Footer";
import { SiteNav } from "@/components/nav/SiteNav";

/** Next.js-only pages (the guides directory): no hero photo, so the header starts solid. */
export default function ChromeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav solid />
      <main className="site-main" style={{ paddingTop: 62 }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
