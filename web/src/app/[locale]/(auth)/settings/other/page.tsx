"use client";

import LanguageSwitcher from "@/components/LanguageSelectar";
import { Link } from "@/i18n/navigation.ts";

export default function Page() {
  return (
    <>
      <div className="max-w my-20 p-4 text-lg">
        <LanguageSwitcher />
        <Link href={"/settings/other/privacy"} className="my-3 block">
          プライバシーポリシー
        </Link>
        <Link href={"/settings/other/terms"} className="my-3 block">
          利用規約
        </Link>
      </div>
    </>
  );
}
