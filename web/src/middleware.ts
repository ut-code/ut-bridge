import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing.ts";

let WEB_ORIGIN = process.env.NEXT_PUBLIC_WEB_ORIGIN ?? null;
if (WEB_ORIGIN === "null") {
  WEB_ORIGIN = null;
}
const WEB_HOST = WEB_ORIGIN ? new URL(WEB_ORIGIN).host : null; // null on staging environment

const middleware = createMiddleware(routing);

export default function handler(req: NextRequest) {
  const { nextUrl, headers } = req;
  const pathname = nextUrl.pathname;
  const host = headers.get("host") || "";

  // Redirect to WEB_HOST if using another host && it's not staging environment
  if (WEB_HOST && host !== WEB_HOST) {
    const targetUrl = new URL(nextUrl);
    targetUrl.host = WEB_HOST;
    // Preserve HTTP/HTTPS protocol
    targetUrl.protocol = nextUrl.protocol;
    return NextResponse.redirect(targetUrl);
  }

  // 設定したロケール（例: 'en', 'ja'）
  const locales = routing.locales;
  const defaultLocale = routing.defaultLocale || "ja"; // デフォルトロケール

  // next-intl の middleware を適用
  const response = middleware(req);
  if (response) return response;

  // 既にロケールが含まれている場合はそのまま処理
  if (locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))) {
    return NextResponse.next();
  }

  // `/` にアクセスした場合は `/ja` にリダイレクト
  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, req.url));
  }

  // ロケールなしのルートをデフォルトロケールへリダイレクト
  return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, req.url));
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"], // 静的ファイルやNext.jsの内部ルートを除外
};
