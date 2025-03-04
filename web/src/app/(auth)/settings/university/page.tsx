"use client";

import { client } from "@/client";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { useUserContext } from "@/features/user/userProvider";
import type { CreateUser } from "common/zod/schema";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { fbUser: user } = useAuthContext();
  const router = useRouter();
  const [campuses, setCampuses] = useState<{ id: string; name: string }[]>([]);
  const [divisions, setDivisions] = useState<{ id: string; name: string }[]>([]);
  const [universities, setUniversities] = useState<{ id: string; name: string }[]>([]);
  const [universityId, setUniversityId] = useState<string>("");
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
  const { me } = useUserContext();

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        if (!me) {
          throw new Error("User Not Found in Database!");
        }
        const [universityRes, languageRes] = await Promise.all([client.university.$get(), client.language.$get()]);
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
        const [universities] = await Promise.all([universityRes.json()]);

        const formattedData = {
          id: me.id,
          imageUrl: me.imageUrl,
          guid: "",
          name: me.name,
          gender: me.gender,
          isForeignStudent: me.isForeignStudent,
          displayLanguage: me.displayLanguage,
          grade: me.grade,
          universityId: me.campus.universityId,
          divisionId: me.divisionId,
          campusId: me.campusId,
          hobby: me.hobby,
          introduction: me.introduction,
          motherLanguageId: me.motherLanguageId,
          fluentLanguageIds: me.fluentLanguages.map((lang: { language: { id: string } }) => lang.language.id),
          learningLanguageIds: me.learningLanguages.map((lang: { language: { id: string } }) => lang.language.id),
        };
        setUniversities(universities);
        setFormData(formattedData);
        setUniversityId(formattedData.universityId);
      } catch (err) {
        console.error("Failed to fetch university or language Data ", err);
        router.push("/login");
      }
    };
    fetchMyData();
  }, [router, me]);

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
        guid: user.uid,
      };
      const res = await client.users.me.$put({ json: body });
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
        <button type="submit" className="rounded bg-blue-500 p-2 text-white" disabled={status === "loading"}>
          {status === "loading" ? "登録中..." : "登録"}
        </button>
      </form>
    </div>
  );
}
