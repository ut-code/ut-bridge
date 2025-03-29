"use client";

import Avatar from "@/components/Avatar";
import { useUserFormContext } from "@/features/settings/UserFormController.tsx";
import { useTranslations } from "next-intl";
import { SubmitButtonBlock } from "../components/SubmitButton.tsx";
import { styles } from "../shared-class.ts";

export default function Page() {
  const t = useTranslations("settings");
  const ctx = useUserFormContext();

  return (
    <form onSubmit={ctx.submitPatch} className={styles.form}>
      <label className={styles.label}>
        <span className={styles.labelSpan}>{t("basic.name")}</span>
        <input
          type="text"
          name="name"
          value={ctx.formData.name}
          onChange={ctx.handleChange}
          required
          className={styles.inputText}
        />
      </label>
      <label className={styles.label}>
        <span className={styles.labelSpan}>{t("basic.sex")}</span>

        <select name="gender" value={ctx.formData.gender} onChange={ctx.handleChange} className={styles.inputSelect}>
          <option value="male"> {t("basic.male")}</option>
          <option value="female"> {t("basic.female")}</option>
          <option value="other"> {t("basic.other")}</option>
        </select>
      </label>
      <div className={styles.label}>
        <input
          type="file"
          accept=".png,.jpg,.jpeg,.webp,.avif,.heif"
          onChange={ctx.handleImageChange}
          className="hidden"
          id="image-upload"
        />
        <span className={styles.labelSpan}>{t("basic.photo")}</span>
        <label htmlFor="image-upload" className={styles.imageUploadButton}>
          {t("basic.photoUpload")}
        </label>
      </div>
      <Avatar src={ctx.imagePreviewURL} size={160} />
      <SubmitButtonBlock />
    </form>
  );
}
