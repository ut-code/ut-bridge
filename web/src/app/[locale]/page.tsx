"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Header from "@/components/Header.tsx";
import LanguageSwitcher from "@/components/LanguageSelectar.tsx";
import { Link } from "@/i18n/navigation.ts";
import samplePicEn from "../../../public/app_sample_en.png";
import samplePicJa from "../../../public/app_sample_ja.png";

export default function LandingPage() {
  const t = useTranslations();
  const pathname = usePathname();
  return (
    <>
      <Header user={null} />
      <main className="flex w-full flex-grow flex-col-reverse justify-center bg-white pt-10 xl:flex-row">
        <div className="m-auto flex max-w-[500px] flex-col items-center justify-center xl:m-0">
          <Image src={pathname.startsWith("/ja") ? samplePicJa : samplePicEn} alt="app sample image" />
        </div>
        <div className="my-10 mr-5 flex flex-col items-center justify-center xl:my-0 xl:mr-20">
          <div className="flex flex-col items-start">
            <p className="-translate-x-5 xl:-translate-x-20 my-1 mt-5 bg-tBlue px-10 py-1 text-[min(10vw,48px)] text-white shadow-md xl:my-2 xl:mt-2 xl:py-2 xl:text-7xl xl:shadow-2xl">
              {t("catch.upper")}
            </p>
            <p className="my-1 translate-x-5 bg-tYellow px-10 py-1 text-[min(10vw,48px)] text-white shadow-md xl:my-2 xl:translate-x-20 xl:py-2 xl:text-7xl xl:shadow-2xl">
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
      </main>
    </>
  );
}
