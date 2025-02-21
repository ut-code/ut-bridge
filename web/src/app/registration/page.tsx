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
  const [languages, setLanguages] = useState<{ id: string; name: string }[]>(
    [],
  );

  useEffect(() => {
    const fetchFirstData = async () => {
      const [universityRes, languageRes] = await Promise.all([
        client.university.$get(),
        client.language.$get(),
      ]);
      if (!universityRes.ok || !languageRes.ok) {
        console.error("データ取得に失敗しました", {
          university: universityRes.status,
          language: languageRes.status,
        });
        throw new Error(
          `データ取得に失敗しました:${{
            university: await universityRes.text(),
            language: await languageRes.text(),
          }}`,
        );
      }
      const [universities, languages] = await Promise.all([
        universityRes.json(),
        languageRes.json(),
      ]);
      setUniversities(universities);
      setLanguages(languages);
    };
    fetchFirstData();
  }, []);

  useEffect(() => {
    if (!universityId) return;

    const fetchDataAfterSelectUniversity = async () => {
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
    };

    fetchDataAfterSelectUniversity();
  }, [universityId]);

  const [formData, setFormData] = useState<{
    // TODO://ZodのSchemaと共有する
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
    motherLanguageId: string;
    fluentLanguageIds: string[];
    learningLanguageIds: string[];
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
    motherLanguageId: "",
    fluentLanguageIds: [],
    learningLanguageIds: [],
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type, checked, multiple } =
      e.target as HTMLInputElement;
    const { options } = e.target as HTMLSelectElement;

    setFormData((prev) => {
      // 大学を変更した場合、関連するキャンパスと学部をリセット
      if (name === "universityId") {
        setUniversityId(value);
        return {
          ...prev,
          universityId: value,
          campusId: "",
          divisionId: "",
        };
      }

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
            name="divisionId"
            value={formData.divisionId}
            onChange={handleChange}
            className="border p-2 w-full"
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
          表示言語設定:
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
          母国語:
          <select
            name="motherLanguageId"
            value={formData.motherLanguageId}
            onChange={handleChange}
            className="border p-2 w-full"
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
        <label>
          流暢に話せる言語:
          <select
            name="fluentLanguageIds"
            value={formData.fluentLanguageIds}
            onChange={handleChange}
            className="border p-2 w-full"
            disabled={!languages.length}
            multiple
          >
            <option value="">流暢に話せる言語を選択してください</option>
            {languages.map((language) => (
              <option key={language.id} value={language.id}>
                {language.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          勉強している言語:
          <select
            name="learningLanguageIds"
            value={formData.learningLanguageIds}
            onChange={handleChange}
            className="border p-2 w-full"
            disabled={!languages.length}
            multiple
          >
            <option value="">勉強している言語を選択してください</option>
            {languages.map((language) => (
              <option key={language.id} value={language.id}>
                {language.name}
              </option>
            ))}
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
