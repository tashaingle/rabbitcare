import { WpContent } from "@/components/WpContent";
import type { LivePageData } from "@/lib/content";

/**
 * A page mirrored from the live WordPress site: its own header, content and
 * footer, plus the per-page block styles WordPress generated for it.
 */
export function LivePage({ page }: { page: LivePageData }) {
  return (
    <div className={page.bodyClass}>
      {page.css && <style dangerouslySetInnerHTML={{ __html: page.css }} />}
      <WpContent html={page.html} className="wp-site-blocks" />
    </div>
  );
}
