import Link from "next/link";
import { Footer } from "@/components/nav/Footer";
import { SiteNav } from "@/components/nav/SiteNav";

export default function NotFound() {
  return (
    <>
      <SiteNav solid />
      <main className="site-main directory" style={{ textAlign: "center", padding: "140px 20px 64px" }}>
        <h1>Page not found</h1>
        <p>Sorry, that page doesn’t exist.</p>
        <p>
          <Link href="/">Back to home</Link> · <Link href="/learn-more/">Browse guides</Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
