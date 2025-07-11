"use client";

import Avatar from "@/components/Avatar";
import { useUserFormContext } from "@/features/settings/UserFormController.tsx";
import { useUserContext } from "@/features/user/userProvider.tsx";
import { NAME_MAX_LENGTH } from "common/zod/schema.ts";
import { useTranslations } from "next-intl";
import { useState } from "react";
import PhotoCropModal from "../../../../../components/PhotoCropModal.tsx";
import { SubmitButton } from "../components/SubmitButton.tsx";
import { styles } from "../shared-class.ts";

export default function Page() {
  const t = useTranslations("settings");
  const ctx = useUserFormContext();
  const { me } = useUserContext();
  const [isPhotoCropModalOpen, setIsPhotoCropModalOpen] = useState(false);

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
          onClick={() => setIsPhotoCropModalOpen(true)}
          className="hidden"
          id="image-upload"
        />
        <span className={styles.labelSpan}>{t("basic.photo")}</span>
        <label htmlFor="image-upload" className={styles.imageUploadButton}>
          {t("basic.photoUpload")}
        </label>
      </div>
      <Avatar src={ctx.imagePreviewURL ?? me.imageUrl} size={160} />
      {ctx.imagePreviewURL && (
        <PhotoCropModal
          imageUrl={ctx.imagePreviewURL}
          isPhotoCropModalOpen={isPhotoCropModalOpen}
          setIsPhotoCropModalOpen={setIsPhotoCropModalOpen}
        />
      )}
      <SubmitButton status={ctx.status} />
    </form>
  );
}
