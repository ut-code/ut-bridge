"use client";

import { useUserFormContext } from "@/features/settings/UserFormController.tsx";
import { useLocale, useTranslations } from "next-intl";
import { SubmitButtonBlock } from "../components/SubmitButton.tsx";
import { styles } from "../shared-class.ts";

export default function Page() {
  const ctx = useUserFormContext();
  const { formData, languages } = ctx;
  const locale = useLocale();
  const t = useTranslations("settings");

  return (
    <form onSubmit={ctx.submitPatch} className="flex flex-col gap-3">
      <label className={styles.label}>
        <span className={styles.labelSpan}>{t("language.isForeign")}</span>
        <select
          name="isForeignStudent"
          value={ctx.formData.isForeignStudent ? "true" : "false"}
          onChange={ctx.handleChange}
          className={styles.inputSelect}
        >
          <option value="false">{t("language.localStudent")}</option>
          <option value="true">{t("language.foreignStudent")}</option>
        </select>
      </label>

      <label className={styles.label}>
        <span className={styles.labelSpan}>{t("language.motherLanguage")}</span>
        <select
          name="motherLanguageId"
          value={formData.motherLanguageId}
          onChange={ctx.handleChange}
          className={styles.inputSelect}
          disabled={!languages.length}
        >
          {languages.map((language) => (
            <option key={language.id} value={language.id}>
              {locale === "ja" ? language.jaName : language.enName}
            </option>
          ))}
        </select>
      </label>
      <div className={styles.label}>
        <span className={`py-4 ${styles.labelSpan}`}>{t("language.fluentLanguage")}</span>
        <div className={styles.multiSelectCheckboxWrapper}>
          {languages.map((language) => (
            <label key={language.id} className="items-center space-x-2">
              <input
                type="checkbox"
                name="fluentLanguageIds"
                value={language.id}
                checked={ctx.formData.fluentLanguageIds?.includes(language.id) ?? false}
                onChange={ctx.handleChange}
                className="checkbox"
              />
              <span>{locale === "ja" ? language.jaName : language.enName}</span>
            </label>
          ))}
        </div>
      </div>
      <div className={styles.label}>
        <span className={`py-4 ${styles.labelSpan}`}>{t("language.learningLanguage")}</span>
        <div className={styles.multiSelectCheckboxWrapper}>
          {languages.map((language) => (
            <label key={language.id} className="items-center space-x-2">
              <input
                type="checkbox"
                name="learningLanguageIds"
                value={language.id}
                checked={formData.learningLanguageIds?.includes(language.id) ?? false}
                onChange={ctx.handleChange}
                className="checkbox"
              />
              <span>{locale === "ja" ? language.jaName : language.enName}</span>
            </label>
          ))}
        </div>
      </div>
      <SubmitButtonBlock />
    </form>
  );
}
