"use client";

import Header from "@/components/Header";
import LanguageSwitcher from "@/components/LanguageSelectar";
import { Link } from "@/i18n/navigation.ts";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Home() {
  const t = useTranslations();
  return (
    <>
      <Header />
      <div className="flex w-full justify-center">
        <Image src="/app_sample_ja.png" alt="app sample image" width={500} height={100} />
        <div className="mr-20 flex flex-col items-center justify-center">
          <div className="flex flex-col items-start">
            <p className="-translate-x-20 my-2 bg-tBlue px-10 py-2 text-7xl text-white shadow-2xl">
              {t("catch.upper")}
            </p>
            <p className="my-2 translate-x-20 bg-tYellow px-10 py-2 text-7xl text-white shadow-2xl">
              {t("catch.lower")}
            </p>
          </div>
          <p className="my-4 text-center text-3xl">{t("catch.message")}</p>
          <Link
            href={"/login"}
            className="my-4 cursor-pointer rounded-full bg-tBlue px-20 py-3 text-center text-3xl text-white"
          >
            {t("catch.start")}
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </>
  );
}
