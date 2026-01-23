import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withBotId } from "botid/next/config";

const isDev = process.env.NODE_ENV === "development";

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' ${isDev ? " 'unsafe-eval'" : ""}
      https://challenges.cloudflare.com
      https://www.googletagmanager.com
      https://www.google-analytics.com
      https://va.vercel-scripts.com
      https://accounts.google.com
      https://static.cloudflareinsights.com
      https://www.googletagmanager.com
      https://cdn.userway.org
      https://accounts.google.com
      https://api.userway.org;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data:
      https://images.unsplash.com
      https://unsplash.com
      https://placehold.co
      https://lh3.googleusercontent.com
      https://avatars.githubusercontent.com
      https://*.supabase.co
      https://cdn.userway.org
      https://accounts.google.com
      https://api.userway.org;
    font-src 'self' https://fonts.gstatic.com data:;
    connect-src 'self'
      https://*.m-health.id
      https://*.supabase.co
      wss://*.supabase.co
      https://www.google-analytics.com
      https://www.googletagmanager.com
      https://va.vercel-scripts.com
      https://accounts.google.com
      https://challenges.cloudflare.com
      https://cdn.userway.org
      https://accounts.google.com
      https://api.userway.org;
    frame-src https://challenges.cloudflare.com https://www.google.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self';
    upgrade-insecure-requests;
  `;

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/std",
        destination: "/studio",
        permanent: true,
      },
    ];
  },
  allowedDevOrigins: [
    "192.168.18.252",
    "192.168.18.253",
    "0.0.0.0:2026",
    "192.168.18.34:3030",
    "*.m-health.id",
  ],
  images: {
    // dangerouslyAllowLocalIP: true,
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
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "irtyvkfjzojdkmtnstmd.supabase.co",
        pathname: "/**",
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
  // cacheComponents: true,
};

const withNextIntl = createNextIntlPlugin();
export default withBotId(withNextIntl(nextConfig));
