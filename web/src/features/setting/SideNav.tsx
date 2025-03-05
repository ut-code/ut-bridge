"use client";
import { useGoogleLogout } from "@/features/auth/functions/logout.ts";
import { Link } from "@/i18n/navigation.ts";
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
      <h1 className="font-bold text-3xl"> {t("title")}</h1>
      <div className="m-5 border-gray-300 border-r">
        <Link
          href={"/settings/basic"}
          className={`my-3 block text-xl ${pathname === "/settings/basic" ? "font-bold underline" : ""}`}
        >
          {t("basic.title")}
        </Link>
        <Link
          href={"/settings/university"}
          className={`my-3 block text-xl ${pathname === "/settings/university" ? "font-bold underline" : ""}`}
        >
          {t("university.title")}
        </Link>
        <Link
          href={"/settings/language"}
          className={`my-3 block text-xl ${pathname === "/settings/language" ? "font-bold underline" : ""}`}
        >
          {t("language.title")}
        </Link>
        <Link
          href={"/settings/topic"}
          className={`my-3 block text-xl ${pathname === "/settings/topic" ? "font-bold underline" : ""}`}
        >
          {t("topic.title")}
        </Link>
        <Link
          href={"/settings/favorite"}
          className={`my-3 block text-xl ${pathname === "/settings/favorite" ? "font-bold underline" : ""}`}
        >
          {t("favorite.title")}
        </Link>
        <Link
          href={"/settings/block"}
          className={`my-3 block text-xl ${pathname === "/settings/block" ? "font-bold underline" : ""}`}
        >
          {t("block.title")}
        </Link>
        <Link
          href={"/settings/other"}
          className={`my-3 block text-xl ${pathname === "/settings/other" ? "font-bold underline" : ""}`}
        >
          {t("other.title")}
        </Link>
        <button type="button" className="btn btn-error my-3" onClick={logout}>
          {t("logout")}
        </button>
      </div>
    </>
  );
}
