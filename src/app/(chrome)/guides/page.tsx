import type { Metadata } from "next";
import { PageDirectory } from "@/components/PageDirectory";
import { getAllPages } from "@/lib/content";

export const metadata: Metadata = {
  title: "All rabbit care guides & tools",
  description:
    "Browse every RabbitCare.co.uk guide, food article, tool and info page in one place.",
};

export default function GuidesPage() {
  // Exclude the old learn-more shell page from the directory (we replace it)
  const pages = getAllPages().filter((p) => p.slug !== "learn-more");

  return (
    <PageDirectory
      pages={pages}
      heading="All rabbit care guides & tools"
      intro="Browse every care guide, food article and interactive tool on the site. Nothing is hidden — use this page as your full library."
    />
  );
}
