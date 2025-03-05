"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const changeLanguage = (locale) => {
    if (locale === currentLocale) return;

    // 言語プレフィックスを変更
    const newPath = pathname.replace(/^\/(en|ja)/, `/${locale}`);
    router.push(newPath, { locale });
  };

  return (
    <select value={currentLocale} onChange={(e) => changeLanguage(e.target.value)} className="rounded border px-2 py-1">
      <option value="en">English</option>
      <option value="ja">日本語</option>
      {/* <option value="zh">中文</option> */}
    </select>
  );
}
