import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // 启用 React Server Actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;