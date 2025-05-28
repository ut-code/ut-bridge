"use client";

import SideNav from "@/features/settings/SideNav";
import { UserFormProvider } from "@/features/settings/UserFormController.tsx";
import { useNormalizedPathname } from "@/hooks/useNormalizedPath";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { AiOutlineLeft } from "react-icons/ai";

function getTransition(pathname: string) {
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

export default function Layout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("settings");
  const pathnameAfterSettings = useNormalizedPathname().replace("/settings", "");

  const title = t(getTransition(pathnameAfterSettings));

  return (
    <>
      <UserFormProvider loadPreviousData>
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
      </UserFormProvider>
    </>
  );
}
