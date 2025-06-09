import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    useCache: true,
  },
  reactStrictMode: false, // ໃຫ້ເຮັດວຽກເທື່ອດຽວ
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      {
        protocol: "https",
        hostname: "promptpay.io",
      },
    ],
  },
};

export default nextConfig;
