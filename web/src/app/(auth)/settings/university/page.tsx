"use client";

import { client } from "@/client";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { useUserFormContext } from "@/features/user/UserFormProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { fbUser: user } = useAuthContext();
  const router = useRouter();

  const [universities, setUniversities] = useState<{ id: string; name: string }[]>([]);
  const [campuses, setCampuses] = useState<{ id: string; name: string }[]>([]);
  const [divisions, setDivisions] = useState<{ id: string; name: string }[]>([]);

  const { formData, setFormData } = useUserFormContext();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await client.university.$get();
        if (!res.ok) throw new Error(`大学データ取得失敗: ${await res.text()}`);

        setUniversities(await res.json());
      } catch (error) {
        console.error(error);
      }
    };

    fetchUniversities();
  }, []);

  useEffect(() => {
    if (!formData.universityId) return;

    const fetchCampusAndDivisions = async () => {
      try {
        const [campusRes, divisionRes] = await Promise.all([
          client.campus.$get({ query: { id: formData.universityId } }),
          client.division.$get({ query: { id: formData.universityId } }),
        ]);

        if (!campusRes.ok || !divisionRes.ok) {
          console.error("データ取得に失敗しました", {
            campus: campusRes.status,
            division: divisionRes.status,
          });
          throw new Error("データ取得に失敗しました");
        }

        setCampuses(await campusRes.json());
        setDivisions(await divisionRes.json());
      } catch (error) {
        console.error(error);
        router.push("/login");
      }
    };

    fetchCampusAndDivisions();
  }, [formData.universityId, router]);

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
    <div className="max-w my-20 p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* University Selection */}
        <label className="flex items-center justify-between">
          大学:
          <select
            name="universityId"
            onChange={handleChange}
            value={formData.universityId}
            className="my-4 w-1/2 rounded-xl border border-gray-500 bg-white p-2"
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
        <label className="flex items-center justify-between">
          学部:
          <select
            name="divisionId"
            value={formData.divisionId}
            onChange={handleChange}
            className="my-4 w-1/2 rounded-xl border border-gray-500 bg-white p-2"
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
        <label className="flex items-center justify-between">
          キャンパス:
          <select
            name="campusId"
            value={formData.campusId}
            onChange={handleChange}
            className="my-4 w-1/2 rounded-xl border border-gray-500 bg-white p-2"
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
        <label className="flex items-center justify-between">
          学年:
          <select
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            className="my-4 w-1/2 rounded-xl border border-gray-500 bg-white p-2"
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
