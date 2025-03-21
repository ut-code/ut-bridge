"use client";

import { client } from "@/client";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { upload } from "@/features/image/ImageUpload";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
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
    <>
      <div className="flex items-center justify-between border-gray-300 border-b p-4 text-xl sm:hidden">
        <Link href={"/settings"}>
          <ChevronLeft />
        </Link>
        {t("basic.title")}
        <div className="w-6" />
      </div>
      <div className="max-w mx-10 my-5 p-4 sm:mx-0 sm:my-20">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
            {t("basic.name")}
            <input
              type="text"
              name="name"
              value={ctx.formData.name}
              onChange={handleChange}
              required
              className="my-4 w-full rounded-xl border border-gray-200 bg-white p-2 sm:w-1/2"
            />
          </label>

          <label className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
            {t("basic.sex")}

            <select
              name="gender"
              value={ctx.formData.gender}
              onChange={handleChange}
              className="my-4 w-full rounded-xl border border-gray-200 bg-white p-2 sm:w-1/2"
            >
              <option value="male"> {t("basic.male")}</option>
              <option value="female"> {t("basic.female")}</option>
              <option value="other"> {t("basic.other")}</option>
            </select>
          </label>

          <div className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
            {t("basic.photo")}

            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
            <div
              className={`flex h-40 w-40 items-center justify-center rounded-lg ${imagePreviewURL ? "" : "bg-gray-300"}`}
            >
              {imagePreviewURL && <img src={imagePreviewURL} alt="プレビュー" className="rounded-lg object-cover" />}
            </div>
            <label
              htmlFor="image-upload"
              className="mt-5 flex h-10 cursor-pointer justify-center rounded bg-blue-400 px-4 py-2 text-white sm:mt-0 sm:flex-none"
            >
              {t("basic.photoUpload")}
            </label>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="mt-15 w-1/2 rounded bg-blue-500 p-2 text-white sm:w-50"
              disabled={status === "loading"}
            >
              {status === "loading" ? t("isRegister") : t("register")}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
