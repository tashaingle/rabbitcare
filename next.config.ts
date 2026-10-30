import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Match WordPress URLs (/rabbit-health/), so existing links and SEO keep working.
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rabbitcare.co.uk",
        pathname: "/wp-content/**",
      },
    ],
  },
  async redirects() {
    return [
      // The shop is closed for now: send old shop links to the homepage.
      // Temporary (307) so search engines don't forget them when it reopens.
      ...["/shop", "/basket", "/cart", "/checkout", "/my-account"].map((source) => ({
        source,
        destination: "/",
        permanent: false,
      })),
      { source: "/shop/:path*", destination: "/", permanent: false },
      { source: "/product/:path*", destination: "/", permanent: false },
      { source: "/product-category/:path*", destination: "/", permanent: false },
      // Sitemaps from WordPress (Rank Math) that Search Console may still check.
      ...["sitemap_index", "page-sitemap", "post-sitemap", "product-sitemap", "product_cat-sitemap", "wp-sitemap"].map(
        (name) => ({ source: `/${name}.xml`, destination: "/sitemap.xml", permanent: true })
      ),
    ];
  },
};

export default nextConfig;
