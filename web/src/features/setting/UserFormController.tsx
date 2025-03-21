"use client";
import { client } from "@/client";
import Loading from "@/components/Loading.tsx";
import { formatCardUser } from "@/features/format";
import { type MYDATA, useUserContext } from "@/features/user/userProvider";
import type { CreateUser, FlatCardUser } from "common/zod/schema";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuthContext } from "../auth/providers/AuthProvider.tsx";
import { upload } from "../image/ImageUpload.tsx";

type UserFormContextType = {
  loadingUniversitySpecificData: boolean;
  formData: Partial<CreateUser>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<CreateUser>>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreviewURL: string | null;
  uploadImage: () => Promise<void>;
  feedbackSuccess: () => void;
  universities: { id: string; jaName: string; enName: string }[];
  campuses: { id: string; jaName: string; enName: string }[];
  divisions: { id: string; jaName: string; enName: string }[];
  languages: { id: string; jaName: string; enName: string }[];
  favoriteUsers: FlatCardUser[];
  blockedUsers: FlatCardUser[];
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
  loadPreviousData,
}: {
  children: React.ReactNode;
  loadPreviousData: boolean;
}) => {
  const router = useRouter();
  let me: MYDATA | null = null;
  // HELP: how do I optionally use another context? loadPreviousData will never change
  if (loadPreviousData) {
    me = useUserContext().me;
  }
  const { idToken: Authorization } = useAuthContext();

  const [formData, setFormData] = useState<Partial<CreateUser & { loading: true }>>({ loading: true });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreviewURL, setImagePreviewURL] = useState<string | null>(null);

  const [universities, setUniversities] = useState<{ id: string; jaName: string; enName: string }[]>([]);
  const [campuses, setCampuses] = useState<{ id: string; jaName: string; enName: string }[]>([]);
  const [divisions, setDivisions] = useState<{ id: string; jaName: string; enName: string }[]>([]);
  const [languages, setLanguages] = useState<{ id: string; jaName: string; enName: string }[]>([]);
  const [favoriteUsers, setFavoriteUsers] = useState<FlatCardUser[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<FlatCardUser[]>([]);
  const [loadingUniversitySpecificData, setLoadingUniversitySpecificData] = useState(false);

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

  // 学部 & キャンパス データを取得
  useEffect(() => {
    console.log(`fetching university-specific data for university ${formData.universityId} ...`);
    if (!formData.universityId) return;

    const fetchCampusAndDivisions = async () => {
      setLoadingUniversitySpecificData(true);
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
        router.push("/login"); // ???
      }
      setLoadingUniversitySpecificData(false);
    };

    fetchCampusAndDivisions();
  }, [formData.universityId, router]);

  // ユーザー情報を取得
  useEffect(() => {
    const fetchMyData = async () => {
      try {
        if (!loadPreviousData) {
          setFormData({});
        } else {
          if (!me) {
            throw new Error("User Not Found in Database!");
          }

          setFormData({
            imageUrl: me.imageUrl ?? undefined,
            name: me.name,
            gender: me.gender,
            isForeignStudent: me.isForeignStudent,
            grade: me.grade,
            universityId: me.campus.university.id,
            divisionId: me.division.id,
            campusId: me.campus.id,
            hobby: me.hobby,
            introduction: me.introduction,
            motherLanguageId: me.motherLanguage.id,
            fluentLanguageIds: me.fluentLanguages.map((entry) => entry.language.id),
            learningLanguageIds: me.learningLanguages.map((entry) => entry.language.id),
          });
        }
      } catch (err) {
        console.error("ユーザー情報の取得に失敗しました", err);
        router.push("/login");
      }
    };

    fetchMyData();
  }, [me, loadPreviousData, router]);

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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviewURL(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const uploadImage = async () => {
    const url = image ? await upload(image) : undefined;
    formData.imageUrl = url; // don't delete this line, or you'll start to hate react like me
    setFormData((prev) => ({
      ...prev,
      imageURL: url,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked, multiple } = e.target as HTMLInputElement;
    const { options } = e.target as HTMLSelectElement;

    setFormData((prev) => {
      // 大学を変更した場合、関連するキャンパスと学部をリセット
      if (name === "universityId") {
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
          ? [...(prev[name] ?? []), value] // 追加
          : prev[name]?.filter((id) => id !== value); // 削除

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

  if (formData.loading) return <Loading stage="formdata" />;
  return (
    <UserFormContext.Provider
      value={{
        formData,
        setFormData,
        handleChange,
        handleImageChange,
        imagePreviewURL,
        uploadImage,
        loadingUniversitySpecificData,
        feedbackSuccess,
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
