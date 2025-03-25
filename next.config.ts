import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  
  eslint: {
    ignoreDuringBuilds: true, // Ignores all ESLint errors during build
  },
  serverExternalPackages: ["@prisma/client", "prisma"],
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Content-Security-Policy",
          value: "script-src 'self' 'unsafe-inline'; object-src 'none';",
        },
      ],
    },
  ],
};

export default nextConfig;
