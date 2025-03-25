"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { AiOutlineLeft } from "react-icons/ai";

export default function Page() {
  const t = useTranslations("setting");
  return (
    <>
      <div className="flex items-center justify-between border-gray-300 border-b p-4 text-xl sm:hidden">
        <Link href={"/settings/other"}>
          <AiOutlineLeft />
        </Link>
        {t("other.terms.title")}
        <div className="w-6" />
      </div>
      <div>
        <h1>利用規約ページ</h1>
      </div>
    </>
  );
}
