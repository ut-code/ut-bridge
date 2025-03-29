"use client";

import { useUserFormContext } from "@/features/settings/UserFormController.tsx";
import { useTranslations } from "next-intl";
import { SubmitButtonBlock } from "../components/SubmitButton.tsx";
import { styles } from "../shared-class.ts";

export default function Page() {
  const ctx = useUserFormContext();
  const t = useTranslations("settings");

  return (
    <form onSubmit={ctx.submitPatch} className={styles.form}>
      <label htmlFor="hobby" className={styles.label}>
        <span className={styles.labelSpan}>{t("topic.hobby")}</span>
        <textarea
          id="hobby"
          name="hobby"
          rows={5}
          value={ctx.formData.hobby ?? ""}
          onChange={ctx.handleChange}
          required
          className={styles.inputTextarea}
        />
      </label>

      <label htmlFor="introduction" className={styles.label}>
        <span className={styles.labelSpan}>{t("topic.introduction")}</span>
        <textarea
          id="introduction"
          name="introduction"
          rows={5}
          value={ctx.formData.introduction ?? ""}
          onChange={ctx.handleChange}
          required
          className={styles.inputTextarea}
        />
      </label>

      <SubmitButtonBlock />
    </form>
  );
}
