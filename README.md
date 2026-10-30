# RabbitCare.co.uk — Next.js (GitHub + Vercel)

Next.js copy of [rabbitcare.co.uk](https://rabbitcare.co.uk) that looks exactly like the WordPress site.  
**The shop is switched off for now** — shop links redirect to the homepage.

## What’s in this project

| Path | Purpose |
|------|---------|
| `content/live/*.json` | Pages mirrored from the live site (HTML + per-page CSS) |
| `public/wp/site.css` | WordPress theme + block styles |
| `scripts/sync-live.mjs` | Re-mirror the live site (design, pages, images) |
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

### Update from WordPress

After editing pages in WordPress, mirror them again (also removes shop links):

```bash
node scripts/sync-live.mjs
```

### Re-import from a WordPress export

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

## Images note

Images, fonts and theme files used by the pages are copied into `public/wp-content/` by `scripts/sync-live.mjs`, so the site does not depend on the WordPress host.

## Tech

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
