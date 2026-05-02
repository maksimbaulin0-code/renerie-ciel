import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/renerie-ciel",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
