/**
 * Copy only images referenced by migrated pages into public/wp-content/uploads
 * (full Images/ folder is ~1.5GB — too large for a normal Vercel deploy).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const websiteRoot = path.resolve(__dirname, "..");
const contentDir = path.join(websiteRoot, "content", "pages");
const imagesRoot = path.resolve(websiteRoot, "..", "Images");
const publicUploads = path.join(websiteRoot, "public", "wp-content", "uploads");

function collectRefs() {
  const refs = new Set();
  const re =
    /(?:https?:\/\/rabbitcare\.co\.uk)?\/wp-content\/uploads\/([0-9]{4}\/[0-9]{2}\/[^"'?\s)<>]+)/gi;

  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    const raw = fs.readFileSync(path.join(contentDir, file), "utf8");
    for (const m of raw.matchAll(re)) {
      let rel = m[1].replace(/\\/g, "/").replace(/&amp;/g, "&").replace(/\/+$/, "");
      // drop trailing junk from broken CSS urls
      rel = rel.replace(/['"]+$/, "");
      if (rel) refs.add(rel);
    }
  }

  // also scan homepage if present
  const homePath = path.join(websiteRoot, "content", "home.html");
  if (fs.existsSync(homePath)) {
    const raw = fs.readFileSync(homePath, "utf8");
    for (const m of raw.matchAll(re)) {
      refs.add(m[1].replace(/\\/g, "/").replace(/&amp;/g, "&"));
    }
  }

  return [...refs];
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function tryCopy(rel) {
  const src = path.join(imagesRoot, rel);
  const dest = path.join(publicUploads, rel);
  if (!fs.existsSync(src)) return { ok: false, rel, reason: "missing source" };
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  return { ok: true, rel, bytes: fs.statSync(dest).size };
}

if (!fs.existsSync(imagesRoot)) {
  console.error("Images folder not found at", imagesRoot);
  process.exit(1);
}

const refs = collectRefs();
console.log(`Found ${refs.length} unique upload paths in content`);

let copied = 0;
let missing = 0;
let bytes = 0;
const missingList = [];

for (const rel of refs) {
  const result = tryCopy(rel);
  if (result.ok) {
    copied++;
    bytes += result.bytes;
  } else {
    missing++;
    missingList.push(rel);
    // Try without dimension suffix e.g. name-600x600.webp -> name.webp
    const alt = rel.replace(/-\d+x\d+(\.[a-z0-9]+)$/i, "$1");
    if (alt !== rel) {
      const r2 = tryCopy(alt);
      if (r2.ok) {
        // also copy under the sized name if source has sized version missing
        // (use full image as fallback by copying alt to dest of sized name)
        const dest = path.join(publicUploads, rel);
        ensureDir(path.dirname(dest));
        if (!fs.existsSync(dest)) {
          fs.copyFileSync(path.join(imagesRoot, alt), dest);
          copied++;
          bytes += fs.statSync(dest).size;
          missing--;
          missingList.pop();
        }
      }
    }
  }
}

console.log(`Copied: ${copied}`);
console.log(`Missing: ${missing}`);
console.log(`Total size: ${(bytes / 1024 / 1024).toFixed(1)} MB → ${publicUploads}`);
if (missingList.length) {
  console.log("First missing:");
  missingList.slice(0, 20).forEach((m) => console.log("  ", m));
}
