import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton, CartBadge } from "@/components/ShopChrome";
import {
  displayPrice,
  formatGBP,
  getProduct,
  getProducts,
} from "@/lib/products";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.title,
    description: product.description || `${product.title} — RabbitCare shop`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const price = displayPrice(product);
  const mainImage = product.images[0];
  const gallery = product.images.slice(0, 6);

  return (
    <div className="shop-page product-page">
      <div className="product-topbar">
        <nav className="product-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>›</span>
          <Link href="/shop">Shop</Link>
          <span>›</span>
          <span>{product.title}</span>
        </nav>
        <CartBadge />
      </div>

      <div className="product-layout">
        <div className="product-gallery">
          {mainImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="product-main-image"
              src={mainImage}
              alt={product.title}
            />
          ) : (
            <div className="shop-card-placeholder product-main-image">🐇</div>
          )}
          {gallery.length > 1 && (
            <div className="product-thumbs">
              {gallery.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src} src={src} alt="" loading="lazy" />
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <span className="pill">RabbitCare shop</span>
          <h1>{product.title}</h1>
          <p className="product-price">
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
          {product.description && (
            <p className="product-desc">{product.description}</p>
          )}
          {product.categories.length > 0 && (
            <p className="product-cats">
              {product.categories.map((c) => (
                <Link key={c.slug} href={`/product-category/${c.slug}`}>
                  {c.name}
                </Link>
              ))}
            </p>
          )}

          <div className="product-actions">
            <AddToCartButton
              slug={product.slug}
              title={product.title}
              price={price}
              image={mainImage}
            />
            <Link className="btn btn-secondary" href="/cart">
              View cart
            </Link>
          </div>

          <p className="product-note">
            Free shipping on all orders. After you pay, we process and dispatch
            your order as soon as we can.
          </p>
        </div>
      </div>

      {product.bodyHtml && product.bodyHtml.length > 40 && (
        <section className="product-long-desc">
          <h2>About this product</h2>
          <div
            className="product-long-body"
            dangerouslySetInnerHTML={{ __html: product.bodyHtml }}
          />
        </section>
      )}
    </div>
  );
}
