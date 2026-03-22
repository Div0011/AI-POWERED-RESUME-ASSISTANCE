import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: isProd ? 'export' : undefined,
  basePath: isProd ? '/AI-POWERED-RESUME-ASSISTANCE' : undefined,
  assetPrefix: isProd ? '/AI-POWERED-RESUME-ASSISTANCE/' : undefined,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    // pdf.js requires 'canvas' on Node.js but not in browser
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  turbopack: {
    resolveAlias: {
      canvas: { browser: '' },
      encoding: { browser: '' },
    },
  },
};

export default nextConfig;
