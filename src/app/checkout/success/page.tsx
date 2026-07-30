"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";

export default function CheckoutSuccessPage() {
  const { clear } = useCart();

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="shop-page cart-page">
      <header className="shop-hero">
        <span className="pill">Thank you</span>
        <h1>Payment received</h1>
        <p>
          Thanks for your order. You’ll get a receipt from Stripe by email. We’ll
          process and dispatch your items as soon as we can.
        </p>
        <div className="product-actions" style={{ marginTop: 20 }}>
          <Link className="btn btn-primary" href="/shop">
            Back to shop
          </Link>
          <Link className="btn btn-secondary" href="/">
            Home
          </Link>
        </div>
      </header>
    </div>
  );
}
