"use client";
import { useUserContext } from "@/features/user/userProvider.tsx";
import { useNormalizedPathname } from "@/hooks/useNormalizedPath.ts";
import { Link } from "@/i18n/navigation.ts";
import { useTranslations } from "next-intl";
import { AppIcon } from "./AppIcon.tsx";
import Avatar from "./Avatar.tsx";

export default function Header() {
  const t = useTranslations();
  const pathname = useNormalizedPathname();

  const { me } =
    pathname.startsWith("/registration") || pathname === "/login" || pathname === ""
      ? { me: null }
      : // eslint-disable-next-line react-hooks/rules-of-hooks
        useUserContext();

  let title = "";
  if (pathname === "") title = "UT-Bridge";
  else if (pathname.startsWith("/chat")) title = t("chat.title");
  else if (pathname === "/login") title = t("Login.title");
  else if (pathname.startsWith("/settings")) title = t("settings.title");
  else if (pathname.startsWith("/community") || pathname.startsWith("/users")) title = t("community.title");
  else if (pathname.startsWith("/registration")) title = t("registration.title");
  else {
    console.log("unmatched path:", pathname);
  }

  return (
    <header className="sticky top-0 z-10 h-16 w-full bg-tBlue">
      <div className="flex h-16 items-center">
        <Link href={me ? "/community" : "/"} passHref className="px-4">
          <AppIcon width={36} height={36} />
        </Link>
        <Link href={me ? "/community" : "/"} className="hidden cursor-pointer px-4 text-2xl text-white sm:block">
          UT-Bridge
        </Link>
        {pathname === "/login" || pathname === "/registration" || pathname === "" ? (
          <>
            <p className="absolute right-1/2 translate-x-1/2 font-bold text-white text-xl sm:hidden">{title}</p>
          </>
        ) : (
          <>
            <Link
              className={`hidden h-full cursor-pointer content-center px-4 text-white text-xl transition-colors duration-200 sm:block ${
                pathname === "/community" ? "bg-focus" : "hover:bg-focus"
              }`}
              href="/community"
            >
              {t("community.title")}
            </Link>
            <Link
              className={`hidden h-full cursor-pointer content-center px-4 text-white text-xl transition-colors duration-200 sm:block ${
                pathname === "/chat" ? "bg-focus" : "hover:bg-focus"
              }`}
              href="/chat"
            >
              {t("chat.title")}
            </Link>
            <Link
              className={`hidden h-full cursor-pointer content-center px-4 text-white text-xl transition-colors duration-200 sm:block ${
                pathname.startsWith("/settings") ? "bg-focus" : "hover:bg-focus"
              }`}
              href="/settings"
            >
              {t("settings.title")}
            </Link>
            <p className="absolute right-1/2 translate-x-1/2 font-bold text-white text-xl sm:hidden">{title}</p>
            <Link href="/settings/basic" className="absolute right-4 flex cursor-pointer items-center gap-4">
              <Avatar size={40} src={me?.imageUrl} />
              {me?.name && <p className="hidden text-white text-xl sm:block">{me.name}</p>}
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
