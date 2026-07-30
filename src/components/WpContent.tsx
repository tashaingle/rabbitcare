"use client";

import { useEffect, useRef } from "react";

/**
 * Renders HTML exported from WordPress Custom HTML blocks.
 * Re-injects <script> tags after mount so interactive tools still work.
 * Content is from your own WordPress export (trusted site content).
 */
export function WpContent({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    root.innerHTML = html;

    const scripts = Array.from(root.querySelectorAll("script"));
    for (const old of scripts) {
      const script = document.createElement("script");
      for (const attr of old.attributes) {
        script.setAttribute(attr.name, attr.value);
      }
      if (old.textContent) script.textContent = old.textContent;
      old.replaceWith(script);
    }

    return () => {
      root.innerHTML = "";
    };
  }, [html]);

  return <div className="wp-migrated-content" ref={ref} />;
}
