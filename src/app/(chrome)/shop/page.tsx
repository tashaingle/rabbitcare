import type { Metadata } from "next";
import Link from "next/link";
import { CartBadge } from "@/components/ShopChrome";
import {
  displayPrice,
  formatGBP,
  getCategories,
  getProducts,
} from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Rabbit toys, hay bags, grooming, bedding and enrichment from RabbitCare.co.uk.",
};

export default function ShopPage() {
  const products = getProducts();
  const categories = getCategories();

  return (
    <div className="shop-page">
      <header className="shop-hero">
        <div className="shop-hero-top">
          <div>
            <span className="pill">RabbitCare shop</span>
            <h1>Shop rabbit essentials</h1>
            <p>
              Practical accessories for enrichment, feeding, grooming and more.
              Free shipping on all orders.
            </p>
          </div>
          <CartBadge />
        </div>

        <nav className="shop-cat-nav" aria-label="Shop categories">
          <Link href="/shop" className="is-active">
            All ({products.length})
          </Link>
          {categories.map((c) => (
            <Link key={c.slug} href={`/product-category/${c.slug}`}>
              {c.name} ({c.count})
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
                <p className="shop-card-price">
                  {product.salePrice != null && product.salePrice > 0 ? (
                    <>
                      <span className="shop-price-sale">{formatGBP(price)}</span>
                      <span className="shop-price-was">
                        {formatGBP(product.price)}
                      </span>
                    </>
                  ) : (
                    formatGBP(price)
                  )}
                </p>
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
