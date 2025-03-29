"use client";

import { client } from "@/client";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { useUserFormContext } from "@/features/settings/UserFormController.tsx";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { styles } from "../shared-class.ts";

export default function Page() {
  const { idToken: Authorization } = useAuthContext();
  const router = useRouter();
  const ctx = useUserFormContext();
  const { formData, languages } = ctx;
  const locale = useLocale();
  console.log(ctx);
  const t = useTranslations("settings");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked, multiple } = e.target as HTMLInputElement;
    const { options } = e.target as HTMLSelectElement;

    ctx.setFormData((prev) => {
      if (multiple) {
        const selectedValues = Array.from(options)
          .filter((option) => option.selected)
          .map((option) => option.value);

        return {
          ...prev,
          [name]: selectedValues,
        };
      }

      if (name === "fluentLanguageIds" || name === "learningLanguageIds") {
        const updatedLanguages = checked
          ? [...(prev[name] ?? []), value] // 追加
          : prev[name]?.filter((id) => id !== value); // 削除

        return {
          ...prev,
          [name]: updatedLanguages,
        };
      }

      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const body = {
        ...formData,
      };
      const res = await client.users.me.$patch({
        header: { Authorization },
        json: body,
      });
      if (!res.ok) {
        console.error(await res.text());
        throw new Error(`レスポンスステータス: ${res.status}`);
      }

      setStatus("success");
      ctx.onSuccess(await res.json());
    } catch (error) {
      console.error("ユーザー登録に失敗しました", error);
      setStatus("error");
      router.push("/login");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
          onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
                className="checkbox"
              />
              <span>{locale === "ja" ? language.jaName : language.enName}</span>
            </label>
          ))}
        </div>
      </div>
      <div className={styles.submitButtonWrapperDiv}>
        <button type="submit" className={styles.submitButton} disabled={status === "loading"}>
          {status === "loading" ? t("isRegister") : t("register")}
        </button>
      </div>
    </form>
  );
}
