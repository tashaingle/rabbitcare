import fs from "fs";
import path from "path";
import Link from "next/link";
import { WpContent } from "@/components/WpContent";
import { getAllPages } from "@/lib/content";

/**
 * Use the WordPress Home page HTML (your custom-built design) when available.
 * Falls back to a simple index if home.html is missing.
 */
export default function HomePage() {
  const homePath = path.join(process.cwd(), "content", "home.html");
  const hasHome = fs.existsSync(homePath);
  const totalContent = getAllPages().filter((p) => p.slug !== "learn-more")
    .length;

  if (hasHome) {
    const html = fs.readFileSync(homePath, "utf8");
    return (
      <>
        <WpContent html={html} />
        {/* Small discoverability strip under your WP homepage design */}
        <div className="home-index-strip">
          <div className="home-index-strip-inner">
            <p>
              Looking for every guide? Browse all{" "}
              <strong>{totalContent}</strong> care pages in one place.
            </p>
            <Link className="btn btn-primary" href="/guides">
              Full page index →
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="directory">
      <h1>RabbitCare.co.uk</h1>
      <p>
        <Link href="/guides">Browse all guides</Link>
      </p>
    </div>
  );
}
