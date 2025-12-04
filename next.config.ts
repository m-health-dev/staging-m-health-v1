import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/std",
        destination: "/studio",
        permanent: true,
      },
    ];
  },
  allowedDevOrigins: ["192.168.18.252", "*.m-health.id"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "hoocfkzapbmnldwmedrq.supabase.co",
      },
      {
        protocol: "https",
        hostname: "irtyvkfjzojdkmtnstmd.supabase.co",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  experimental: {
    globalNotFound: true,
  },
};

const withNextIntl = createNextIntlPlugin();
export default withBotId(withNextIntl(nextConfig));
