"use client";

import { client } from "@/client.ts";
import LoginBadge from "@/features/auth/components/LoginBadge";
import { Upload } from "@/features/image/ImageUpload.tsx";
import { useUserContext } from "@/features/user/userProvider.tsx";
import { assert } from "@/lib.ts";
import Link from "next/link";
import { formatUser } from "../../../features/format.ts";

export default function Page() {
  const { me } = useUserContext();

  const user = formatUser(me);

  return (
    <>
      <Link href={"/settings/profile"} className="cursor-pointer px-4 text-2xl text-primary">
        ユーザー編集画面へ
      </Link>
      <h2>写真アップロード</h2>
      <Upload
        onUpdate={async (url) => {
          const res = await client.users.me.$patch({
            json: {
              imageURL: url,
            },
          });
          assert(res.ok, `response was not ok, got text ${await res.text()}`);
        }}
      />
      <h2>Settings Page</h2>
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
