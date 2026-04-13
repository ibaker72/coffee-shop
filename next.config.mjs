import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const appHostname = new URL(appUrl).host;

/** @type {import('next').NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", appHostname].filter(Boolean),
    },
  },
};

export default withNextIntl(config);
