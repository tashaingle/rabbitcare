import fs from "fs";

for (const f of ["content/chrome/header.html", "content/chrome/footer.html"]) {
  const lines = fs.readFileSync(f, "utf8").split(/\n/);
  console.log("===", f);
  lines.forEach((line, i) => {
    if (/content:\s*"/.test(line)) {
      console.log(i + 1 + ":", line.trim());
      console.log("   prev:", (lines[i - 1] || "").trim());
    }
    if (/2026 RabbitCare|©/.test(line)) {
      console.log("copy", i + 1, line.trim());
    }
  });
}
