"use client";

import { useTranslations } from "next-intl";
import { styles } from "../shared-class.ts";

export default function Page() {
  const t = useTranslations();
  return (
    <div>
      <h1 className={styles.usersH1}>{t("settings.other.contact.title")}</h1>
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSf46l42X6ywpoIfR5Y7P5Fu6tFvnlTBP1kfcOOGEqzuu2Nx3A/viewform?usp=header"
        width="640"
        height="1500"
        className="max-w-full"
        title="contact form"
      >
        読み込んでいます…
      </iframe>
    </div>
  );
}
