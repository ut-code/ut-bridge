"use client";

import { client } from "@/client";
import { FB_SESSION_STORAGE_USER_KEY } from "@/features/auth/state";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Registration() {
  const router = useRouter();

  const [formData, setFormData] = useState<{
    //TODO:型をserverのZodで共有する
    imageUrl?: string; //TODO
    name: string;
    gender: "male" | "female" | "other";
    isForeignStudent: boolean;
    displayLanguage: "japanese" | "english";
    grade: number;
    divisionId: string;
    campusId: string;
    hobby: string;
    introduction: string;
    fluentLanguageIds: string[];
    learningLanguageIds: string[];
    motherTongueLanguageIds: string[];
  }>({
    imageUrl: "",
    name: "",
    gender: "male",
    isForeignStudent: false,
    displayLanguage: "japanese",
    grade: 1,
    divisionId: "",
    campusId: "",
    hobby: "",
    introduction: "",
    fluentLanguageIds: [],
    learningLanguageIds: [],
    motherTongueLanguageIds: [],
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
          キャンパスID:
          <input
            type="text"
            name="campusId"
            value={formData.campusId}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
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
          外国人留学生ですか？
          <input
            type="checkbox"
            name="isForeignStudent"
            checked={formData.isForeignStudent}
            onChange={handleChange}
          />
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

        {status === "success" && (
          <p className="text-green-500">登録が完了しました！</p>
        )}
        {status === "error" && (
          <p className="text-red-500">登録に失敗しました。</p>
        )}
      </form>
    </div>
  );
}
