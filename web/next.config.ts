import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["ut-bridge.c692d351b94b9f1f32c04143499cba82.r2.cloudflarestorage.com"],
  },
  /* config options here */
};
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
