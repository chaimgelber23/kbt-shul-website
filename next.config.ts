import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve AVIF first (smaller than webp) for every next/image, with webp fallback.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
