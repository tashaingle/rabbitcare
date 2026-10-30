/**
 * Optimise the new homepage media from "../New Images" into public/home/.
 *
 * Usage: node scripts/build-home-assets.mjs
 * Needs ffmpeg on PATH for the videos.
 */
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const src = path.resolve(root, "..", "New Images");
const out = path.join(root, "public", "home");

// Clean cut-outs only (others still have white backgrounds or halos).
const CUTOUTS = {
  "3": "magpie-lop",
  "4": "honey-lop",
  "5": "wild-ears",
  "10": "lionhead",
  "11": "cream-lop",
  "12": "silver-lop",
  "14": "grey-chatter",
  "15": "ginger-lop",
  "16": "fawn-lop",
  "17": "snow-lop",
  "18": "soot",
  "20": "dalmatian",
  "22": "panda",
  "Untitled design": "big-lop",
  "Untitled design1": "agouti",
};

const HEROS = { "19": "meadow", "10": "pair", "17": "duo", "20": "snow" };

// [source, name, start seconds, duration]
const VIDEOS = [
  ["download1", "dawn-grass", 0, 9],
  ["download3", "hand-feed", 0, 8],
  ["download4", "log-rest", 2, 10],
  ["download", "dusk-group", 4, 10],
  ["download2", "night-veg", 0, 6],
  ["download6", "tray", 6, 10],
];

fs.mkdirSync(path.join(out, "cutouts"), { recursive: true });
fs.mkdirSync(path.join(out, "photos"), { recursive: true });
fs.mkdirSync(path.join(out, "video"), { recursive: true });

const manifest = {};
for (const [file, name] of Object.entries(CUTOUTS)) {
  const img = sharp(path.join(src, `${file}.png`)).trim({ threshold: 1 });
  const buf = await img
    .resize({ height: 720, withoutEnlargement: true })
    .webp({ quality: 80, alphaQuality: 90 })
    .toBuffer({ resolveWithObject: true });
  fs.writeFileSync(path.join(out, "cutouts", `${name}.webp`), buf.data);
  manifest[name] = { w: buf.info.width, h: buf.info.height };
  console.log("cutout", name, buf.info.width, "x", buf.info.height, Math.round(buf.data.length / 1024) + "K");
}
fs.writeFileSync(path.join(out, "cutouts", "manifest.json"), JSON.stringify(manifest, null, 1));

for (const [file, name] of Object.entries(HEROS)) {
  for (const w of [1920, 960]) {
    const dest = path.join(out, "photos", `${name}-${w}.webp`);
    await sharp(path.join(src, "Heros", `${file}.png`)).resize({ width: w }).webp({ quality: 74 }).toFile(dest);
    console.log("photo", name, w, Math.round(fs.statSync(dest).size / 1024) + "K");
  }
}

for (const [file, name, start, dur] of VIDEOS) {
  const input = path.join(src, "Videos", `${file}.mp4`);
  const mp4 = path.join(out, "video", `${name}.mp4`);
  execFileSync("ffmpeg", [
    "-v", "error", "-y", "-ss", String(start), "-t", String(dur), "-i", input,
    "-an", "-vf", "scale=960:-2,fps=30", "-c:v", "libx264", "-preset", "slow",
    "-crf", "29", "-pix_fmt", "yuv420p", "-movflags", "+faststart", mp4,
  ]);
  execFileSync("ffmpeg", [
    "-v", "error", "-y", "-ss", String(start + 0.5), "-i", input, "-frames:v", "1",
    "-vf", "scale=960:-2", "-q:v", "4", path.join(out, "video", `${name}.jpg`),
  ]);
  console.log("video", name, Math.round(fs.statSync(mp4).size / 1024) + "K");
}
