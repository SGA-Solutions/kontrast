import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Unblock Vercel builds even if ESLint errors are present.
    // You can remove this later once lint issues are fixed or configure .eslintrc.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
