import fs from "fs";
import path from "path";

const xmlPath = path.resolve("..", "rabbitcare.WordPress.2026-07-30.xml");
const c = fs.readFileSync(xmlPath, "utf8");
const items = c.match(/<item>[\s\S]*?<\/item>/g) || [];

const products = [];
let variations = 0;

for (const item of items) {
  const type = (item.match(/<wp:post_type><!\[CDATA\[([^\]]+)\]\]><\/wp:post_type>/) || [])[1];
  const status = (item.match(/<wp:status><!\[CDATA\[([^\]]+)\]\]><\/wp:status>/) || [])[1];
  if (type === "product_variation" && status === "publish") variations++;
  if (type !== "product" || status !== "publish") continue;

  const title =
    (item.match(/<title><!\[CDATA\[([^\]]*)\]\]><\/title>/) ||
      item.match(/<title>([^<]*)<\/title>/) ||
      [])[1] || "";
  const slug =
    (item.match(/<wp:post_name><!\[CDATA\[([^\]]*)\]\]><\/wp:post_name>/) ||
      [])[1] || "";

  const meta = {};
  const metas = [
    ...item.matchAll(
      /<wp:meta_key><!\[CDATA\[([^\]]+)\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[([\s\S]*?)\]\]><\/wp:meta_value>/g
    ),
  ];
  for (const m of metas) meta[m[1]] = m[2];

  // image urls in content
  const imgs = [
    ...item.matchAll(/https?:\/\/rabbitcare\.co\.uk\/wp-content\/uploads\/[^"'<\s]+/g),
  ].map((m) => m[0]);

  products.push({
    title,
    slug,
    price: meta._regular_price || meta._price || "",
    sale: meta._sale_price || "",
    sku: meta._sku || "",
    type: meta._product_type || "",
    images: [...new Set(imgs)].slice(0, 3),
  });
}

console.log("published products:", products.length);
console.log("published variations:", variations);
console.log("with prices:", products.filter((p) => p.price).length);
console.log("sample:");
console.log(JSON.stringify(products.slice(0, 10), null, 2));
