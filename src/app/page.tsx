import { LivePage } from "@/components/LivePage";
import { getLivePage } from "@/lib/content";

/** The WordPress homepage, mirrored by scripts/sync-live.mjs. */
export default function HomePage() {
  const page = getLivePage("_home");
  if (!page) throw new Error("Run `node scripts/sync-live.mjs` to fetch the homepage.");
  return <LivePage page={page} />;
}
