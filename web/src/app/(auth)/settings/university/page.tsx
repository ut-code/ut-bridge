"use client";

import { client } from "@/client";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { useUserFormContext } from "@/features/user/UserFormProvider";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const { fbUser: user } = useAuthContext();
  const router = useRouter();
  const { formData, setFormData, universities, divisions, campuses } = useUserFormContext();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked, multiple } = e.target as HTMLInputElement;
    const { options } = e.target as HTMLSelectElement;

    setFormData((prev) => {
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
      if (!user) throw new Error("User not found in Firebase!");

      const body = { ...formData, guid: user.uid };
      const res = await client.users.me.$patch({ json: body });

      if (!res.ok) throw new Error(`レスポンスステータス: ${res.status} - ${await res.text()}`);

      setStatus("success");
      window.location.href = "/settings";
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
        大学情報
        <div className="w-6" />
      </div>
      <div className="max-w mx-10 my-5 p-4 sm:mx-0 sm:my-20">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* University Selection */}
          <label className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
            大学:
            <select
              name="universityId"
              onChange={handleChange}
              value={formData.universityId}
              className="my-4 w-full rounded-xl border border-gray-200 bg-white p-2 sm:w-1/2"
            >
              <option value="">大学を選択してください</option>
              {universities.map((univ) => (
                <option key={univ.id} value={univ.id}>
                  {univ.name}
                </option>
              ))}
            </select>
          </label>

          {/* Division Selection */}
          <label className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
            学部:
            <select
              name="divisionId"
              value={formData.divisionId}
              onChange={handleChange}
              className="my-4 w-full rounded-xl border border-gray-200 bg-white p-2 sm:w-1/2"
              disabled={!divisions.length}
            >
              <option value="">学部を選択してください</option>
              {divisions.map((division) => (
                <option key={division.id} value={division.id}>
                  {division.name}
                </option>
              ))}
            </select>
          </label>

          {/* Campus Selection */}
          <label className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
            キャンパス:
            <select
              name="campusId"
              value={formData.campusId}
              onChange={handleChange}
              className="my-4 w-full rounded-xl border border-gray-200 bg-white p-2 sm:w-1/2"
              disabled={!campuses.length}
            >
              <option value="">キャンパスを選択してください</option>
              {campuses.map((campus) => (
                <option key={campus.id} value={campus.id}>
                  {campus.name}
                </option>
              ))}
            </select>
          </label>

          {/* Grade Selection */}
          <label className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
            学年:
            <select
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="my-4 w-full rounded-xl border border-gray-200 bg-white p-2 sm:w-1/2"
            >
              <option value="">学年を選択してください</option>
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
              className="mt-15 w-1/2 rounded bg-blue-500 p-2 text-white sm:w-50"
              disabled={status === "loading"}
            >
              {status === "loading" ? "登録中..." : "登録"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
