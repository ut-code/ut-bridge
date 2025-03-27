"use client";
import LanguageSwitcher from "@/components/LanguageSelectar.tsx";
import { useGoogleLogout } from "@/features/auth/functions/logout.ts";
import { Link } from "@/i18n/navigation.ts";
import { useTranslations } from "next-intl";
import { AiOutlineRight } from "react-icons/ai";
import { blocks } from "./path-blocks.ts";

export default function PageNav() {
  const { logout } = useGoogleLogout();
  const t = useTranslations("settings");

  return (
    <>
      <h1 className="hidden font-bold text-3xl sm:block">{t("title")}</h1>
      <div className="m-5 flex flex-col gap-0.5 border-gray-300">
        {blocks.map((block) => (
          <section key={block.title}>
            <div className="divider mt-6 mb-4">{t(block.title)}</div>
            {block.items.map((item, index, self) => (
              <Link
                href={item.href}
                key={item.href}
                className={`flex items-center justify-between bg-neutral-50 p-3 px-8 text-gray-800 text-md ${index === 0 ? "rounded-t-xl" : index === self.length - 1 ? "rounded-b-xl" : ""}`}
              >
                {t(item.title)}
                <AiOutlineRight />
              </Link>
            ))}
          </section>
        ))}
        <section id="controls" className="my-12 flex justify-center">
          <LanguageSwitcher />
          <button type="button" className="btn btn-outline btn-error mx-4" onClick={logout}>
            {t("logout")}
          </button>
        </section>
      </div>
    </>
  );
}
