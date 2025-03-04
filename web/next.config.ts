// import { paraglideWebpackPlugin } from "@inlang/paraglide-js";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // webpack: (config) => {
  //   config.plugins.push(
  //     paraglideWebpackPlugin({
  //       outdir: "./src/paraglide",
  //       project: "./project.inlang",
  //       strategy: ["url"],
  //       urlPatterns: [
  //         {
  //           pattern: ":protocol://:domain(.*)::port?/:locale(ja|en|_next)?/:path(.*)?",
  //           deLocalizedNamedGroups: {
  //             locale: "en",
  //           },
  //           localizedNamedGroups: {
  //             ja: { locale: "ja" },
  //             en: { locale: "en" },
  //           },
  //         },
  //       ],
  //     }),
  //   );
  //   return config;
  // },
  /* config options here */
};

export default nextConfig;
