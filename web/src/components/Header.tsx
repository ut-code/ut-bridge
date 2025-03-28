"use client";
import { useUserContext } from "@/features/user/userProvider.tsx";
import { useNormalizedPathname } from "@/hooks/useNormalizedPath.ts";
import { Link } from "@/i18n/navigation.ts";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { AppIcon } from "./AppIcon.tsx";
import Avatar from "./Avatar.tsx";

export default function Header({ title }: { title: string }) {
  const router = useRouter();
  const t = useTranslations();

  const pathname = useNormalizedPathname();
  const { me } =
    pathname.startsWith("/registration") || pathname === "/login" || pathname === ""
      ? { me: null }
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
      {pathname === "/login" || pathname === "/registration" || pathname === "" ? (
        <>
          <p className="absolute right-1/2 translate-x-1/2 font-bold text-white text-xl sm:hidden">{title}</p>
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
            {t("settings.title")}
          </button>
          <p className="absolute right-1/2 translate-x-1/2 font-bold text-white text-xl sm:hidden">{title}</p>
          <Link href="/settings/basic" className="absolute right-4 flex cursor-pointer items-center gap-4">
            <Avatar size={40} src={me?.imageUrl} />
            {me?.name && <p className="hidden text-white text-xl sm:block">{me.name}</p>}
          </Link>
        </>
      )}
    </header>
  );
}
