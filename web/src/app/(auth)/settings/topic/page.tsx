"use client";

import { client } from "@/client";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { useUserFormContext } from "@/features/user/UserFormProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const { fbUser: user } = useAuthContext();
  const { formData, setFormData } = useUserFormContext();
  const router = useRouter();

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        <label htmlFor="hobby" className="my-4 flex justify-between">
          趣味
          <textarea
            id="hobby"
            name="hobby"
            rows={5}
            value={formData.hobby ?? ""}
            onChange={handleChange}
            required
            className="w-1/2 rounded-xl border border-gray-500 bg-white p-2"
          />
        </label>

        <label htmlFor="introduction" className="my-4 flex items-center justify-between">
          自己紹介
          <textarea
            id="introduction"
            name="introduction"
            rows={5}
            value={formData.introduction ?? ""}
            onChange={handleChange}
            required
            className="w-1/2 rounded-xl border border-gray-500 bg-white p-2"
          />
        </label>

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
