import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing.ts";

const middleware = createMiddleware(routing);

export default function handler(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  // 設定したロケール（例: 'en', 'ja'）
  const locales = routing.locales;
  const defaultLocale = routing.defaultLocale || "ja"; // デフォルトロケールを設定

  // 既にロケールがある場合はそのまま処理
  if (locales.some((locale) => pathname.startsWith(`/${locale}/`))) {
    return middleware(req);
  }

  // ルートがロケールなしの場合、デフォルトロケールへリダイレクト
  const redirectUrl = new URL(`/${defaultLocale}${pathname}`, req.url);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"], // 静的ファイルやNext.jsの内部ルートを除外
};
