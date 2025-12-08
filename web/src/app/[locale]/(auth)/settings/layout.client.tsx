"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { AiOutlineLeft } from "react-icons/ai";
import SideNav from "@/features/settings/SideNav.tsx";
import { useNormalizedPathname } from "@/hooks/useNormalizedPath.ts";

function useTransition(pathname: string) {
  switch (pathname) {
    case "":
      return "basic.title";
    case "/basic":
      return "basic.title";
    case "/university":
      return "university.title";
    case "/language":
      return "language.title";
    case "/topic":
      return "topic.title";
    case "/favorite":
      return "favorite.title";
    case "/block":
      return "block.title";
    case "/privacy":
      return "other.privacy.title";
    case "/terms":
      return "other.terms.title";
    case "/contact":
      return "other.contact.title";
    case "/delete":
      return "delete.title";
    case "/email":
      return "email.title";
    default:
      console.error("got unexpected pathname:", pathname);
      return "basic.title";
  }
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("settings");
  const pathnameAfterSettings = useNormalizedPathname().replace("/settings", "");

  const title = t(useTransition(pathnameAfterSettings));

  return (
    <div className="flex flex-col sm:flex-row">
      <div className="hidden sm:block">
        <SideNav />
      </div>
      {pathnameAfterSettings !== "" && (
        <div className="flex items-center justify-between border-gray-300 border-b p-4 text-xl sm:hidden">
          <Link href={"/settings"}>
            <AiOutlineLeft />
          </Link>
          {title}
          <div className="w-6" />
        </div>
      )}
      <main className="w-full p-8 sm:mt-30 md:mr-8 xl:mr-24">{children}</main>
    </div>
  );
}
