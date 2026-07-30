/**
 * Fix mojibake (encoding corruption) in WordPress header/footer HTML.
 * e.g. "â€"" → "—", "Â©" → "©", broken dropdown glyphs → clean CSS escapes.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const files = [
  path.join(root, "content/chrome/header.html"),
  path.join(root, "content/chrome/footer.html"),
];

const replacements = [
  // Common UTF-8 misread as Windows-1252 / Latin-1
  ["â€”", "\u2014"], // —
  ["â€“", "\u2013"], // –
  ["â€˜", "\u2018"],
  ["â€™", "\u2019"],
  ["â€œ", "\u201C"],
  ["â€", "\u201D"],
  ["â€¢", "\u2022"],
  ["â€º", "\u203A"], // ›
  ["â€¹", "\u2039"], // ‹
  ["Â©", "\u00A9"], // ©
  ["Â®", "\u00AE"],
  ["Â ", " "],
  ["Â", ""],
  // Broken box-drawing used in comments
  ["â”€", "\u2500"],
  ["â”", ""],
  // Broken caret seen as âŒ„
  ["âŒ„", ""],
  // leftover fragments
  ["âŒ", ""],
  ["â", ""],
];

for (const file of files) {
  let t = fs.readFileSync(file, "utf8");
  const before = t;

  for (const [from, to] of replacements) {
    t = t.split(from).join(to);
  }

  // Force a reliable dropdown caret (CSS unicode escape for ▾ U+25BE)
  t = t.replace(
    /(\.rc-header-dropdown-label::after\s*\{[\s\S]*?content:\s*)"[^"]*"/,
    '$1"\\25BE"'
  );

  // Footer detail arrows / chevrons if content was emptied
  t = t.replace(
    /(\.rc-footer[^{]*::(before|after)\s*\{[\s\S]*?content:\s*)""/,
    '$1"\\203A"'
  );

  // Clean comment separators that became garbage
  t = t.replace(/\/\*\s*[\u2500\-]+\s*/g, "/* ");
  t = t.replace(/\s*[\u2500\-]+\s*\*\//g, " */");

  fs.writeFileSync(file, t, "utf8");
  console.log(path.basename(file), before === t ? "unchanged" : "fixed");

  // Report remaining suspicious sequences
  const lines = t.split(/\n/);
  lines.forEach((line, i) => {
    if (/â|Ã|Â|Œ|€/.test(line)) {
      console.log("  still odd L" + (i + 1) + ":", JSON.stringify(line.trim().slice(0, 100)));
    }
  });
  lines.forEach((line, i) => {
    if (/content:\s*"/.test(line)) {
      console.log("  content L" + (i + 1) + ":", line.trim());
    }
  });
}
