import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CartBadge } from "@/components/ShopChrome";
import {
  displayPrice,
  formatGBP,
  getCategories,
  getCategory,
  getProductsByCategory,
} from "@/lib/products";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) return {};
  return {
    title: cat.name,
    description: `Shop ${cat.name} for rabbits at RabbitCare.co.uk.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();
  const products = getProductsByCategory(slug);
  const categories = getCategories();

  return (
    <div className="shop-page">
      <header className="shop-hero">
        <div className="shop-hero-top">
          <div>
            <span className="pill">Shop category</span>
            <h1>{cat.name}</h1>
            <p>{cat.count} products in this category.</p>
          </div>
          <CartBadge />
        </div>
        <nav className="shop-cat-nav" aria-label="Shop categories">
          <Link href="/shop">All</Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/product-category/${c.slug}`}
              className={c.slug === slug ? "is-active" : undefined}
            >
              {c.name}
            </Link>
          ))}
        </nav>
      </header>

      <div className="shop-grid">
        {products.map((product) => {
          const price = displayPrice(product);
          const image = product.images[0];
          return (
            <article key={product.slug} className="shop-card">
              <Link href={`/product/${product.slug}`} className="shop-card-media">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image} alt={product.title} loading="lazy" />
                ) : (
                  <div className="shop-card-placeholder">🐇</div>
                )}
              </Link>
              <div className="shop-card-body">
                <h2>
                  <Link href={`/product/${product.slug}`}>{product.title}</Link>
                </h2>
                <p className="shop-card-price">{formatGBP(price)}</p>
                <Link className="shop-card-link" href={`/product/${product.slug}`}>
                  View product →
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
