"use client";

import SideNav from "@/features/setting/SideNav";
import { UserFormProvider } from "@/features/setting/UserFormController.tsx";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
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
    case "/delete":
      return "delete.title";
    default:
      console.error("got unexpected pathname:", pathname);
      return "basic.title";
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("setting");
  // ロケールを考慮してパスを正規化する（/ja/login, /en/login → /login）
  const _path = usePathname();
  const pathname = _path.replace(/^\/(ja|en)\/settings/, "");

  const title = t(getTransition(pathname));

  return (
    <>
      <UserFormProvider loadPreviousData>
        <div className="flex h-screen flex-col sm:flex-row">
          <div className="hidden sm:block">
            <SideNav />
          </div>
          {pathname !== "" && (
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
