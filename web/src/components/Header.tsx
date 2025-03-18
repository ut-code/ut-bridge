"use client";
import { useUserContext } from "@/features/user/userProvider.tsx";
import { Link } from "@/i18n/navigation.ts";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { AppIcon } from "./AppIcon.tsx";

export default function Header() {
  const router = useRouter();
  const path = usePathname();
  const t = useTranslations();

  // ロケールを考慮してパスを正規化する（/ja/login, /en/login → /login）
  const pathname = path.replace(/^\/(en|ja)\//, "/");
  const me =
    pathname.startsWith("/registration") || pathname === "/login"
      ? { imageUrl: "", name: "" }
      : // who the fuck did this
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useUserContext();

  return (
    <header className="flex h-16 w-full items-center bg-tBlue">
      <Link href="/community" passHref className="px-4">
        <AppIcon width={36} height={36} />
      </Link>
      <Link href="/community" className="hidden cursor-pointer px-4 text-2xl text-white sm:block">
        UT-Bridge
      </Link>
      {pathname === "/login" || pathname === "/registration" ? (
        <>
          <p className="absolute right-1/2 translate-x-1/2 font-bold text-white text-xl sm:hidden">
            {pathname === "/registration" ? "初期登録" : pathname === "/login" ? "ログイン" : ""}
          </p>
        </>
      ) : (
        <>
          <button
            type="button"
            className={`hidden h-full cursor-pointer px-4 text-white text-xl transition-colors duration-200 sm:block ${
              pathname === "/community" ? "bg-focus" : "hover:bg-focus"
            }`}
            onClick={() => {
              router.push("/community");
            }}
          >
            {t("community.title")}
          </button>
          <button
            type="button"
            className={`hidden h-full cursor-pointer px-4 text-white text-xl transition-colors duration-200 sm:block ${
              pathname === "/chat" ? "bg-focus" : "hover:bg-focus"
            }`}
            onClick={() => {
              router.push("/chat");
            }}
          >
            {t("chat.title")}
          </button>
          <button
            type="button"
            className={`hidden h-full cursor-pointer px-4 text-white text-xl transition-colors duration-200 sm:block ${
              pathname.startsWith("/settings") ? "bg-focus" : "hover:bg-focus"
            }`}
            onClick={() => {
              router.push("/settings");
            }}
          >
            {t("setting.title")}
          </button>
          <p className="absolute right-1/2 translate-x-1/2 font-bold text-white text-xl sm:hidden">
            {pathname === "/"
              ? "ランディング"
              : pathname.startsWith("/registration")
                ? "初期登録"
                : pathname === "/login"
                  ? "ログイン"
                  : pathname === "/community" || pathname === "/users"
                    ? "コミュニティ"
                    : pathname.startsWith("/chat")
                      ? "チャット"
                      : pathname.startsWith("/settings")
                        ? "設定"
                        : ""}
          </p>
          <div className="absolute right-4 flex items-center gap-4">
            <div>
              {"imageUrl" in me ? (
                <Image
                  src={me.imageUrl}
                  alt={me.name ?? "User"}
                  width={60}
                  height={60}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300">No Image</div>
              )}
            </div>
            {"name" in me && <p className="hidden text-white text-xl sm:block">{me.name}</p>}
          </div>
        </>
      )}
    </header>
  );
}
