"use client";

import { client } from "@/client";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { upload } from "@/features/image/ImageUpload";
import { useUserContext } from "@/features/user/userProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { fbUser: user } = useAuthContext();
  const router = useRouter();
  const { me } = useUserContext();
  const [formData, setFormData] = useState<{
    name: string;
    gender: "male" | "female" | "other";
    imageUrl: string;
  }>({
    name: "",
    gender: "male",
    imageUrl: "",
  });

  useEffect(() => {
    if (!me) {
      console.error("User Not Found in Database!");
      router.push("/login");
      return;
    }
    setFormData({
      name: me.name,
      gender: me.gender,
      imageUrl: me.imageUrl || "",
    });
    setPreview(me.imageUrl);
  }, [me, router]);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error("User is not found in Firebase!");
      router.push("/login");
      return;
    }

    let imageUrl = formData.imageUrl;
    if (file) {
      imageUrl = await upload(file);
    }

    try {
      const res = await client.users.me.$patch({
        json: { ...formData, imageUrl },
      });
      if (!res.ok) {
        throw new Error(`レスポンスステータス: ${res.status}`);
      }
      alert("編集が完了しました。");
    } catch (error) {
      console.error("ユーザー情報の更新に失敗しました", error);
      router.push("/login");
    }
  };

  return (
    <div className="max-w my-20 p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex items-center justify-between">
          名前
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="my-4 w-1/2 rounded-xl border border-gray-500 bg-white p-2"
          />
        </label>

        <label className="flex items-center justify-between">
          性別:
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="my-4 w-1/2 rounded-xl border border-gray-500 bg-white p-2"
          >
            <option value="male">男性</option>
            <option value="female">女性</option>
            <option value="other">その他</option>
          </select>
        </label>

        <div className="my-4 flex justify-between">
          <span>写真</span>
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
          <div className={`flex h-40 w-40 items-center justify-center rounded-lg ${preview ? "" : "bg-gray-300"}`}>
            {preview && <img src={preview} alt="プレビュー" className="rounded-lg object-cover" />}
          </div>
          <label htmlFor="image-upload" className="h-10 cursor-pointer rounded bg-blue-500 px-4 py-2 text-white">
            写真を登録
          </label>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="mt-15 w-50 rounded bg-blue-500 p-2 text-white">
            登録
          </button>
        </div>
      </form>
    </div>
  );
}
