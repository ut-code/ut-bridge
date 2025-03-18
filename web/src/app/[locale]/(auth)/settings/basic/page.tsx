"use client";

import { client } from "@/client";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { upload } from "@/features/image/ImageUpload";
import { useUserFormContext } from "@/features/setting/UserFormController.tsx";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const router = useRouter();
  const t = useTranslations("setting");

  const ctx = useUserFormContext();
  const { idToken: Authorization } = useAuthContext();

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreviewURL, setImagePreviewURL] = useState<string | undefined>(ctx.formData.imageUrl);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    ctx.setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreviewURL(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    if (newImage) {
      ctx.formData.imageUrl = await upload(newImage);
      ctx.setFormData(ctx.formData); // update imageURL
    }

    try {
      const res = await client.users.me.$patch({
        header: { Authorization },
        json: { ...ctx.formData },
      });
      if (!res.ok) {
        throw new Error(`レスポンスステータス: ${res.status}, response: ${await res.text()}`);
      }
      setStatus("success");
      ctx.feedbackSuccess();
    } catch (error) {
      console.error("ユーザー情報の更新に失敗しました", error);
      setStatus("error");
      router.push("/login");
    }
  };

  return (
    <div className="max-w my-20 p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex items-center justify-between">
          {t("basic.name")}
          <input
            type="text"
            name="name"
            value={ctx.formData.name}
            onChange={handleChange}
            required
            className="my-4 w-1/2 rounded-xl border border-gray-500 bg-white p-2"
          />
        </label>

        <label className="flex items-center justify-between">
          {t("basic.sex")}

          <select
            name="gender"
            value={ctx.formData.gender}
            onChange={handleChange}
            className="my-4 w-1/2 rounded-xl border border-gray-500 bg-white p-2"
          >
            <option value="male"> {t("basic.male")}</option>
            <option value="female"> {t("basic.female")}</option>
            <option value="other"> {t("basic.other")}</option>
          </select>
        </label>

        <div className="my-4 flex justify-between">
          {t("basic.photo")}

          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
          <div
            className={`flex h-40 w-40 items-center justify-center rounded-lg ${imagePreviewURL ? "" : "bg-gray-300"}`}
          >
            {imagePreviewURL && <img src={imagePreviewURL} alt="プレビュー" className="rounded-lg object-cover" />}
          </div>
          <label htmlFor="image-upload" className="h-10 cursor-pointer rounded bg-blue-500 px-4 py-2 text-white">
            {t("basic.photoUpload")}
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="mt-15 w-50 rounded bg-blue-500 p-2 text-white"
            disabled={status === "loading"}
          >
            {status === "loading" ? t("isRegister") : t("register")}
          </button>
        </div>
      </form>
    </div>
  );
}
