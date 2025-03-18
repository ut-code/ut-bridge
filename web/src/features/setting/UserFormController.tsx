"use client";
import { client } from "@/client";
import Loading from "@/components/Loading.tsx";
import { formatCardUser } from "@/features/format";
import { useUserContext } from "@/features/user/userProvider";
import type { CreateUser } from "common/zod/schema";
import type { CardUser } from "common/zod/schema";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuthContext } from "../auth/providers/AuthProvider.tsx";

type UserFormContextType = {
  formData: Partial<CreateUser>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<CreateUser>>>;
  feedbackSuccess: () => void;
  universities: { id: string; name: string }[];
  campuses: { id: string; name: string }[];
  divisions: { id: string; name: string }[];
  languages: { id: string; name: string }[];
  favoriteUsers: CardUser[];
  blockedUsers: CardUser[];
  refetchFavoriteUsers: () => void;
  refetchBlockedUsers: () => void;
};

const UserFormContext = createContext<UserFormContextType | undefined>(undefined);

export const useUserFormContext = () => {
  const context = useContext(UserFormContext);
  if (!context) {
    throw new Error("useUserFormContext must be used within a UserFormProvider");
  }
  return context;
};

export const UserFormProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { me } = useUserContext();
  const { idToken: Authorization } = useAuthContext();

  const [formData, setFormData] = useState<Partial<CreateUser>>({ id: "" });

  const [universities, setUniversities] = useState<{ id: string; name: string }[]>([]);
  const [campuses, setCampuses] = useState<{ id: string; name: string }[]>([]);
  const [divisions, setDivisions] = useState<{ id: string; name: string }[]>([]);
  const [languages, setLanguages] = useState<{ id: string; name: string }[]>([]);
  const [favoriteUsers, setFavoriteUsers] = useState<CardUser[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<CardUser[]>([]);

  // 一括データ取得（大学 & 言語）
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [universityRes, languageRes] = await Promise.all([client.university.$get(), client.language.$get()]);

        if (!universityRes.ok || !languageRes.ok) {
          throw new Error(
            `データ取得に失敗しました: {
              university: ${await universityRes.text()}
              language: ${await languageRes.text()}
            }`,
          );
        }

        const [universitiesData, languagesData] = await Promise.all([universityRes.json(), languageRes.json()]);

        setUniversities(universitiesData);
        setLanguages(languagesData);
      } catch (error) {
        console.error("大学・言語データの取得に失敗しました", error);
      }
    };

    fetchData();
  }, []);

  // ユーザー情報を取得
  useEffect(() => {
    const fetchMyData = async () => {
      try {
        if (!me) {
          throw new Error("User Not Found in Database!");
        }

        setFormData({
          imageUrl: me.imageUrl ?? undefined,
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
          fluentLanguageIds: me.fluentLanguages.map((entry) => entry.language.id),
          learningLanguageIds: me.learningLanguages.map((entry) => entry.language.id),
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
  const refetchFavoriteUsers = useCallback(async () => {
    try {
      if (!me) return;
      const res = await client.community.$get({
        header: { Authorization },
        query: {
          except: me.id,
          marker: "favorite",
        },
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      setFavoriteUsers(data.users.map(formatCardUser));
    } catch (error) {
      console.error("お気に入りユーザーの取得に失敗しました", error);
    }
  }, [me, Authorization]);

  const refetchBlockedUsers = useCallback(async () => {
    try {
      if (!me) return;
      const res = await client.community.$get({
        header: { Authorization },
        query: {
          except: me.id,
          marker: "blocked",
        },
      });

      if (!res.ok) {
        throw new Error(`ブロックユーザーの取得失敗: ${await res.text()}`);
      }

      const data = await res.json();
      setBlockedUsers(data.users.map(formatCardUser));
    } catch (error) {
      console.error("ブロックユーザーの取得に失敗しました", error);
    }
  }, [me, Authorization]);

  useEffect(() => {
    refetchFavoriteUsers();
    refetchBlockedUsers();
  }, [refetchFavoriteUsers, refetchBlockedUsers]);

  const feedbackSuccess = useCallback(() => {
    console.log("TODO: make it into the UI");
    console.log("SUCCESSFULLY SUBMITTED!!!");
  }, []);

  if (formData.id === "") return <Loading stage="formdata" />;
  return (
    <UserFormContext.Provider
      value={{
        feedbackSuccess,
        formData,
        setFormData,
        universities,
        campuses,
        divisions,
        languages,
        favoriteUsers,
        blockedUsers,
        refetchFavoriteUsers,
        refetchBlockedUsers,
      }}
    >
      {children}
    </UserFormContext.Provider>
  );
};
