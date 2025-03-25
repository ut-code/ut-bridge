"use client";

import { client } from "@/client";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { useUserFormContext } from "@/features/setting/UserFormController.tsx";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { styles } from "../shared-class.ts";

export default function Page() {
  const ctx = useUserFormContext();
  const { idToken: Authorization } = useAuthContext();
  const router = useRouter();
  const t = useTranslations("setting");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked, multiple } = e.target as HTMLInputElement;
    const { options } = e.target as HTMLSelectElement;

    ctx.setFormData((prev) => {
      // 複数選択の処理（言語選択）
      if (multiple) {
        const selectedValues = Array.from(options)
          .filter((option) => option.selected)
          .map((option) => option.value);

        return {
          ...prev,
          [name]: selectedValues,
        };
      }

      // 通常の入力フォーム（チェックボックス含む）
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
        ...ctx.formData,
      };
      const res = await client.users.me.$patch({ header: { Authorization }, json: body });
      if (!res.ok) {
        console.error(await res.text());
        throw new Error(`レスポンスステータス: ${res.status}`);
      }

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
      <label htmlFor="hobby" className={styles.label}>
        <span className={styles.labelSpan}>{t("topic.hobby")}</span>
        <textarea
          id="hobby"
          name="hobby"
          rows={5}
          value={ctx.formData.hobby ?? ""}
          onChange={handleChange}
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
          onChange={handleChange}
          required
          className={styles.inputTextarea}
        />
      </label>

      <div className={styles.submitButtonWrapperDiv}>
        <button type="submit" className={styles.submitButton} disabled={status === "loading"}>
          {status === "loading" ? t("isRegister") : t("register")}
        </button>
      </div>
    </form>
  );
}
