"use client";

import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("setting");
  t;
  return (
    <>
      <h1>利用規約ページ</h1>
    </>
  );
}
