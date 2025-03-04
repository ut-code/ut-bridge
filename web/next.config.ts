import { paraglideWebpackPlugin } from "@inlang/paraglide-js";
import type { NextConfig } from "next";

const ssgPlugin = paraglideWebpackPlugin({
  outdir: "./src/paraglide",
  project: "./project.inlang",
  strategy: ["url"],
  urlPatterns: [
    {
      pattern: ":protocol://:domain(.*)::port?/:locale(ja|en|_next)?/:path(.*)?",
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
ssgPlugin;
const ssrPlugin = paraglideWebpackPlugin({
  outdir: "./src/paraglide",
  project: "./project.inlang",
  strategy: ["url"],
});

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.plugins.push(ssrPlugin);
    return config;
  },
  /* config options here */
};

export default nextConfig;
