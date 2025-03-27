"use client";

import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations();
  return (
    <div>
      <h1 className="font-bold text-2xl text-gray-800 sm:text-3xl">{t("setting.other.contact.title")}</h1>
      <a className="link" href="https://forms.gle/nL1D4JZ6BgfvsTT56">
        {t("setting.other.contact.contactForm")}
      </a>
    </div>
  );
}
