"use client";

import Avatar from "@/components/Avatar";
import { useUserFormContext } from "@/features/settings/UserFormController.tsx";
import { useUserContext } from "@/features/user/userProvider.tsx";
import { NAME_MAX_LENGTH } from "common/zod/schema.ts";
import { useTranslations } from "next-intl";
import { SubmitButton } from "../components/SubmitButton.tsx";
import { styles } from "../shared-class.ts";

export default function Page() {
  const t = useTranslations("settings");
  const ctx = useUserFormContext();
  const { me } = useUserContext();

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
          maxLength={NAME_MAX_LENGTH}
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
      <label className={styles.label}>
        <span className={styles.labelSpan}>{t("basic.want-to-match")}</span>
        <input
          type="checkbox"
          name="wantToMatch"
          className={styles.inputToggle}
          defaultChecked={ctx.formData.wantToMatch}
          onChange={ctx.handleChange}
        />
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
      <Avatar src={ctx.imagePreviewURL ?? me.imageUrl} size={160} />
      <label className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
        {t("settings.basic.email")}
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          className="my-4 w-full rounded-xl border border-gray-500 bg-white p-2 sm:w-1/2"
        />
      </label>
      <label className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
        {t("settings.basic.allowPeriodicNotification")}
        <span className="flex w-1/2 flex-row justify-center">
          <input type="checkbox" name="allowNotifications" className="checkbox checkbox-primary" />
        </span>
      </label>
      <SubmitButton status={ctx.status} />
    </form>
  );
}
