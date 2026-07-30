import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const products = JSON.parse(
  fs.readFileSync(path.join(root, "content/products.json"), "utf8")
);
const imagesRoot = path.resolve(root, "..", "Images");
const publicRoot = path.join(root, "public", "wp-content", "uploads");

const refs = new Set();
for (const p of products) {
  for (const img of p.images) {
    const m = img.match(/\/wp-content\/uploads\/(.+)/);
    if (m) refs.add(m[1]);
  }
}

let copied = 0;
let missing = 0;
let existed = 0;
const missingList = [];

for (const rel of refs) {
  const dest = path.join(publicRoot, rel);
  if (fs.existsSync(dest)) {
    existed++;
    continue;
  }
  const src = path.join(imagesRoot, rel);
  if (!fs.existsSync(src)) {
    missing++;
    missingList.push(rel);
    continue;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  copied++;
}

console.log({ refs: refs.size, existed, copied, missing });
if (missingList.length) console.log(missingList.slice(0, 20));
