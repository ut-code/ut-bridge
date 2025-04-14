import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["ut-bridge-user-image.utcode.net"],
  },
  /* config options here */
};
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
