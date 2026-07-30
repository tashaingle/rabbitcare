import fs from "fs";
import path from "path";

/**
 * Your WordPress footer (Custom HTML).
 */
export function SiteFooter() {
  const html = fs.readFileSync(
    path.join(process.cwd(), "content", "chrome", "footer.html"),
    "utf8"
  );

  return (
    <div
      className="site-chrome-footer"
      // Trusted markup from your RabbitCare footer template
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
