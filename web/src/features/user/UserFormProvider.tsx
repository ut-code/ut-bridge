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
  campuses: { id: string; name: string }[];
  divisions: { id: string; name: string }[];
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
  const [campuses, setCampuses] = useState<{ id: string; name: string }[]>([]);
  const [divisions, setDivisions] = useState<{ id: string; name: string }[]>([]);

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

  // 学部 & キャンパス データを取得
  useEffect(() => {
    if (!formData.universityId) return;

    const fetchCampusAndDivisions = async () => {
      try {
        const [campusRes, divisionRes] = await Promise.all([
          client.campus.$get({ query: { id: formData.universityId } }),
          client.division.$get({ query: { id: formData.universityId } }),
        ]);

        if (!campusRes.ok || !divisionRes.ok) {
          throw new Error("キャンパスまたは学部データの取得に失敗しました");
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

  return (
    <UserFormContext.Provider value={{ formData, setFormData, universities, campuses, divisions }}>
      {children}
    </UserFormContext.Provider>
  );
};
