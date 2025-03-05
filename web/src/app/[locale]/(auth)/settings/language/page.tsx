"use client";

import { client } from "@/client";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { useUserFormContext } from "@/features/user/UserFormProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const { fbUser: user } = useAuthContext();
  const router = useRouter();
  const { formData, setFormData, languages } = useUserFormContext();

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked, multiple } = e.target as HTMLInputElement;
    const { options } = e.target as HTMLSelectElement;

    setFormData((prev) => {
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
          ? [...prev[name], value] // 追加
          : prev[name].filter((id) => id !== value); // 削除

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
      if (!user) throw new Error("User is not found in Firebase!");
      const body = {
        ...formData,
        guid: user.uid,
      };
      const res = await client.users.me.$patch({ json: body });
      if (!res.ok) {
        console.error(await res.text());
        throw new Error(`レスポンスステータス: ${res.status}`);
      }

      setStatus("success");
      window.location.href = "/settings";
    } catch (error) {
      console.error("ユーザー登録に失敗しました", error);
      setStatus("error");
      router.push("/login");
    }
  };

  return (
    <div className="max-w my-20 p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="relative my-4 block">
          外国人留学生ですか？
          <input
            type="checkbox"
            name="isForeignStudent"
            checked={formData.isForeignStudent}
            onChange={handleChange}
            className="checkbox checkbox-lg absolute right-[47%] bg-white"
          />
        </label>

        <label className="my-4 flex items-center justify-between">
          母国語
          <select
            name="motherLanguageId"
            value={formData.motherLanguageId}
            onChange={handleChange}
            className="my-4 w-1/2 rounded-xl border border-gray-500 bg-white p-2"
            disabled={!languages.length}
          >
            <option value="">母国語を選択してください</option>
            {languages.map((language) => (
              <option key={language.id} value={language.id}>
                {language.name}
              </option>
            ))}
          </select>
        </label>
        <div className="my-4 flex justify-between">
          <p>流暢に話せる言語（母国語を含む）</p>
          <div className="flex w-1/2 flex-wrap gap-2">
            {languages.map((language) => (
              <label key={language.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="fluentLanguageIds"
                  value={language.id}
                  checked={formData.fluentLanguageIds.includes(language.id)}
                  onChange={handleChange}
                  className="accent-blue-500"
                />
                <span>{language.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="my-4 flex w-full justify-between">
          <p className="w-1/2 text-left">勉強している言語</p>
          <div className=" flex w-1/2 flex-wrap gap-2">
            {languages.map((language) => (
              <label key={language.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="learningLanguageIds"
                  value={language.id}
                  checked={formData.learningLanguageIds.includes(language.id)}
                  onChange={handleChange}
                  className="accent-blue-500"
                />
                <span>{language.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="mt-15 w-50 rounded bg-blue-500 p-2 text-white"
            disabled={status === "loading"}
          >
            {status === "loading" ? "登録中..." : "登録"}
          </button>
        </div>
      </form>
    </div>
  );
}
