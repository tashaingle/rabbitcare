import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rabbitcare.co.uk",
        pathname: "/wp-content/**",
      },
    ],
  },
};

export default nextConfig;
