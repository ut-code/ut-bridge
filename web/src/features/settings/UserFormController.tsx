"use client";
import { client } from "@/client";
import Loading from "@/components/Loading.tsx";
import { formatCardUser } from "@/features/format";
import { useUserContext } from "@/features/user/userProvider";
import type { CreateUser, FlatCardUser, MYDATA } from "common/zod/schema.ts";
import { useLocale, useTranslations } from "next-intl";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRef } from "react";
import { useAuthContext } from "../auth/providers/AuthProvider.tsx";
import { upload } from "../image/ImageUpload.tsx";
import { useToast } from "../toast/ToastProvider.tsx";

export type Status = "ready" | "error" | "success" | "processing";

const resizeImage = (file: File, maxWidth = 800, maxHeight = 800): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        let { width, height } = img;

        // 比率を保ってリサイズ
        if (width > maxWidth || height > maxHeight) {
          const scale = Math.min(maxWidth / width, maxHeight / height);
          width *= scale;
          height *= scale;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas 2D context is not supported"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: file.type }));
          } else {
            reject(new Error("Blob conversion failed"));
          }
        }, file.type);
      };
      img.onerror = reject;
      const result = e.target?.result;
      if (typeof result === "string") {
        img.src = result;
      } else {
        reject(new Error("FileReader result is not a string"));
      }
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

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
  onSuccess: (data: Partial<MYDATA>) => void;
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
  loadPreviousData,
}: {
  children: React.ReactNode;
  loadPreviousData: boolean;
}) => {
  const t = useTranslations();
  const toast = useToast();
  const locale = useLocale();
  let me: MYDATA | null = null;
  const setMyData = useRef<((data: Partial<MYDATA>) => void) | null>(null);
  const [status, setStatus] = useState<Status>("ready");
  // HELP: how do I optionally use another context? loadPreviousData will never change
  if (loadPreviousData) {
    const usercx = useUserContext();
    me = usercx.me;
    setMyData.current = (data) => usercx.updateMyData((prev) => ({ ...prev, ...data }));
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

  // static データ取得（大学 & 言語）
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
      onSuccess(await res.json());
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

  // 大学固有の static データを取得
  useEffect(() => {
    if (!formData.universityId) return;
    const fetchCampusAndDivisions = async () => {
      console.log(`fetching university-specific data for university ${formData.universityId} ...`);
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
      }
      setLoadingUniversitySpecificData(false);
    };

    fetchCampusAndDivisions();
  }, [formData.universityId]);

  // ユーザー情報を取得
  useEffect(() => {
    const fetchMyData = async () => {
      try {
        if (!loadPreviousData) {
          setFormData({});
        } else {
          const meRes = await client.users.me.$get({ header: { Authorization } });
          if (!meRes.ok) {
            throw new Error("Failed to fetch user data!");
          }
          const me = await meRes.json();
          if (!me) {
            throw new Error("User Not Found in Database!");
          }

          console.log(
            `
            [useFormData] me = 
            defaultEmail: ${me.defaultEmail}
            customEmail: ${me.customEmail}
          `,
          );

          setFormData({
            ...me,
            defaultEmail: me.defaultEmail ?? undefined,
            customEmail: me.customEmail ?? undefined,
            imageUrl: me.imageUrl ?? undefined,
            universityId: me.campus.university.id,
            motherLanguageId: me.motherLanguage.id,
            fluentLanguageIds: me.fluentLanguages.map((entry) => entry.language.id),
            learningLanguageIds: me.learningLanguages.map((entry) => entry.language.id),
            campusId: me.campus.id,
            divisionId: me.division.id,
          });
        }
      } catch (err) {
        console.error("ユーザー情報の取得に失敗しました", err);
      }
    };

    fetchMyData();
  }, [loadPreviousData, Authorization]);

  const refetchFavoriteUsers = useCallback(async () => {
    try {
      if (!me) return;
      const res = await client.community.$get({
        header: { Authorization, sessionSeed: "" }, // we don't care about the order of users here
        query: {
          except: me.id,
          marker: "favorite",
        },
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      setFavoriteUsers(data.users.map((user) => formatCardUser(user, locale)));
    } catch (error) {
      console.error("お気に入りユーザーの取得に失敗しました", error);
    }
  }, [me, Authorization, locale]);

  const refetchBlockedUsers = useCallback(async () => {
    try {
      if (!me) return;
      const res = await client.community.$get({
        header: { Authorization, sessionSeed: "" }, // we don't care about how users are ordered here
        query: {
          except: me.id,
          marker: "blocked",
        },
      });

      if (!res.ok) {
        throw new Error(`ブロックユーザーの取得失敗: ${await res.text()}`);
      }

      const data = await res.json();
      setBlockedUsers(data.users.map((user) => formatCardUser(user, locale)));
    } catch (error) {
      console.error("ブロックユーザーの取得に失敗しました", error);
    }
  }, [me, Authorization, locale]);

  useEffect(() => {
    refetchFavoriteUsers();
    refetchBlockedUsers();
  }, [refetchFavoriteUsers, refetchBlockedUsers]);

  const onSuccess = useCallback(
    (data: Partial<MYDATA>) => {
      console.log("ok 1");
      toast.push({
        color: "success",
        message: t("settings.success"),
      });
      setMyData.current?.(data);
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

  if (formData.loading) return <Loading stage="formdata" />;
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
