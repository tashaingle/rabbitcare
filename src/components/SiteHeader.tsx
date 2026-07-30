import fs from "fs";
import path from "path";

/**
 * Your WordPress transparent header (Custom HTML) — CSS-only dropdowns & mobile menu.
 */
export function SiteHeader() {
  const html = fs.readFileSync(
    path.join(process.cwd(), "content", "chrome", "header.html"),
    "utf8"
  );

  return (
    <div
      className="site-chrome-header"
      // Trusted markup from your RabbitCare header template
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
