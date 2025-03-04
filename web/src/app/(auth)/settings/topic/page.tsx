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

        setFormData(formattedData);
      } catch (err) {
        console.error("Failed to fetch university or language Data ", err);
        router.push("/login");
      }
    };
    fetchMyData();
  }, [router, me]);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked, multiple } = e.target as HTMLInputElement;
    const { options } = e.target as HTMLSelectElement;

    setFormData((prev) => {
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

        <button type="submit" className="rounded bg-blue-500 p-2 text-white" disabled={status === "loading"}>
          {status === "loading" ? "登録中..." : "登録"}
        </button>
      </form>
    </div>
  );
}
