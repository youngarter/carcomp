import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Placeholder images (dev/demo)
      { protocol: "https", hostname: "picsum.photos" },
      // Icon API
      { protocol: "https", hostname: "api.iconify.design" },
      // Stock images
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "a.storyblok.com" },
      { protocol: "https", hostname: "www.sticarz.fr" },
      { protocol: "https", hostname: "logo.clearbit.com" },
      // Common CDNs / car images
      { protocol: "https", hostname: "**.cloudinary.com" },
      { protocol: "https", hostname: "**.amazonaws.com" },

      // Local development
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

export default nextConfig;
