import { paraglideWebpackPlugin } from "@inlang/paraglide-js";
import type { NextConfig } from "next";

const ssgPlugin = paraglideWebpackPlugin({
  outdir: "./src/paraglide",
  project: "./project.inlang",
  strategy: ["url", "cookie", "preferredLanguage", "baseLocale"],
  urlPatterns: [
    {
      pattern: ":protocol://:domain(.*)::port?/:locale(ja|en)?/:path(.*)?",
      deLocalizedNamedGroups: {
        locale: "en",
      },
      localizedNamedGroups: {
        ja: { locale: "ja" },
        en: { locale: "en" },
      },
    },
  ],
});

const ssrPlugin = paraglideWebpackPlugin({
  outdir: "./src/paraglide",
  project: "./project.inlang",
  strategy: ["url", "cookie", "preferredLanguage", "baseLocale"],
});

ssgPlugin;
ssrPlugin;

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.plugins.push(ssgPlugin);
    return config;
  },
  /* config options here */
};

export default nextConfig;
