"use client";

import { client } from "@/client";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { upload } from "@/features/image/ImageUpload";
import { useUserFormContext } from "@/features/setting/UserFormController.tsx";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { styles } from "../shared-class.ts";

export default function Page() {
  const router = useRouter();
  const t = useTranslations("setting");

  const ctx = useUserFormContext();
  const { idToken: Authorization } = useAuthContext();

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreviewURL, setImagePreviewURL] = useState<string | undefined>(ctx.formData.imageUrl);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    ctx.setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreviewURL(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    if (newImage) {
      ctx.formData.imageUrl = await upload(newImage);
      ctx.setFormData(ctx.formData); // update imageURL
    }

    try {
      const res = await client.users.me.$patch({
        header: { Authorization },
        json: { ...ctx.formData },
      });
      if (!res.ok) {
        throw new Error(`レスポンスステータス: ${res.status}, response: ${await res.text()}`);
      }
      setStatus("success");
      ctx.feedbackSuccess();
    } catch (error) {
      console.error("ユーザー情報の更新に失敗しました", error);
      setStatus("error");
      router.push("/login");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          <span className={styles.labelSpan}>{t("basic.name")}</span>
          <input
            type="text"
            name="name"
            value={ctx.formData.name}
            onChange={handleChange}
            required
            className={styles.inputText}
          />
        </label>

        <label className={styles.label}>
          <span className={styles.labelSpan}>{t("basic.sex")}</span>

          <select name="gender" value={ctx.formData.gender} onChange={handleChange} className={styles.inputSelect}>
            <option value="male"> {t("basic.male")}</option>
            <option value="female"> {t("basic.female")}</option>
            <option value="other"> {t("basic.other")}</option>
          </select>
        </label>

        <div className={styles.label}>
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
          <span className={styles.labelSpan}>{t("basic.photo")}</span>
          <label htmlFor="image-upload" className={styles.imageUploadButton}>
            {t("basic.photoUpload")}
          </label>
        </div>
        <div className={`${styles.imagePreviewWrapper} ${imagePreviewURL ? "" : "bg-gray-300"}`}>
          {imagePreviewURL ? <img src={imagePreviewURL} alt="プレビュー" className={styles.imagePreviewImg} /> : null}
        </div>
        <div className={styles.submitButtonWrapperDiv}>
          <button type="submit" className={styles.submitButton} disabled={status === "loading"}>
            {status === "loading" ? t("isRegister") : t("register")}
          </button>
        </div>
      </form>
    </>
  );
}
