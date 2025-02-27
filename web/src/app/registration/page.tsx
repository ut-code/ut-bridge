"use client";

import { client } from "@/client";
import { auth } from "@/features/auth/config";
import type { CreateUser } from "common/zod/schema";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const user = auth.currentUser;
  const [campuses, setCampuses] = useState<{ id: string; name: string }[]>([]);
  const [divisions, setDivisions] = useState<{ id: string; name: string }[]>([]);
  const [universities, setUniversities] = useState<{ id: string; name: string }[]>([]);
  const [universityId, setUniversityId] = useState<string>("");
  const [languages, setLanguages] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchFirstData = async () => {
      try {
        const [universityRes, languageRes] = await Promise.all([client.university.$get(), client.language.$get()]);
        if (!universityRes.ok || !languageRes.ok) {
          console.error("データ取得に失敗しました", {
            university: universityRes.status,
            language: languageRes.status,
          });
          throw new Error(
            `データ取得に失敗しました:
            university: ${await universityRes.text()}
            languages: ${await languageRes.text()}`,
          );
        }
        const [universities, languages] = await Promise.all([universityRes.json(), languageRes.json()]);
        setUniversities(universities);
        setLanguages(languages);
      } catch (err) {
        console.error("Failed to fetch university or language Data ", err);
        router.push("/login");
      }
    };
    fetchFirstData();
  }, [router]);

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
            `データ取得に失敗しました:
            campus: ${await campusRes.text()}
            division: ${await divisionRes.text()}
            `,
          );
        }

        const [campuses, divisions] = await Promise.all([campusRes.json(), divisionRes.json()]);

        setCampuses(campuses);
        setDivisions(divisions);
      } catch (err) {
        console.error("Failed to fetch campus or division Data ", err);
        router.push("/login");
      }
    };

    fetchDataAfterSelectUniversity();
  }, [universityId, router]);

  const [formData, setFormData] = useState<CreateUser>({
    id: "",
    imageUrl: null,
    guid: "",
    name: "",
    gender: "male",
    isForeignStudent: false,
    displayLanguage: "japanese",
    grade: "B1",
    universityId: "",
    divisionId: "",
    campusId: "",
    hobby: "",
    introduction: "",
    motherLanguageId: "",
    fluentLanguageIds: [],
    learningLanguageIds: [],
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked, multiple } = e.target as HTMLInputElement;
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
    try {
      if (!user) throw new Error("User is not found in Firebase!");
      const body = {
        ...formData,
        id: self.crypto.randomUUID(),
        guid: user.uid,
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
    <div className="mx-auto max-w-md p-4">
      <h1 className="mb-4 font-bold text-xl">初期登録画面</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label>
          名前:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border p-2"
          />
        </label>

        <label>
          性別:
          <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border p-2">
            <option value="male">男性</option>
            <option value="female">女性</option>
            <option value="other">その他</option>
          </select>
        </label>

        <label>
          大学:
          <select
            name="universityId"
            onChange={handleChange}
            value={formData.universityId}
            className="w-full border p-2"
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
            className="w-full border p-2"
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
            className="w-full border p-2"
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
          <select name="grade" value={formData.grade} onChange={handleChange} className="w-full border p-2">
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

        <label>
          表示言語設定:
          <select
            name="displayLanguage"
            value={formData.displayLanguage}
            onChange={handleChange}
            className="w-full border p-2"
          >
            <option value="japanese">日本語</option>
            <option value="english">英語</option>
          </select>
        </label>
        <label>
          外国人留学生ですか？
          <input type="checkbox" name="isForeignStudent" checked={formData.isForeignStudent} onChange={handleChange} />
        </label>

        <label>
          母国語:
          <select
            name="motherLanguageId"
            value={formData.motherLanguageId}
            onChange={handleChange}
            className="w-full border p-2"
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
            className="w-full border p-2"
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
            className="w-full border p-2"
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
            value={formData.hobby ?? ""}
            onChange={handleChange}
            required
            className="w-full border p-2"
          />
        </label>

        <label>
          自己紹介:
          <input
            type="text"
            name="introduction"
            value={formData.introduction ?? ""}
            onChange={handleChange}
            required
            className="w-full border p-2"
          />
        </label>

        {status === "idle" ? (
          <button type="submit" className="btn btn-primary rounded p-2 text-white">
            登録
          </button>
        ) : status === "loading" ? (
          <button type="submit" className="btn btn-disabled rounded p-2 text-white" disabled>
            登録中...
          </button>
        ) : status === "success" ? (
          <span className="btn btn-accent rounded p-2 text-white">登録成功</span>
        ) : status === "error" ? (
          <span className="btn btn-error rounded p-2 text-white">失敗しました</span>
        ) : (
          <></>
        )}
      </form>
    </div>
  );
}
