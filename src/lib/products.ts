import fs from "fs";
import path from "path";

export type ProductCategory = {
  slug: string;
  name: string;
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  sku: string;
  price: number;
  salePrice: number | null;
  currency: string;
  categories: ProductCategory[];
  images: string[];
  description: string;
  bodyHtml: string;
  stockStatus: string;
};

export type CategorySummary = {
  slug: string;
  name: string;
  count: number;
};

function productsPath() {
  return path.join(process.cwd(), "content", "products.json");
}

function categoriesPath() {
  return path.join(process.cwd(), "content", "product-categories.json");
}

export function getProducts(): Product[] {
  return JSON.parse(fs.readFileSync(productsPath(), "utf8")) as Product[];
}

export function getProduct(slug: string): Product | null {
  return getProducts().find((p) => p.slug === slug) ?? null;
}

export function getCategories(): CategorySummary[] {
  return JSON.parse(
    fs.readFileSync(categoriesPath(), "utf8")
  ) as CategorySummary[];
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return getProducts().filter((p) =>
    p.categories.some((c) => c.slug === categorySlug)
  );
}

export function getCategory(slug: string): CategorySummary | null {
  return getCategories().find((c) => c.slug === slug) ?? null;
}

/** Price customers pay (sale if present). */
export function displayPrice(product: Product): number {
  if (product.salePrice != null && product.salePrice > 0) {
    return product.salePrice;
  }
  return product.price;
}

export function formatGBP(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
}
