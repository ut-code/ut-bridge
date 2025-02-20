"use client";

import { client } from "@/client";
import { FB_SESSION_STORAGE_USER_KEY } from "@/features/auth/state";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Registration() {
  const router = useRouter();
  const [campuses, setCampuses] = useState<{ id: string; name: string }[]>([]);
  const [divisions, setDivisions] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [universities, setUniversities] = useState<
    { id: string; name: string }[]
  >([]);
  const [universityId, setUniversityId] = useState<string>("");

  useEffect(() => {
    const fetchFirstData = async () => {
      const res = await client.university.$get();
      const universities = await res.json();
      setUniversities(universities);
      if (!res.ok) {
        console.error(await res.text());
        throw new Error(`大学データの取得に失敗しました: ${res.status}`);
      }
    };
    fetchFirstData();
  }, []);

  useEffect(() => {
    if (!universityId) return;

    const fetchDataAfterSelectUniversity = async () => {
      try {
        const [campusRes, divisionRes] = await Promise.all([
          client.campus.$get({ query: { id: universityId } }),
          client.division.$get({ query: { id: universityId } }),
        ]);

        // どちらかが失敗した場合エラーハンドリング
        if (!campusRes.ok || !divisionRes.ok) {
          console.error("データ取得に失敗しました", {
            campus: campusRes.status,
            division: divisionRes.status,
          });
          throw new Error(
            `データ取得に失敗しました:${{
              campus: await campusRes.text(),
              division: await divisionRes.text(),
            }}`,
          );
        }

        const [campuses, divisions] = await Promise.all([
          campusRes.json(),
          divisionRes.json(),
        ]);

        setCampuses(campuses);
        setDivisions(divisions);
      } catch (error) {
        console.error("データ取得中にエラーが発生しました", error);
        setCampuses([]);
        setDivisions([]);
      }
    };

    fetchDataAfterSelectUniversity();
  }, [universityId]);

  const [formData, setFormData] = useState<{
    name: string;
    gender: "male" | "female" | "other";
    isForeignStudent: boolean;
    displayLanguage: "japanese" | "english";
    grade: number;
    universityId: string;
    divisionId: string;
    campusId: string;
    hobby: string;
    introduction: string;
  }>({
    name: "",
    gender: "male",
    isForeignStudent: false,
    displayLanguage: "japanese",
    grade: 1,
    universityId: "",
    divisionId: "",
    campusId: "",
    hobby: "",
    introduction: "",
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // 大学選択時に `universityId` を state にセット
    if (name === "universityId") {
      setUniversityId(value);
      setFormData((prev) => ({
        ...prev,
        campusId: "",
        divisionId: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    const data = sessionStorage.getItem(FB_SESSION_STORAGE_USER_KEY);
    const user = data ? JSON.parse(data) : null;
    try {
      const body = {
        id: self.crypto.randomUUID(),
        guid: user.uid,
        ...formData,
      };

      const res = await client.users.$post({ json: body });
      if (!res.ok) {
        console.error(await res.text());
        throw new Error(`レスポンスステータス: ${res.status}`);
      }

      setStatus("success");
      router.push("/community");
    } catch (error) {
      console.error("ユーザー登録に失敗しました", error);
      setStatus("error");
      router.push("/login");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">初期登録画面</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label>
          名前:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
        </label>

        <label>
          性別:
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="border p-2 w-full"
          >
            <option value="male">男性</option>
            <option value="female">女性</option>
            <option value="other">その他</option>
          </select>
        </label>

        <label>
          大学:
          <select
            name="universityId"
            value={formData.universityId}
            onChange={handleChange}
            className="border p-2 w-full"
          >
            <option value="">大学を選択してください</option>
            {universities.map((univ) => (
              <option key={univ.id} value={univ.id}>
                {univ.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          学部:
          <select
            name="campusId"
            value={formData.divisionId}
            onChange={handleChange}
            className="border p-2 w-full"
            disabled={!campuses.length}
          >
            <option value="">学部を選択してください</option>
            {divisions.map((division) => (
              <option key={division.id} value={division.id}>
                {division.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          キャンパス:
          <select
            name="campusId"
            value={formData.campusId}
            onChange={handleChange}
            className="border p-2 w-full"
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

        <label>
          学年:
          <input
            type="number"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            min={1}
            max={6}
            required
            className="border p-2 w-full"
          />
        </label>

        <label>
          言語設定:
          <select
            name="displayLanguage"
            value={formData.displayLanguage}
            onChange={handleChange}
            className="border p-2 w-full"
          >
            <option value="japanese">日本語</option>
            <option value="english">英語</option>
          </select>
        </label>

        <label>
          趣味:
          <input
            type="text"
            name="hobby"
            value={formData.hobby}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
        </label>

        <label>
          自己紹介:
          <input
            type="text"
            name="introduction"
            value={formData.introduction}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
        </label>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
          disabled={status === "loading"}
        >
          {status === "loading" ? "登録中..." : "登録"}
        </button>
      </form>
    </div>
  );
}
