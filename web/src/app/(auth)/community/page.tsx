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
  const [isExchangeEnabled, setIsExchangeEnabled] = useState(true);
  const [page, setPage] = useState(1); // 現在のページ
  const [totalUsers, setTotalUsers] = useState(0); // 総ユーザー数
  const usersPerPage = 9; // 1ページあたりのユーザー数
  const totalPages = Math.ceil(totalUsers / usersPerPage); // 総ページ数

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const myId = localStorage.getItem("utBridgeUserId");
        if (!myId) {
          throw new Error("User ID is not found! Please login again!");
        }
        const res = await client.community.$get({
          query: {
            id: myId,
            page: page.toString(),
            isExchangeEnabled: isExchangeEnabled.toString(), // 言語交換の状態を送る
          },
        });
        const data = await res.json();
        const formattedUsers = formatCardUsers(data.users);
        setUsers(formattedUsers);
        setTotalUsers(data.totalUsers); // 総ユーザー数を更新
      } catch (error) {
        console.error("Failed to fetch users:", error);
        router.push("/login");
      }
    };

    fetchUsers();
  }, [router, page, isExchangeEnabled]); // 言語交換の状態が変わったらリクエストを再送

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

      <label htmlFor="exchange-language">言語交換をする</label>
      <input
        id="exchange-language"
        type="checkbox"
        className="toggle"
        checked={isExchangeEnabled}
        onChange={() => {
          setIsExchangeEnabled((prev) => !prev);
          setPage(1); // 言語交換の設定を変更したらページをリセット
        }}
      />

      <ul>
        {users.map((user) => (
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
                  <p className="text-sm text-gray-600">
                    Foreign Student: {user.isForeignStudent ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="text-center my-4">
        <span className="text-gray-700">
          {totalUsers > 0 ? `Page ${page} of ${totalPages}` : "No users found"}
        </span>
      </div>

      <div className="flex justify-between mt-4 mx-20">
        <div className="w-1/2">
          {page > 1 && (
            <button
              type="button"
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-blue-200 rounded hover:bg-blue-300"
            >
              Previous
            </button>
          )}
        </div>
        <div className="w-1/2 flex justify-end">
          {page < totalPages && (
            <button
              type="button"
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-blue-200 rounded hover:bg-blue-300"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </>
  );
}
