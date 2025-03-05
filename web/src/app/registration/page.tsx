"use client";

import { client } from "@/client";
import { auth } from "@/features/auth/config";
import { upload } from "@/features/image/ImageUpload";
// import { Upload } from "@/features/image/ImageUpload";
// import { assert } from "@/lib";
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
  const [page, setPage] = useState<string>("former");

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
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      let imageUrl = null;

      if (file) {
        imageUrl = await upload(file);
      }
      const body = {
        ...formData,
        id: self.crypto.randomUUID(),
        guid: user.uid,
        imageUrl: imageUrl,
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
    <>
      <div className="my-20 p-4 sm:mx-60">
        <h1 className="mx-5 mb-8 font-bold text-3xl sm:mx-0">初期登録</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {page === "former" ? (
            <div>
              <div className="my-10 px-15">
                <h2 className="font-bold text-xl">基本情報</h2>
                <label htmlFor="name" className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
                  名前
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="my-4 w-full rounded-xl border border-gray-500 bg-white p-2 sm:w-1/2"
                  />
                </label>

                <label htmlFor="gender" className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
                  性別
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="my-4 w-full rounded-xl border border-gray-500 bg-white p-2 sm:w-1/2"
                  >
                    <option value="male">男性</option>
                    <option value="female">女性</option>
                    <option value="other">その他</option>
                  </select>
                </label>
                <div className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
                  <span className="mb-5 sm:mb-0">写真</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />

                  <div
                    className={`flex h-40 w-40 items-center justify-center rounded-lg ${preview ? "" : "bg-gray-300"}`}
                  >
                    {preview ? <img src={preview} alt="プレビュー" className="rounded-lg object-cover" /> : null}
                  </div>

                  <label
                    htmlFor="image-upload"
                    className="mt-5 flex h-10 cursor-pointer justify-center rounded bg-blue-400 px-4 py-2 text-white sm:mt-0 sm:flex-none"
                  >
                    写真を登録
                  </label>
                </div>
              </div>

              <div className="my-10 px-15">
                <h2 className="font-bold text-xl">大学情報</h2>
                <label className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
                  大学
                  <select
                    name="universityId"
                    onChange={handleChange}
                    value={formData.universityId}
                    className="my-4 w-full rounded-xl border border-gray-500 bg-white p-2 sm:w-1/2"
                  >
                    <option value="">大学を選択してください</option>
                    {universities.map((univ) => (
                      <option key={univ.id} value={univ.id}>
                        {univ.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
                  学部
                  <select
                    name="divisionId"
                    value={formData.divisionId}
                    onChange={handleChange}
                    className="my-4 w-full rounded-xl border border-gray-500 bg-white p-2 sm:w-1/2"
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

                <label className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
                  キャンパス
                  <select
                    name="campusId"
                    value={formData.campusId}
                    onChange={handleChange}
                    className="my-4 w-full rounded-xl border border-gray-500 bg-white p-2 sm:w-1/2"
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

                <label className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
                  学年
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    className="my-4 w-full rounded-xl border border-gray-500 bg-white p-2 sm:w-1/2"
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
              </div>
              <div className="flex justify-end px-15">
                <button
                  type="button"
                  onClick={() => setPage("latter")}
                  className="btn borfer h-10 w-25 rounded-lg border-tBlue p-2 text-tBlue"
                >
                  次へ
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="my-10 px-15">
                <h2 className="font-bold text-xl">言語情報</h2>
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
              </div>

              <div className="my-10 px-15">
                <h2 className="font-bold text-xl">トピック</h2>
                <label htmlFor="hobby" className="my-4 flex justify-between">
                  趣味
                  <textarea
                    id="hobby"
                    name="hobby"
                    rows={5}
                    value={formData.hobby ?? ""}
                    onChange={handleChange}
                    required
                    className=" w-1/2 rounded-xl border border-gray-500 bg-white p-2"
                  />
                </label>

                <label htmlFor="introduction" className="my-4 flex items-center justify-between ">
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
              </div>
              <div className="flex justify-between px-15">
                <button
                  type="button"
                  onClick={() => setPage("former")}
                  className="btn borfer h-10 w-25 rounded-lg border-tBlue p-2 text-tBlue"
                >
                  前へ
                </button>
                {status === "idle" ? (
                  <button type="submit" className="btn h-10 w-25 rounded-lg bg-tBlue p-2 text-white">
                    登録
                  </button>
                ) : status === "loading" ? (
                  <button type="submit" className="btn btn-disabled h-10 rounded p-2 text-white" disabled>
                    登録中...
                  </button>
                ) : status === "success" ? (
                  <span className="btn btn-accent h-10 rounded p-2 text-white">登録成功</span>
                ) : status === "error" ? (
                  <span className="btn btn-error h-10 rounded p-2 text-white">失敗しました</span>
                ) : (
                  <></>
                )}
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  );
}
