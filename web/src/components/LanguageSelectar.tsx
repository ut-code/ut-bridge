"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";

export default function LanguageSwitcher({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  interface ChangeLanguageProps {
    locale: string;
  }

  const changeLanguage = (locale: ChangeLanguageProps["locale"]): void => {
    if (locale === currentLocale) return;

    // 言語プレフィックスを変更
    const newPath = pathname.replace(/^\/(en|ja)/, `/${locale}`);
    router.push(newPath, { locale });
  };

  return (
    <select
      value={currentLocale}
      onChange={(e) => changeLanguage(e.target.value)}
      className={`select w-30 ${className}`}
    >
      <option value="en">English</option>
      <option value="ja">日本語</option>
      {/* <option value="zh">中文</option> */}
    </select>
  );
}
