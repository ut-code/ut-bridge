"use client";
import { useGoogleLogout } from "@/features/auth/functions/logout.ts";
import { Link } from "@/i18n/navigation.ts";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function SideNav() {
  const { logout } = useGoogleLogout();
  const path = usePathname();
  const t = useTranslations("setting");
  // ロケールを考慮してパスを正規化する（/ja/login, /en/login → /login）
  const pathname = path.replace(/^\/(en|ja)\//, "/");

  return (
    <>
      <h1 className="hidden font-bold text-3xl sm:block">{t("title")}</h1>
      <div className="m-5 flex flex-col gap-0.5 border-gray-300 sm:block sm:gap-0 sm:border-r">
        <Link
          href={"/settings/basic"}
          className={`flex items-center justify-between rounded-t-xl bg-neutral-50 p-3 px-8 text-gray-800 text-md sm:bg-transparent sm:p-4 sm:text-xl ${pathname === "/settings/basic" ? "font-bold underline" : ""}`}
        >
          {t("basic.title")}
          <ChevronRight className="sm:hidden" />
        </Link>
        <Link
          href={"/settings/university"}
          className={`flex items-center justify-between bg-neutral-50 p-3 px-8 text-gray-800 text-md sm:bg-transparent sm:p-4 sm:text-xl ${pathname === "/settings/university" ? "font-bold underline" : ""}`}
        >
          {t("university.title")}
          <ChevronRight className="sm:hidden" />
        </Link>
        <Link
          href={"/settings/language"}
          className={`flex items-center justify-between bg-neutral-50 p-3 px-8 text-gray-800 text-md sm:bg-transparent sm:p-4 sm:text-xl ${pathname === "/settings/language" ? "font-bold underline" : ""}`}
        >
          {t("language.title")}
          <ChevronRight className="sm:hidden" />
        </Link>
        <Link
          href={"/settings/topic"}
          className={`flex items-center justify-between bg-neutral-50 p-3 px-8 text-gray-800 text-md sm:bg-transparent sm:p-4 sm:text-xl ${pathname === "/settings/topic" ? "font-bold underline" : ""}`}
        >
          {t("topic.title")}
          <ChevronRight className="sm:hidden" />
        </Link>
        <Link
          href={"/settings/favorite"}
          className={`flex items-center justify-between bg-neutral-50 p-3 px-8 text-gray-800 text-md sm:bg-transparent sm:p-4 sm:text-xl ${pathname === "/settings/favorite" ? "font-bold underline" : ""}`}
        >
          {t("favorite.title")}
          <ChevronRight className="sm:hidden" />
        </Link>
        <Link
          href={"/settings/block"}
          className={`flex items-center justify-between bg-neutral-50 p-3 px-8 text-gray-800 text-md sm:bg-transparent sm:p-4 sm:text-xl ${pathname === "/settings/block" ? "font-bold underline" : ""}`}
        >
          {t("block.title")}
          <ChevronRight className="sm:hidden" />
        </Link>
        <Link
          href={"/settings/other"}
          className={`flex items-center justify-between rounded-b-xl bg-neutral-50 p-3 px-8 text-gray-800 text-md sm:bg-transparent sm:p-4 sm:text-xl ${pathname === "/settings/other" ? "font-bold underline" : ""}`}
        >
          {t("other.title")}
          <ChevronRight className="sm:hidden" />
        </Link>
        <button type="button" className="btn btn-outline btn-error my-12 sm:my-3" onClick={logout}>
          {t("logout")}
        </button>
      </div>
    </>
  );
}
