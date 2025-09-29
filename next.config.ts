import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed i18n config as it's handled differently in App Router
  images: {
    domains: ['localhost'],
  }
};

export default nextConfig;
