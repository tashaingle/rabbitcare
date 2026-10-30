import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <div className="wp-site-blocks">
      <SiteHeader />
      <main className="site-main directory" style={{ textAlign: "center", padding: "64px 20px" }}>
        <h1>Page not found</h1>
        <p>Sorry, that page doesn’t exist.</p>
        <p>
          <Link href="/">Back to home</Link> · <Link href="/learn-more/">Browse guides</Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
