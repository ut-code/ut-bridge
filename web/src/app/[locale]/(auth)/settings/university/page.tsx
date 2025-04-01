"use client";

import { useUserFormContext } from "@/features/settings/UserFormController.tsx";
import { useLocale, useTranslations } from "next-intl";
import { SubmitButton } from "../components/SubmitButton.tsx";
import { styles } from "../shared-class.ts";

export default function Page() {
  const ctx = useUserFormContext();
  const t = useTranslations("settings");
  const locale = useLocale();

  return (
    <form onSubmit={ctx.submitPatch} className={styles.form}>
      <label className={styles.label}>
        <span className={styles.labelSpan}>{t("university.univ")}</span>
        <select
          name="universityId"
          onChange={ctx.handleChange}
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
          onChange={ctx.handleChange}
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
          onChange={ctx.handleChange}
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
        <select name="grade" value={ctx.formData.grade} onChange={ctx.handleChange} className={styles.inputSelect}>
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
      <SubmitButton status={ctx.status} />
    </form>
  );
}
