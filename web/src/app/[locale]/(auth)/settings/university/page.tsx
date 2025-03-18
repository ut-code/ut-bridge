"use client";

import { client } from "@/client";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { useUserFormContext } from "@/features/setting/UserFormController.tsx";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const router = useRouter();
  const { idToken: Authorization } = useAuthContext();
  const ctx = useUserFormContext();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const t = useTranslations("setting");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked, multiple } = e.target as HTMLInputElement;
    const { options } = e.target as HTMLSelectElement;

    ctx.setFormData((prev) => {
      if (name === "universityId") {
        return { ...prev, universityId: value, campusId: "", divisionId: "" };
      }

      if (multiple) {
        const selectedValues = Array.from(options)
          .filter((option) => option.selected)
          .map((option) => option.value);
        return { ...prev, [name]: selectedValues };
      }

      return { ...prev, [name]: type === "checkbox" ? checked : value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const body = { ...ctx.formData };
      const res = await client.users.me.$patch({ header: { Authorization }, json: body });

      if (!res.ok) throw new Error(`レスポンスステータス: ${res.status} - ${await res.text()}`);

      setStatus("success");
      ctx.feedbackSuccess();
    } catch (error) {
      console.error("ユーザー登録に失敗しました", error);
      setStatus("error");
      router.push("/login");
    }
  };

  return (
    <div className="max-w my-20 p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex items-center justify-between">
          {t("university.univ")}
          <select
            name="universityId"
            onChange={handleChange}
            value={ctx.formData.universityId}
            className="my-4 w-1/2 rounded-xl border border-gray-500 bg-white p-2"
          >
            {ctx.universities.map((univ) => (
              <option key={univ.id} value={univ.id}>
                {univ.name}
              </option>
            ))}
          </select>
        </label>

        {/* Division Selection */}
        <label className="flex items-center justify-between">
          {t("university.divisions")}
          <select
            name="divisionId"
            value={ctx.formData.divisionId}
            onChange={handleChange}
            className="my-4 w-1/2 rounded-xl border border-gray-500 bg-white p-2"
            disabled={!ctx.divisions.length}
          >
            {ctx.divisions.map((division) => (
              <option key={division.id} value={division.id}>
                {division.name}
              </option>
            ))}
          </select>
        </label>

        {/* Campus Selection */}
        <label className="flex items-center justify-between">
          {t("university.campus")}

          <select
            name="campusId"
            value={ctx.formData.campusId}
            onChange={handleChange}
            className="my-4 w-1/2 rounded-xl border border-gray-500 bg-white p-2"
            disabled={!ctx.campuses.length}
          >
            {ctx.campuses.map((campus) => (
              <option key={campus.id} value={campus.id}>
                {campus.name}
              </option>
            ))}
          </select>
        </label>

        {/* Grade Selection */}
        <label className="flex items-center justify-between">
          {t("university.grade")}
          <select
            name="grade"
            value={ctx.formData.grade}
            onChange={handleChange}
            className="my-4 w-1/2 rounded-xl border border-gray-500 bg-white p-2"
          >
            <option value="B1">学部1年</option>
            <option value="B2">学部2年</option>
            <option value="B3">学部3年</option>
            <option value="B4">学部4年</option>
            <option value="M1">修士1年</option>
            <option value="M2">修士2年</option>
            <option value="D1">博士1年</option>
            <option value="D2">博士2年</option>
            <option value="D3">博士3年</option>
          </select>
        </label>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="mt-15 w-50 rounded bg-blue-500 p-2 text-white"
            disabled={status === "loading"}
          >
            {status === "loading" ? t("isRegister") : t("register")}
          </button>
        </div>
      </form>
    </div>
  );
}
