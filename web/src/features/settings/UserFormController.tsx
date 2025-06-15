"use client";

import { client } from "@/client";
import { getBlockedUsers, getFavoriteUsers } from "@/data/fetchers/fetch-relational-users.ts";
import { useUniversitySpecificData } from "@/data/formData.client.ts";
import { formatCardUser } from "@/features/format";
import type { CreateUser, FlatCardUser, MYDATA } from "common/zod/schema.ts";
import { useLocale, useTranslations } from "next-intl";
import { createContext, useCallback, useContext, useState } from "react";
import { useAuthContext } from "../auth/providers/AuthProvider.tsx";
import { upload } from "../image/ImageUpload.tsx";
import { resizeImage } from "../image/resize.ts";
import { useToast } from "../toast/ToastProvider.tsx";

export type Status = "ready" | "error" | "success" | "processing";

type UserFormContextType = {
  loadingUniversitySpecificData: boolean;
  formData: Partial<CreateUser>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<CreateUser>>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreviewURL: string | null;
  setImagePreviewURL: React.Dispatch<React.SetStateAction<string | null>>;
  handleImageFileChange: (file: File) => void;
  uploadImage: () => Promise<void>;
  onSuccess: (data: MYDATA) => void;
  onFailure: () => void;
  submitPatch: (e: React.FormEvent) => void;
  status: Status;
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
  globalData: { universities, languages },
  personalData,
}: {
  children: React.ReactNode;
  globalData: {
    universities: { id: string; jaName: string; enName: string }[];
    languages: { id: string; jaName: string; enName: string }[];
  };
  personalData: {
    savedData: MYDATA | null;
    blockedUsers: FlatCardUser[];
    favoriteUsers: FlatCardUser[];
  } | null;
}) => {
  const t = useTranslations();
  const toast = useToast();
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("ready");

  const { idToken: Authorization } = useAuthContext();

  const [image, setImage] = useState<File | null>(null);
  const [imagePreviewURL, setImagePreviewURL] = useState<string | null>(null);

  // need help: what the heck
  const [_userData, setUserData] = useState<MYDATA | null>(personalData?.savedData ?? null);
  const [formData, setFormData] = useState<Partial<CreateUser>>(() => {
    return {
      ...personalData?.savedData,
      imageUrl: personalData?.savedData?.imageUrl ?? undefined,
      customEmail: personalData?.savedData?.customEmail ?? undefined,
      universityId: personalData?.savedData?.campus.university.id ?? undefined,
      campusId: personalData?.savedData?.campus.id ?? undefined,
      divisionId: personalData?.savedData?.division.id ?? undefined,
      motherLanguageId: personalData?.savedData?.motherLanguage.id ?? undefined,
      fluentLanguageIds: personalData?.savedData?.fluentLanguages.map((lang) => lang.language.id) ?? [],
      learningLanguageIds: personalData?.savedData?.learningLanguages.map((lang) => lang.language.id) ?? [],
    };
  });

  const {
    campuses,
    divisions,
    loading: loadingUniversitySpecificData,
  } = useUniversitySpecificData(formData.universityId);

  const submitPatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.name.length > 30) {
      toast.push({
        color: "error",
        message: t("settings.error.name"),
      });
      return;
    }
    if (!formData.fluentLanguageIds?.length) {
      toast.push({
        color: "error",
        message: t("settings.error.fluentLanguageIds"),
      });
      return;
    }
    if (!formData.learningLanguageIds?.length) {
      toast.push({
        color: "error",
        message: t("settings.error.learningLanguageIds"),
      });
      return;
    }
    setStatus("processing");
    await uploadImage();

    try {
      const res = await client.users.me.$patch({
        header: { Authorization },
        json: formData,
      });
      if (!res.ok) {
        throw new Error(`レスポンスステータス: ${res.status}, response: ${await res.text()}`);
      }
      setStatus("success");
      const data = await res.json();
      onSuccess(data);
      setUserData(data);
    } catch (error) {
      console.error("ユーザー情報の更新に失敗しました", error);
      setStatus("error");
      onFailure();
    } finally {
      setTimeout(() => {
        setStatus("ready");
      }, 1000);
    }
  };

  const [favoriteUsers, setFavoriteUsers] = useState<FlatCardUser[]>(personalData?.favoriteUsers ?? []);
  const [blockedUsers, setBlockedUsers] = useState<FlatCardUser[]>(personalData?.blockedUsers ?? []);

  const refetchFavoriteUsers = useCallback(async () => {
    try {
      const data = await getFavoriteUsers(Authorization);
      setFavoriteUsers(data.users.map((user) => formatCardUser(user, locale)));
    } catch (error) {
      console.error("お気に入りユーザーの取得に失敗しました", error);
    }
  }, [Authorization, locale]);

  const refetchBlockedUsers = useCallback(async () => {
    try {
      const data = await getBlockedUsers(Authorization);
      setBlockedUsers(data.users.map((user) => formatCardUser(user, locale)));
    } catch (error) {
      console.error("ブロックユーザーの取得に失敗しました", error);
    }
  }, [Authorization, locale]);

  const onSuccess = useCallback(
    (data: MYDATA) => {
      toast.push({
        color: "success",
        message: t("settings.success"),
      });
      setUserData(data);
    },
    [toast, t],
  );
  const onFailure = useCallback(() => {
    toast.push({
      color: "error",
      message: t("settings.failed"),
    });
  }, [toast, t]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageFileChange(file);
    }
  };
  const handleImageFileChange = (file: File) => {
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreviewURL(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  const uploadImage = async () => {
    let resizedImage = image;
    if (image) {
      try {
        resizedImage = await resizeImage(image, 800, 800); // ← 好きなサイズに変更可
      } catch (e) {
        console.error("Image resize failed:", e);
      }
    }
    const url = resizedImage ? await upload(resizedImage) : undefined;
    formData.imageUrl = url; // don't delete this line, or you'll start to hate react like me
    setFormData((prev) => ({
      ...prev,
      imageUrl: url,
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
      if (name === "isForeignStudent") {
        return {
          ...prev,
          isForeignStudent: value === "true",
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

      if (type === "checkbox") {
        return {
          ...prev,
          [name]: checked,
        };
      }
      // 通常の入力フォーム
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  return (
    <UserFormContext.Provider
      value={{
        formData,
        setFormData,
        handleChange,
        handleImageChange,
        imagePreviewURL,
        setImagePreviewURL,
        handleImageFileChange,
        uploadImage,
        loadingUniversitySpecificData,
        onSuccess,
        onFailure,
        status,
        submitPatch,
        universities,
        campuses: campuses || [],
        divisions: divisions || [],
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
