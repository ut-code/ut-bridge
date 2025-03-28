"use client";
import LanguageSwitcher from "@/components/LanguageSelectar.tsx";
import { useGoogleLogout } from "@/features/auth/functions/logout.ts";
import { useNormalizedPathname } from "@/hooks/useNormalizedPath.ts";
import { Link } from "@/i18n/navigation.ts";
import { useTranslations } from "next-intl";
import { AiOutlineRight } from "react-icons/ai";
import { blocks } from "./path-blocks.ts";

export default function SideNav() {
  const { logout } = useGoogleLogout();
  const t = useTranslations("settings");
  const pathname = useNormalizedPathname();

  return (
    <aside className="w-40 py-20 lg:w-70 xl:mx-10 xl:w-90">
      <h1 className="mx-5 font-bold text-3xl">{t("title")}</h1>
      <div className="block gap-0 border-gray-300 border-r">
        {blocks.map((block) => (
          <section key={block.title}>
            <div className="invisible my-8" />
            {block.items.map((item) => (
              <Link
                href={item.href}
                key={item.href}
                className={`flex items-center justify-between bg-transparent px-8 py-2 text-md text-xl xl:ml-10 ${pathname === item.href ? "underline" : ""} ${item.variant === "danger" ? "text-error" : "text-gray-800"}`}
              >
                {t(item.title)}
                <AiOutlineRight className="sm:hidden" />
              </Link>
            ))}
          </section>
        ))}
        <section className="mt-8 flex flex-col px-8 xl:ml-10">
          <LanguageSwitcher className="w-full" />
          <button type="button" className="btn btn-outline btn-error my-3" onClick={logout}>
            {t("logout")}
          </button>
        </section>
      </div>
    </aside>
  );
}
