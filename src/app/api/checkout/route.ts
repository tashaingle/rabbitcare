import { NextResponse } from "next/server";
import Stripe from "stripe";
import { displayPrice, getProduct } from "@/lib/products";

export const runtime = "nodejs";

type BodyItem = { slug: string; quantity: number };

export async function POST(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      {
        error:
          "Payments are not set up yet. Add STRIPE_SECRET_KEY in Vercel environment variables.",
      },
      { status: 503 }
    );
  }

  let body: { items?: BodyItem[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const items = body.items || [];
  if (!items.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  for (const item of items) {
    const product = getProduct(item.slug);
    if (!product) {
      return NextResponse.json(
        { error: `Unknown product: ${item.slug}` },
        { status: 400 }
      );
    }
    const qty = Math.min(20, Math.max(1, Math.floor(item.quantity || 1)));
    const unitAmount = Math.round(displayPrice(product) * 100);
    if (unitAmount <= 0) {
      return NextResponse.json(
        { error: `Invalid price for ${product.title}` },
        { status: 400 }
      );
    }

    line_items.push({
      quantity: qty,
      price_data: {
        currency: "gbp",
        unit_amount: unitAmount,
        product_data: {
          name: product.title,
          images: product.images[0]
            ? [
                product.images[0].startsWith("http")
                  ? product.images[0]
                  : `${process.env.NEXT_PUBLIC_SITE_URL || "https://rabbitcare-oaaa.vercel.app"}${product.images[0]}`,
              ]
            : undefined,
          metadata: {
            slug: product.slug,
            sku: product.sku || "",
          },
        },
      },
    });
  }

  const stripe = new Stripe(secret);
  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      shipping_address_collection: {
        allowed_countries: ["GB"],
      },
      phone_number_collection: { enabled: true },
      metadata: {
        source: "rabbitcare-nextjs",
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Stripe error";
    console.error("Stripe checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
