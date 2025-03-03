"use client";

import { client } from "@/client.ts";
import LoginBadge from "@/features/auth/components/LoginBadge";
import { useGoogleLogout } from "@/features/auth/functions/logout.ts";
import { useUserContext } from "@/features/user/userProvider.tsx";
import { assert } from "@/lib.ts";
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
      <Link href={"/settings/profile"} className="cursor-pointer px-4 text-2xl text-primary">
        ユーザー編集画面へ
      </Link>
      <h2>写真アップロード</h2>
      <Upload
        onUpdate={async (key) => {
          const readURL = await getReadURL(key);
          const res = await client.users.me.$patch({
            json: {
              imageURL: readURL,
            },
          });
          assert(res.ok, `response was not ok, got text ${await res.text()}`);
        }}
      />
      <h2>Settings Page</h2>
      <button type="button" className="btn btn-error m-5" onClick={logout}>
        log out
      </button>
      <div>
        <h1>自分のデータ</h1>
        {user.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={user.name ?? "your profile"}
            width={48}
            height={48}
            className="h-24 w-24 rounded-full object-contain"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300">No Image</div>
        )}
        <p>
          <strong>Name:</strong> {user.name || "N/A"}
        </p>
        <p>
          <strong>Gender:</strong> {user.gender || "N/A"}
        </p>
        <p>
          <strong>Is Foreign Student:</strong> {user.isForeignStudent ? "Yes" : "No"}
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
          <strong>Fluent Languages:</strong> {user.fluentLanguages.length > 0 ? user.fluentLanguages.join(", ") : "N/A"}
        </p>
        <p>
          <strong>Learning Languages:</strong>{" "}
          {user.learningLanguages.length > 0 ? user.learningLanguages.join(", ") : "N/A"}
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

function Upload({ onUpdate }: { onUpdate: (key: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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
      const res = await client.image.put.$get();
      const { url: putURL, fileName: key } = await res.json();
      console.log(putURL, "🤩🤩🤩🤩🤩🤩");

      // const formData = new FormData();
      // for (const [key, value] of Object.entries(fields)) {
      // formData.append(key, value);
      // }
      // formData.append("file", file);
      // console.log(formData.get("file"), "⭐⭐⭐⭐⭐⭐");

      const uploadResponse = await fetch(putURL, {
        method: "PUT",
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }
      console.log("upload response:", await uploadResponse.text());

      onUpdate(key);
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
        className="rounded bg-blue-200 px-4 py-2 hover:bg-blue-300"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}

export async function getReadURL(key: string) {
  const { url } = await (await client.image.get.$get({ query: { key } })).json();
  return url;
}
