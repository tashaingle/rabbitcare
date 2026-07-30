"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

export function CartBadge() {
  const { count } = useCart();
  return (
    <Link href="/cart" className="shop-cart-badge" aria-label={`Cart, ${count} items`}>
      🛒 Cart{count > 0 ? ` (${count})` : ""}
    </Link>
  );
}

export function AddToCartButton({
  slug,
  title,
  price,
  image,
}: {
  slug: string;
  title: string;
  price: number;
  image?: string;
}) {
  const { addItem } = useCart();
  return (
    <button
      type="button"
      className="btn btn-primary shop-add-btn"
      onClick={() => addItem({ slug, title, price, image }, 1)}
    >
      Add to cart
    </button>
  );
}
