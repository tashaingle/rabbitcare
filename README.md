# RabbitCare.co.uk — Next.js (GitHub + Vercel)

Content-first rebuild of [rabbitcare.co.uk](https://rabbitcare.co.uk) from a WordPress export.  
**Shop / cart / checkout are not included yet** — care guides and tools only.

## What’s in this project

| Path | Purpose |
|------|---------|
| `content/pages/*.json` | Pages extracted from the WordPress WXR export |
| `content/foods.json` | Food-checker data (51 foods) |
| `content/index.json` | Page index for navigation / SSG |
| `scripts/extract-content.mjs` | Re-import from a fresh WordPress export |
| `src/app` | Next.js App Router site |

## Local development

```bash
cd website
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm start       # run production server
```

### Re-import from WordPress

If you export WordPress again (Tools → Export → All content):

```bash
node scripts/extract-content.mjs "C:\path\to\your-export.xml"
```

By default it looks for `../rabbitcare.WordPress.2026-07-30.xml` next to the `website` folder.

## Deploy to GitHub + Vercel

### 1. Push to GitHub

1. Create a new empty repository on GitHub (e.g. `rabbitcare`).
2. From this `website` folder:

```bash
git add .
git commit -m "Initial RabbitCare Next.js site from WordPress export"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/rabbitcare.git
git push -u origin main
```

> Tip: deploy the **`website`** folder as the repo root (recommended), or set Vercel’s **Root Directory** to `website` if the monorepo parent is the git root.

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**.
2. Import your GitHub repo.
3. Framework preset: **Next.js** (auto-detected).
4. Click **Deploy**.

### 3. Custom domain (rabbitcare.co.uk)

1. In Vercel → Project → **Settings → Domains** → add `rabbitcare.co.uk` and `www.rabbitcare.co.uk`.
2. At your domain registrar / DNS host, add the records Vercel shows (usually an `A` record and/or `CNAME`).
3. When DNS propagates, switch traffic from WordPress hosting to Vercel.
4. Keep the old WordPress site online temporarily so **images** still load from  
   `https://rabbitcare.co.uk/wp-content/...`  
   until you copy media into this project (or a CDN).

## Images note

Article images currently load from the **live WordPress uploads URL**. That works while the old host is up. For a permanent cutover:

1. Download `/wp-content/uploads/` from your host, or
2. Use a plugin/export of media, then put files under `public/uploads/` and re-run a URL rewrite.

## Shop (Stripe checkout)

The shop is rebuilt on this site from your WooCommerce export:

- `/shop` — all products  
- `/product/[slug]` — product page + add to cart  
- `/product-category/[slug]` — category pages  
- `/cart` — cart + **Pay with Stripe**

### Enable payments

1. Create a [Stripe](https://stripe.com) account (UK).
2. Copy a **Secret key** from Developers → API keys.
   - Prefer a normal account key: `sk_test_...` or `sk_live_...`
   - If you only have an **organization** key (`sk_org_...`), also add your account id as `STRIPE_CONTEXT` / `STRIPE_ACCOUNT_ID` (`acct_...` — shown in Stripe Dashboard → Settings → Account details).
3. In **Vercel** → Project → Settings → Environment Variables:
   - `STRIPE_SECRET_KEY` = your secret key
   - `NEXT_PUBLIC_SITE_URL` = your live site URL (e.g. `https://rabbitcare-oaaa.vercel.app`)
   - `STRIPE_CONTEXT` = `acct_...` only if using `sk_org_...`
4. Redeploy (env vars only apply after a new deployment).

Until `STRIPE_SECRET_KEY` is set, browsing and cart work, but checkout shows a setup message.

### AliExpress fulfilment

Customers pay you via Stripe. You still place the order on AliExpress yourself (or later automate). Stripe emails you payment receipts; check the Dashboard → Payments for shipping addresses.

## Tech

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
