import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Don’t fail Vercel production builds on ESLint errors; CI handles linting
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Don’t fail the production build on TS errors; CI runs type-check separately
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
