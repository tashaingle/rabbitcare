"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";

function formatGBP(amount: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
}

export default function CartPage() {
  const { lines, subtotal, setQuantity, removeItem, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({
            slug: l.slug,
            quantity: l.quantity,
          })),
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Checkout failed");
      }
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
      setLoading(false);
    }
  }

  return (
    <div className="shop-page cart-page">
      <header className="shop-hero">
        <span className="pill">Your basket</span>
        <h1>Cart</h1>
        <p>
          <Link href="/shop">← Continue shopping</Link>
        </p>
      </header>

      {lines.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <Link className="btn btn-primary" href="/shop">
            Browse the shop
          </Link>
        </div>
      ) : (
        <>
          <ul className="cart-lines">
            {lines.map((line) => (
              <li key={line.slug} className="cart-line">
                <Link href={`/product/${line.slug}`} className="cart-line-media">
                  {line.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={line.image} alt="" />
                  ) : (
                    <div className="shop-card-placeholder">🐇</div>
                  )}
                </Link>
                <div className="cart-line-info">
                  <h2>
                    <Link href={`/product/${line.slug}`}>{line.title}</Link>
                  </h2>
                  <p>{formatGBP(line.price)} each</p>
                  <div className="cart-line-qty">
                    <label>
                      Qty{" "}
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={line.quantity}
                        onChange={(e) =>
                          setQuantity(line.slug, Number(e.target.value) || 1)
                        }
                      />
                    </label>
                    <button
                      type="button"
                      className="cart-remove"
                      onClick={() => removeItem(line.slug)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="cart-line-total">
                  {formatGBP(line.price * line.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <p>
              Subtotal <strong>{formatGBP(subtotal)}</strong>
            </p>
            <p className="cart-shipping-note">Shipping calculated at checkout (free UK shipping).</p>
            {error && <p className="cart-error">{error}</p>}
            <div className="product-actions">
              <button
                type="button"
                className="btn btn-primary"
                disabled={loading}
                onClick={checkout}
              >
                {loading ? "Redirecting…" : "Pay securely with Stripe"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={clear}>
                Clear cart
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
