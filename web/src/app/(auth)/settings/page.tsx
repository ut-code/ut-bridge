"use client";

import { client } from "@/client";
import LoginBadge from "@/features/auth/components/LoginBadge";
import { useGoogleLogout } from "@/features/auth/functions/logout.ts";
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
  const { logout } = useGoogleLogout();

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
      Settings Page
      <button type="button" className="m-5 btn btn-error" onClick={logout}>
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
