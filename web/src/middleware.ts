import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing.ts";

const middleware = createMiddleware(routing);

export default function handler(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

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
