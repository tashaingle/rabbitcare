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

## Shop later

WooCommerce does not run on Vercel. When you want the shop back, common options:

- **Shopify** storefront + product links
- **Stripe** checkout with a small product catalogue
- **Snipcart** / similar

## Tech

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
