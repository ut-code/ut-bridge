"use client";

import { client } from "@/client";
import { fbUserAtom } from "@/features/auth/state";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Registration() {
  const [user] = useAtom(fbUserAtom);
  const router = useRouter();

  const [formData, setFormData] = useState<{
    name: string;
    isForeignStudent: boolean;
    displayLanguage: "japanese" | "english";
    campusId: string;
    grade: number;
    hobby: string;
    introduction: string;
    gender: "male" | "female" | "other";
  }>({
    name: "",
    isForeignStudent: false,
    displayLanguage: "japanese",
    campusId: "",
    grade: 1,
    hobby: "",
    introduction: "",
    gender: "male",
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

    try {
      if (user === null || user === undefined) {
        router.push("/login");
        return;
      }
      const body = {
        id: self.crypto.randomUUID(),
        guid: user.uid,
        imageUrl: "https://example.com/default-avatar.jpg",
        ...formData,
      };

      await client.users.$post({ json: body });

      setStatus("success");
    } catch (error) {
      console.error("ユーザー登録に失敗しました", error);
      setStatus("error");
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
          外国人留学生ですか？
          <input
            type="checkbox"
            name="isForeignStudent"
            checked={formData.isForeignStudent}
            onChange={handleChange}
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
            <option value="secret">秘密</option>
          </select>
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
