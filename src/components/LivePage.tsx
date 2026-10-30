import { Footer } from "@/components/nav/Footer";
import { SiteNav } from "@/components/nav/SiteNav";
import { WpContent } from "@/components/WpContent";
import type { LivePageData } from "@/lib/content";

/**
 * A page mirrored from the live WordPress site, plus the per-page block styles
 * WordPress generated for it. The site header and footer replace WordPress's
 * own (hidden in globals.css; the WordPress header still holds its space so
 * page heroes keep their position).
 */
export function LivePage({ page }: { page: LivePageData }) {
  return (
    <div className={page.bodyClass}>
      {page.css && <style dangerouslySetInnerHTML={{ __html: page.css }} />}
      <SiteNav />
      <WpContent html={page.html} className="wp-site-blocks" />
      <Footer />
    </div>
  );
}
