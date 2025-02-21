"use client";
import { formatCardUsers } from "@/features/format";
import type { CardUser } from "common/zod/schema";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { client } from "../../../client";

export default function Page() {
  const router = useRouter();
  const [users, setUsers] = useState<CardUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const myId = localStorage.getItem("utBridgeUserId");
        if (!myId) {
          throw new Error("User ID is not found! Please login again!");
        }
        const res = await client.community.$get({
          query: { id: myId },
        });
        const users = (await res.json()).users;
        const data = formatCardUsers(users);
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        router.push("/login");
      }
    };

    fetchUsers();
  }, [router]);

  // 検索クエリに基づいてユーザーをフィルタリング リクエストを送るのかは要検討
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(query) ||
      user.gender?.toLowerCase().includes(query) ||
      user.campus?.toLowerCase().includes(query) ||
      user.motherLanguage?.toLowerCase().includes(query) ||
      user.fluentLanguages.some((lang) => lang.toLowerCase().includes(query)) ||
      user.learningLanguages.some((lang) => lang.toLowerCase().includes(query))
    );
  });

  return (
    <>
      <h1>Community Page</h1>
      <label htmlFor="user-search">Search users:</label>
      <input
        type="search"
        id="user-search"
        name="q"
        placeholder="ユーザー検索..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 rounded-md"
      />
      <ul>
        {filteredUsers.map((user) => (
          <li key={user.id} className="p-4 border-b border-gray-200">
            <Link type="button" href={`/users/?id=${user.id}`}>
              <div className="flex items-center gap-4">
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
                <div>
                  <h2 className="text-lg font-semibold">
                    {user.name ?? "Unknown"}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Gender: {user.gender ?? "Unknown"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Campus: {user.campus ?? "Unknown"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Mother language: {user.motherLanguage || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Fluent Languages:{" "}
                    {user.fluentLanguages.join(", ") || "None"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Learning Languages:{" "}
                    {user.learningLanguages.join(", ") || "None"}
                  </p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
