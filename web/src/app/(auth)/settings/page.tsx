"use client";

import { client } from "@/client";
import LoginBadge from "@/features/auth/components/LoginBadge";
import { ManagedUpload } from "aws-sdk/clients/s3";
import type { User } from "common/zod/schema";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatUsers } from "../../../features/format.ts";

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const id = localStorage.getItem("utBridgeUserId");
    async function fetchUser() {
      try {
        if (!id) {
          throw new Error("My Id Not Found!");
        }
        const res = await client.users.$get({
          query: { id: id },
        });
        const data = await res.json();
        if (data.length !== 1) {
          throw new Error("My Data Not Found!");
        }
        const users = formatUsers(data);
        setUser(users[0]);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        router.push("./community");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [router]);
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;
  return (
    <>
      <Link
        href={"/settings/profile"}
        className="text-primary text-2xl cursor-pointer px-4"
      >
        ユーザー編集画面へ
      </Link>
      写真アップロード
      <Upload />
      Settings Page
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
            aaa
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
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    // バックエンドにリクエストして署名付きURLを取得
    const res = await client.image.upload.$get();
    const { url, fields, fileName } = await res.json();

    console.log(fields, "あああ");
    const formData = new FormData();
    for (const [key, value] of Object.entries(fields)) {
      formData.append(key, value as string);
    }
    formData.append("file", file);
    // const upload = new ManagedUpload({
    //   params: {
    //     Bucket: "ut-bridge",
    //     Key: formData.keys,
    //     Body:  formData
    //   },
    // });

    // Cloudflare R2 に直接アップロード
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });
    console.log(response);

    setFileUrl(`https://ut-bridge.r2.cloudflarestorage.com/${fileName}`);
    setUploading(false);
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
