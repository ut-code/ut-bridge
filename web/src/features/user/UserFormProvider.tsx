"use client";
import { client } from "@/client";
import { useUserContext } from "@/features/user/userProvider";
import type { CreateUser } from "common/zod/schema";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

// Contextの型定義
interface UserFormContextType {
  formData: CreateUser;
  setFormData: React.Dispatch<React.SetStateAction<CreateUser>>;
  universities: { id: string; name: string }[];
}

// Contextの作成
const UserFormContext = createContext<UserFormContextType | undefined>(undefined);

// Contextを利用するカスタムフック
export const useUserFormContext = () => {
  const context = useContext(UserFormContext);
  if (!context) {
    throw new Error("useUserFormContext must be used within a UserFormProvider");
  }
  return context;
};

// Provider コンポーネント
export const UserFormProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { me } = useUserContext();

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

  const [universities, setUniversities] = useState<{ id: string; name: string }[]>([]);

  // 大学データを取得
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await client.university.$get();
        if (!res.ok) throw new Error(`大学データ取得失敗: ${await res.text()}`);
        setUniversities(await res.json());
      } catch (error) {
        console.error("大学データの取得に失敗しました", error);
      }
    };

    fetchUniversities();
  }, []);

  // ユーザー情報を取得
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

        setFormData({
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
        });
      } catch (err) {
        console.error("ユーザー情報の取得に失敗しました", err);
        router.push("/login");
      }
    };

    fetchMyData();
  }, [me, router]);

  return (
    <UserFormContext.Provider value={{ formData, setFormData, universities }}>{children}</UserFormContext.Provider>
  );
};
