import "@/tailwind.css";
import {
  // getLocale,
  type Locale,
  assertIsLocale,
  baseLocale,
  overwriteGetLocale,
  overwriteGetUrlOrigin,
} from "@/paraglide/runtime.js";
import { headers } from "next/headers";
import { cache } from "react";

// export function generateStaticParams() {
//   return [{ locale: "en" }, { locale: "ja" }, { baseLocale: "en" }];
// }
const ssrLocale = cache(() => ({ locale: baseLocale, origin: "http://localhost:3000" }));

// overwrite the getLocale function to use the locale from the request
overwriteGetLocale(() => assertIsLocale(ssrLocale().locale));
overwriteGetUrlOrigin(() => ssrLocale().origin);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // @ts-expect-error - headers must be sync
  // https://github.com/opral/inlang-paraglide-js/issues/245#issuecomment-2608727658
  ssrLocale().locale = headers().get("x-paraglide-locale") as Locale;
  // @ts-expect-error - headers must be sync
  ssrLocale().origin = new URL(headers().get("x-paraglide-request-url")).origin;

  return (
    <html lang="ja" className="h-full" data-theme="light">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ut-bridge</title>
      </head>
      <body className="h-full">{children}</body>
    </html>
  );
}
