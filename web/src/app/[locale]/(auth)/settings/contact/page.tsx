"use client";

import { useTranslations } from "next-intl";
import { styles } from "../shared-class.ts";

export default function Page() {
  const t = useTranslations();
  return (
    <div>
      <h1 className={styles.usersH1}>{t("settings.other.contact.title")}</h1>
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLScioyR0gN9-UUgsPaePP-EO8oVryRYmdOqqb2aULkc2RZmUkA/viewform?embedded=true"
        width="640"
        height="666"
        className="max-w-full"
        title="contact form"
      >
        読み込んでいます…
      </iframe>
    </div>
  );
}
