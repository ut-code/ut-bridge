"use client";

import Header from "@/components/Header";
import LanguageSwitcher from "@/components/LanguageSelectar";
import { Link } from "@/i18n/navigation.ts";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function LandingPage() {
  const t = useTranslations();
  return (
    <>
      <Header title="" />
      <div className="mt-10 flex w-full flex-col-reverse justify-center xl:flex-row">
        <Image src="/app_sample_ja.png" alt="app sample image" width={500} height={100} className="m-auto xl:m-0" />
        <div className="my-10 mr-5 flex flex-col items-center justify-center xl:my-0 xl:mr-20">
          <div className="flex flex-col items-start">
            <p className="-translate-x-5 xl:-translate-x-20 my-1 mt-5 bg-tBlue px-10 py-1 text-5xl text-white shadow-md xl:my-2 xl:mt-2 xl:py-2 xl:text-7xl xl:shadow-2xl">
              {t("catch.upper")}
            </p>
            <p className="my-1 translate-x-5 bg-tYellow px-10 py-1 text-5xl text-white shadow-md xl:my-2 xl:translate-x-20 xl:py-2 xl:text-7xl xl:shadow-2xl">
              {t("catch.lower")}
            </p>
          </div>
          <p className="my-4 text-center text-xl xl:text-3xl">{t("catch.message")}</p>
          <Link
            href={"/login"}
            className="my-2 cursor-pointer rounded-full bg-tBlue px-20 py-3 text-center text-3xl text-white xl:my-4"
          >
            {t("catch.start")}
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </>
  );
}
