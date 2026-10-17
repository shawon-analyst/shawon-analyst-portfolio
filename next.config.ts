import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 768, 1024, 1200, 1600, 1920],
  },
  async headers() {
    return [
      {
        source: "/Md-Idris-Resume.pdf",
        headers: [
          {
            key: "Content-Disposition",
            value: 'inline; filename="Md-Idris-Resume.pdf"',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
