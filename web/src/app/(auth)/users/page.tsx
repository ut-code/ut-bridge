"use client";
import type { User } from "common/zod/schema";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { client } from "../../../client";

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    async function fetchUser() {
      try {
        if (!id) {
          throw new Error("User Id Not Found!");
        }
        const res = await client.users.$get({
          query: { id: id },
        });
        const data = await res.json();
        if (data.length !== 1) {
          throw new Error("User Not Found!");
        }
        setUser(data[0]);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        router.push("/community");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [router, id]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h1>User Page</h1>
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
      <p>Campus Name: {user.campus || "N/A"}</p>
      <p>Grade: {user.grade ?? "N/A"}</p>
      <p>Hobby: {user.hobby || "N/A"}</p>
      <p>Introduction: {user.introduction || "N/A"}</p>
    </div>
  );
}
