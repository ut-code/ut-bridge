"use client";

import LoginBadge from "@/features/auth/components/LoginBadge";
import { useGoogleLogout } from "@/features/auth/functions/logout.ts";
import { useUserContext } from "@/features/user/userProvider.tsx";
import Image from "next/image";
import Link from "next/link";
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
      Settings Page
      <button type="button" className="btn btn-error m-5" onClick={logout}>
        log out
      </button>
      <div>
        <h1>自分のデータ</h1>
        {user.imageUrl ? (
          <Image
            src={user.imageUrl}
            alt={user.name ?? "User"}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300">aaa</div>
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
