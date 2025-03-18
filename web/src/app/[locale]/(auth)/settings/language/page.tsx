"use client";

import { client } from "@/client";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useUserFormContext } from "@/features/setting/UserFormController.tsx";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const { idToken: Authorization } = useAuthContext();
  const router = useRouter();
  const ctx = useUserFormContext();
  const { formData, languages } = ctx;
  const t = useTranslations("setting");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

      // 言語の選択（チェックボックス）
      if (name === "fluentLanguageIds" || name === "learningLanguageIds") {
        const updatedLanguages = checked
          ? [...(prev[name] ?? []), value] // 追加
          : prev[name]?.filter((id) => id !== value); // 削除

        return {
          ...prev,
          [name]: updatedLanguages,
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
        ...formData,
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
        {t("language.title")}
        <div className="w-6" />
      </div>
      <div className="max-w mx-10 my-5 p-4 sm:mx-0 sm:my-20">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="mt-5 flex flex-row justify-between sm:relative sm:my-4 sm:block sm:flex-none">
            {t("language.isForeign")}
            <input
              type="checkbox"
              name="isForeignStudent"
              checked={formData.isForeignStudent}
              onChange={handleChange}
              className="checkbox checkbox-lg bg-white sm:absolute sm:right-[47%]"
            />
          </label>

          <label className="my-4 flex items-center justify-between">
            {t("language.motherLanguage")}
            <select
              name="motherLanguageId"
              value={formData.motherLanguageId}
              onChange={handleChange}
              className="my-4 w-1/2 rounded-xl border border-gray-200 bg-white p-2"
              disabled={!languages.length}
            >
              {languages.map((language) => (
                <option key={language.id} value={language.id}>
                  {language.name}
                </option>
              ))}
            </select>
          </label>
          <div className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
            <p> {t("language.fluentLanguage")}</p>
            <div className="flex w-1/2 flex-wrap gap-2">
              {languages.map((language) => (
                <label key={language.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="fluentLanguageIds"
                    value={language.id}
                    checked={ctx.formData.fluentLanguageIds?.includes(language.id) ?? false}
                    onChange={handleChange}
                    className="accent-blue-500"
                  />
                  <span>{language.name}</span>
                </label>
              ))}
            </div>
            <div className="mt-5 flex flex-col sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
              <p className="w-1/2 text-left"> {t("language.learningLanguage")}</p>
              <div className=" flex w-1/2 flex-wrap gap-2">
                {languages.map((language) => (
                  <label key={language.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="learningLanguageIds"
                      value={language.id}
                      checked={formData.learningLanguageIds?.includes(language.id) ?? false}
                      onChange={handleChange}
                      className="accent-blue-500"
                    />
                    <span>{language.name}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="mt-15 w-1/2 rounded bg-blue-500 p-2 text-white sm:w-50"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? t("isRegister") : t("register")}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
