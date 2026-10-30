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
      // WooCommerce basket page, linked from the WordPress menu
      { source: "/basket", destination: "/cart/", permanent: true },
    ];
  },
};

export default nextConfig;
