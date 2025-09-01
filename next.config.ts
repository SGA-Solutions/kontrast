import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['cdn.sanity.io'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    optimizePackageImports: ['@sanity/client', '@portabletext/react'],
  },
  // Enable static generation optimizations
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  // Optimize bundle
  swcMinify: true,
};

export default nextConfig;
