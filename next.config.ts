import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['cdn.sanity.io'],
    formats: ['image/avif', 'image/webp'], // AVIF first for better compression
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Add device sizes for better responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Loader config for cross-browser fallbacks
    loader: 'default',
    path: '/_next/image',
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
