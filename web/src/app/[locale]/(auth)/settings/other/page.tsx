"use client";

import LanguageSwitcher from "@/components/LanguageSelectar";
import { Link } from "@/i18n/navigation.ts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("setting");
  return (
    <>
      <div className="flex items-center justify-between border-gray-300 border-b p-4 text-xl sm:hidden">
        <Link href={"/settings"}>
          <ChevronLeft />
        </Link>
        {t("other.title")}
        <div className="w-6" />
      </div>
      <div className="m-5 mt-15 flex flex-col gap-0.5 border-gray-300">
        <div className="mb-4 ">
          <LanguageSwitcher />
        </div>
        <Link
          href={"/settings/other/privacy"}
          className="flex items-center justify-between rounded-t-xl bg-neutral-50 p-3 px-6 text-gray-800 text-md sm:p-4 sm:pr-8 sm:pl-12 sm:text-lg"
        >
          {t("other.privacy.title")}
          <ChevronRight />
        </Link>
        <Link
          href={"/settings/other/terms"}
          className="flex items-center justify-between rounded-b-xl bg-neutral-50 p-3 px-6 text-gray-800 text-md sm:p-4 sm:pr-8 sm:pl-12 sm:text-lg"
        >
          {t("other.terms.title")}
          <ChevronRight />
        </Link>
      </div>
    </>
  );
}
