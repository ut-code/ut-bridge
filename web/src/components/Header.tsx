"use client";
import { Link } from "@/i18n/navigation.ts";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { AppIcon } from "./AppIcon.tsx";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();

  // ロケールを考慮してパスを正規化する（/ja/login, /en/login → /login）
  const normalizedPathname = pathname.replace(/^\/(en|ja)\//, "/");

  return (
    <header className="flex h-16 w-full items-center bg-tBlue">
      <Link href="/community" passHref className="px-4">
        <AppIcon width={36} height={36} />
      </Link>
      <Link href="/community" className="cursor-pointer px-4 text-2xl text-white">
        UT-Bridge
      </Link>
      {normalizedPathname === "/login" || normalizedPathname === "/registration" ? (
        <></>
      ) : (
        <>
          <button
            type="button"
            className={`h-full cursor-pointer px-4 text-white text-xl transition-colors duration-200 ${
              normalizedPathname === "/community" ? "bg-focus" : "hover:bg-focus"
            }`}
            onClick={() => {
              router.push("/community");
            }}
          >
            {t("community.title")}
          </button>
          <button
            type="button"
            className={`h-full cursor-pointer px-4 text-white text-xl transition-colors duration-200 ${
              normalizedPathname === "/chat" ? "bg-focus" : "hover:bg-focus"
            }`}
            onClick={() => {
              router.push("/chat");
            }}
          >
            {t("chat.title")}
          </button>
          <button
            type="button"
            className={`h-full cursor-pointer px-4 text-white text-xl transition-colors duration-200 ${
              normalizedPathname.startsWith("/settings") ? "bg-focus" : "hover:bg-focus"
            }`}
            onClick={() => {
              router.push("/settings");
            }}
          >
            {t("setting.title")}
          </button>
        </>
      )}
    </header>
  );
}
