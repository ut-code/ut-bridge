"use client";

import { client } from "@/client.ts";
import LoginBadge from "@/features/auth/components/LoginBadge";
import { useGoogleLogout } from "@/features/auth/functions/logout.ts";
import { useUserContext } from "@/features/user/userProvider.tsx";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatUser } from "../../../features/format.ts";

export default function Page() {
  const { logout } = useGoogleLogout();
  const { me } = useUserContext();

  if (!me) return <div>User not found</div>;
  const user = formatUser(me);

  return (
    <>
      <Link
        href={"/settings/profile"}
        className="text-primary text-2xl cursor-pointer px-4"
      >
        ユーザー編集画面へ
      </Link>
      <h2>写真アップロード</h2>
      <Upload />
      <h2>Settings Page</h2>
      <button type="button" className="m-5 btn btn-error" onClick={logout}>
        Log out
      </button>
      <div>
        <h1>自分のデータ</h1>
        {user.imageUrl ? (
          <Image
            src={user.imageUrl}
            alt={user.name ?? "User"}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
            No Image
          </div>
        )}
        <p>
          <strong>Name:</strong> {user.name || "N/A"}
        </p>
        <p>
          <strong>Gender:</strong> {user.gender || "N/A"}
        </p>
        <p>
          <strong>Is Foreign Student:</strong>{" "}
          {user.isForeignStudent ? "Yes" : "No"}
        </p>
        <p>
          <strong>Display Language:</strong> {user.displayLanguage}
        </p>
        <p>
          <strong>Campus Name:</strong> {user.campus || "N/A"}
        </p>
        <p>
          <strong>Grade:</strong> {user.grade ?? "N/A"}
        </p>
        <p>
          <strong>Division:</strong> {user.division ?? "N/A"}
        </p>
        <p>
          <strong>Mother Language:</strong> {user.motherLanguage ?? "N/A"}
        </p>
        <p>
          <strong>Fluent Languages:</strong>{" "}
          {user.fluentLanguages.length > 0
            ? user.fluentLanguages.join(", ")
            : "N/A"}
        </p>
        <p>
          <strong>Learning Languages:</strong>{" "}
          {user.learningLanguages.length > 0
            ? user.learningLanguages.join(", ")
            : "N/A"}
        </p>
        <p>
          <strong>Hobby:</strong> {user.hobby || "N/A"}
        </p>
        <p>
          <strong>Introduction:</strong> {user.introduction || "N/A"}
        </p>
      </div>
      <LoginBadge />
    </>
  );
}

function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files[0]) {
        setFile(e.target.files[0]);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const res = await client.image.upload.$get();
      const { url, fields, fileName } = await res.json();
      console.log(url, "🤩🤩🤩🤩🤩🤩");

      const formData = new FormData();
      for (const [key, value] of Object.entries(fields)) {
        formData.append(key, value as string);
      }
      formData.append("file", file);
      console.log(formData.get("file"), "⭐️⭐️⭐️⭐️⭐️⭐️");

      const uploadResponse = await fetch(url, {
        method: "PUT",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      setFileUrl(`https://ut-bridge.r2.cloudflarestorage.com/${fileName}`);
    } catch (error) {
      console.error("Upload error:", error);
      alert("ファイルのアップロードに失敗しました。");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button
        type="button"
        onClick={handleUpload}
        disabled={!file || uploading}
        className="px-4 py-2 bg-blue-200 rounded hover:bg-blue-300"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {fileUrl && (
        <p>
          Uploaded File:{" "}
          <a href={fileUrl} rel="noreferrer" target="_blank">
            View
          </a>
        </p>
      )}
    </div>
  );
}
