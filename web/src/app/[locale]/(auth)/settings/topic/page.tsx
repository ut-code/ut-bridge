"use client";

import { client } from "@/client";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { useUserFormContext } from "@/features/setting/UserFormController.tsx";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
    <>
      <div className="flex items-center justify-between border-gray-300 border-b p-4 text-xl sm:hidden">
        <Link href={"/settings"}>
          <ChevronLeft />
        </Link>
        {t("topic.title")}
        <div className="w-6" />
      </div>

      <div className="max-w mx-10 my-5 p-4 sm:mx-0 sm:my-20">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label htmlFor="hobby" className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
            {t("topic.hobby")}
            <textarea
              id="hobby"
              name="hobby"
              rows={5}
              value={ctx.formData.hobby ?? ""}
              onChange={handleChange}
              required
              className="my-4 w-full rounded-xl border border-gray-200 bg-white p-2 sm:w-1/2"
            />
          </label>

          <label
            htmlFor="introduction"
            className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between"
          >
            {t("topic.introduction")}

            <textarea
              id="introduction"
              name="introduction"
              rows={5}
              value={ctx.formData.introduction ?? ""}
              onChange={handleChange}
              required
              className="my-4 w-full rounded-xl border border-gray-200 bg-white p-2 sm:w-1/2"
            />
          </label>

          <div className="flex justify-end">
            <button
              type="submit"
              className="mt-15 w-1/2 rounded bg-blue-500 p-2 text-white sm:w-50"
              disabled={status === "loading"}
            >
              {status === "loading" ? t("isRegister") : t("register")}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
