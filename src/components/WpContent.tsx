"use client";

import { useEffect, useRef } from "react";

/**
 * Renders HTML exported from WordPress Custom HTML blocks.
 * HTML is server-rendered via dangerouslySetInnerHTML so content is visible
 * immediately (and without waiting for hydration). Scripts are re-executed
 * after mount so interactive tools still work.
 */
export function WpContent({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    // Re-execute scripts (browsers skip scripts inserted via innerHTML/SSR)
    const scripts = Array.from(root.querySelectorAll("script"));
    for (const old of scripts) {
      if (old.dataset.rcExecuted === "1") continue;
      const script = document.createElement("script");
      for (const attr of old.attributes) {
        script.setAttribute(attr.name, attr.value);
      }
      if (old.textContent) script.textContent = old.textContent;
      script.dataset.rcExecuted = "1";
      old.replaceWith(script);
    }
  }, [html]);

  return (
    <div
      ref={ref}
      className="wp-migrated-content"
      // Trusted content from your own WordPress export
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
