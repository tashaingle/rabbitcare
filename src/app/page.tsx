import fs from "fs";
import path from "path";
import Link from "next/link";
import { WpContent } from "@/components/WpContent";

/**
 * Use the WordPress Home page HTML (your custom-built design) when available.
 * Falls back to a simple index if home.html is missing.
 */
export default function HomePage() {
  const homePath = path.join(process.cwd(), "content", "home.html");
  const hasHome = fs.existsSync(homePath);

  if (hasHome) {
    const html = fs.readFileSync(homePath, "utf8");
    return <WpContent html={html} />;
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
