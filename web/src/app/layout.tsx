import {
  type Locale,
  assertIsLocale,
  baseLocale,
  getLocale,
  overwriteGetLocale,
  overwriteGetUrlOrigin,
} from "@/paraglide/runtime.js";
import { headers } from "next/headers";
import { cache } from "react";

const ssrLocale = cache(() => ({ locale: baseLocale, origin: "http://localhost" }));

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ja" }];
}

// overwrite the getLocale function to use the locale from the request
overwriteGetLocale(() => assertIsLocale(ssrLocale().locale));
overwriteGetUrlOrigin(() => ssrLocale().origin);

export default async function Layout({ children }: { children: React.ReactElement }) {
  // @ts-expect-error - headers must be sync
  // https://github.com/opral/inlang-paraglide-js/issues/245#issuecomment-2608727658
  const localeHeader = headers().get("x-paraglide-locale");
  ssrLocale().locale = localeHeader as Locale;
  // @ts-expect-error - headers must be sync
  ssrLocale().origin = new URL(headers().get("x-paraglide-request-url")).origin;
  console.log("ssrLocale:", ssrLocale());

  return (
    <html lang={getLocale()} className="h-full" data-theme="light">
      {children}
    </html>
  );
}
