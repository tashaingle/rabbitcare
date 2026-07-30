/**
 * Compress images under public/wp-content/uploads for Vercel deploy size.
 * Keeps original filenames (including .png/.jpeg) so HTML paths still work.
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..", "public", "wp-content", "uploads");
const MAX_EDGE = 1600;
const JPEG_QUALITY = 78;
const PNG_QUALITY = 80;
const WEBP_QUALITY = 78;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const files = walk(root).filter((f) =>
  /\.(png|jpe?g|webp|avif)$/i.test(f)
);

let saved = 0;
let before = 0;
let after = 0;

for (const file of files) {
  const input = fs.readFileSync(file);
  before += input.length;
  const ext = path.extname(file).toLowerCase();
  let pipeline = sharp(input, { failOn: "none" }).rotate();
  const meta = await pipeline.metadata();
  if ((meta.width || 0) > MAX_EDGE || (meta.height || 0) > MAX_EDGE) {
    pipeline = pipeline.resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  let buf;
  try {
    if (ext === ".png") {
      buf = await pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9, palette: true }).toBuffer();
      // if palette made it larger, try non-palette
      if (buf.length >= input.length * 0.95) {
        buf = await sharp(input, { failOn: "none" })
          .rotate()
          .resize({
            width: MAX_EDGE,
            height: MAX_EDGE,
            fit: "inside",
            withoutEnlargement: true,
          })
          .png({ compressionLevel: 9 })
          .toBuffer();
      }
    } else if (ext === ".webp") {
      buf = await pipeline.webp({ quality: WEBP_QUALITY }).toBuffer();
    } else if (ext === ".avif") {
      buf = await pipeline.avif({ quality: 55 }).toBuffer();
    } else {
      buf = await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
    }

    if (buf.length < input.length) {
      fs.writeFileSync(file, buf);
      saved += input.length - buf.length;
      after += buf.length;
    } else {
      after += input.length;
    }
  } catch (e) {
    console.warn("skip", path.basename(file), e.message);
    after += input.length;
  }
}

console.log(
  `Optimized ${files.length} files: ${(before / 1024 / 1024).toFixed(1)}MB → ${(after / 1024 / 1024).toFixed(1)}MB (saved ${(saved / 1024 / 1024).toFixed(1)}MB)`
);
