import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/AI-POWERED-RESUME-ASSISTANCE',
  assetPrefix: '/AI-POWERED-RESUME-ASSISTANCE/',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
