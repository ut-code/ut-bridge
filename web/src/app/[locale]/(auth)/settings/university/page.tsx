"use client";

import { client } from "@/client";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { useUserFormContext } from "@/features/setting/UserFormController.tsx";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { styles } from "../shared-class.ts";

export default function Page() {
  const router = useRouter();
  const { idToken: Authorization } = useAuthContext();
  const ctx = useUserFormContext();
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const t = useTranslations("setting");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked, multiple } = e.target as HTMLInputElement;
    const { options } = e.target as HTMLSelectElement;

    ctx.setFormData((prev) => {
      if (name === "universityId") {
        return { ...prev, universityId: value, campusId: "", divisionId: "" };
      }

      if (multiple) {
        const selectedValues = Array.from(options)
          .filter((option) => option.selected)
          .map((option) => option.value);
        return { ...prev, [name]: selectedValues };
      }

      return { ...prev, [name]: type === "checkbox" ? checked : value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const body = { ...ctx.formData };
      const res = await client.users.me.$patch({
        header: { Authorization },
        json: body,
      });

      if (!res.ok) throw new Error(`レスポンスステータス: ${res.status} - ${await res.text()}`);

      setStatus("success");
      ctx.feedbackSuccess();
    } catch (error) {
      console.error("ユーザー登録に失敗しました", error);
      setStatus("error");
      router.push("/login");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label className={styles.label}>
        <span className={styles.labelSpan}>{t("university.univ")}</span>
        <select
          name="universityId"
          onChange={handleChange}
          value={ctx.formData.universityId}
          className={styles.inputSelect}
        >
          {ctx.universities.map((univ) => (
            <option key={univ.id} value={univ.id}>
              {locale === "ja" ? univ.jaName : univ.enName}
            </option>
          ))}
        </select>
      </label>

      {/* Division Selection */}
      <label className={styles.label}>
        <span className={styles.labelSpan}>{t("university.divisions")}</span>
        <select
          name="divisionId"
          value={ctx.formData.divisionId}
          onChange={handleChange}
          className={styles.inputSelect}
          disabled={!ctx.divisions.length}
        >
          {ctx.divisions.map((division) => (
            <option key={division.id} value={division.id}>
              {locale === "ja" ? division.jaName : division.enName}
            </option>
          ))}
        </select>
      </label>

      {/* Campus Selection */}
      <label className={styles.label}>
        <span className={styles.labelSpan}>{t("university.campus")}</span>
        <select
          name="campusId"
          value={ctx.formData.campusId}
          onChange={handleChange}
          className={styles.inputSelect}
          disabled={!ctx.campuses.length}
        >
          {ctx.campuses.map((campus) => (
            <option key={campus.id} value={campus.id}>
              {locale === "ja" ? campus.jaName : campus.enName}
            </option>
          ))}
        </select>
      </label>

      {/* Grade Selection */}
      <label className={styles.label}>
        <span className={styles.labelSpan}>{t("university.grade")}</span>
        <select name="grade" value={ctx.formData.grade} onChange={handleChange} className={styles.inputSelect}>
          <option value="B1">{t("university.gradeOptions.B1")}</option>
          <option value="B2">{t("university.gradeOptions.B2")}</option>
          <option value="B3">{t("university.gradeOptions.B3")}</option>
          <option value="B4">{t("university.gradeOptions.B4")}</option>
          <option value="M1">{t("university.gradeOptions.M1")}</option>
          <option value="M2">{t("university.gradeOptions.M2")}</option>
          <option value="D1">{t("university.gradeOptions.D1")}</option>
          <option value="D2">{t("university.gradeOptions.D2")}</option>
          <option value="D3">{t("university.gradeOptions.D3")}</option>
        </select>
      </label>

      <div className={styles.submitButtonWrapperDiv}>
        <button type="submit" className={styles.submitButton} disabled={status === "loading"}>
          {status === "loading" ? t("isRegister") : t("register")}
        </button>
      </div>
    </form>
  );
}
