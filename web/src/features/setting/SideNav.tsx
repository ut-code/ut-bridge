"use client";
import LanguageSwitcher from "@/components/LanguageSelectar.tsx";
import { useGoogleLogout } from "@/features/auth/functions/logout.ts";
import { Link } from "@/i18n/navigation.ts";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { blocks } from "./path-blocks.tsx";

export default function SideNav() {
  const { logout } = useGoogleLogout();
  const path = usePathname();
  const t = useTranslations("setting");
  // ロケールを考慮してパスを正規化する（/ja/login, /en/login → /login）
  const pathname = path.replace(/^\/(en|ja)\//, "/");

  return (
    <aside className="w-80 px-10 py-20">
      <h1 className="font-bold text-3xl">{t("title")}</h1>
      <div className="m-5 block gap-0 border-gray-300 border-r">
        {blocks.map((block) => (
          <section key={block.title}>
            <div className="invisible my-8" />
            {block.items.map((item) => (
              <Link
                href={item.href}
                key={item.href}
                className={`flex items-center justify-between bg-transparent px-8 py-2 text-gray-800 text-md text-xl ${pathname === item.href ? "font-bold underline" : ""}`}
              >
                {t(item.title)}
                <ChevronRight className="sm:hidden" />
              </Link>
            ))}
          </section>
        ))}
        <section className="flex flex-col p-4 px-8">
          <LanguageSwitcher className="w-full" />
          <button type="button" className="btn btn-outline btn-error my-3" onClick={logout}>
            {t("logout")}
          </button>
        </section>
      </div>
    </aside>
  );
}
