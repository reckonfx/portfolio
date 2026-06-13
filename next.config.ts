import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdfkit"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "github.com" },
    ],
  },
  experimental: {
    optimizeCss: true,
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
