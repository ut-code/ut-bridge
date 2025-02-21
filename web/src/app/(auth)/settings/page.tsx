"use client";

import { client } from "@/client";
import LoginBadge from "@/features/auth/components/LoginBadge";
import type { User } from "common/zod/schema";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [user, setUser] = useState<User | null>(null); //TODO: zoと合わせるt
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
        setUser(data[0]);
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
      <LoginBadge />
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
        <p>ID: {user.id}</p>
        <p>Name: {user.name || "N/A"}</p>
        <p>Gender: {user.gender || "N/A"}</p>
        <p>Is Foreign Student: {user.isForeignStudent ? "Yes" : "No"}</p>
        <p>Display Language: {user.displayLanguage}</p>
        <p>Campus ID: {user.campusId || "N/A"}</p>
        <p>Grade: {user.grade ?? "N/A"}</p>
        <p>Hobby: {user.hobby || "N/A"}</p>
        <p>Introduction: {user.introduction || "N/A"}</p>
      </div>
    </>
  );
}
