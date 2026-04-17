import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/fleet",
        destination: "/marketplace",
        permanent: true,
      },
      {
        source: "/fleet/:slug",
        destination: "/marketplace/:slug",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [new URL("https://thula.africa/**")],
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
