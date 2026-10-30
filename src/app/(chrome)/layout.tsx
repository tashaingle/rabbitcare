import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

/**
 * Next.js-only pages (shop, cart, guides) wrapped in the same WordPress
 * header and footer template parts as the mirrored pages.
 */
export default function ChromeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="wp-site-blocks">
      <SiteHeader />
      <main className="site-main">{children}</main>
      <SiteFooter />
    </div>
  );
}
