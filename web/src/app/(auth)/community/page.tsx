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
  const [isMyForeignStudent, setIsMyForeignStudent] = useState<boolean>(true);
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
          query: { id: myId, page: page.toString() }, // ページ番号をリクエスト
        });
        const data = await res.json();
        const formattedUsers = formatCardUsers(data.users);
        const filteredCardUsers = formattedUsers.filter(
          (user) => user.id !== myId,
        );
        setUsers(filteredCardUsers);
        setTotalUsers(data.totalUsers); // 総ユーザー数を更新

        const myUser = formattedUsers.find((user) => user.id === myId);
        if (myUser) {
          setIsMyForeignStudent(myUser.isForeignStudent);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
        router.push("/login");
      }
    };

    fetchUsers();
  }, [router, page]); // ページが変わったら再取得

  // 検索クエリと toggle の状態に基づいてユーザーをフィルタリング
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      user.name?.toLowerCase().includes(query) ||
      user.gender?.toLowerCase().includes(query) ||
      user.campus?.toLowerCase().includes(query) ||
      user.motherLanguage?.toLowerCase().includes(query) ||
      user.fluentLanguages.some((lang) => lang.toLowerCase().includes(query)) ||
      user.learningLanguages.some((lang) => lang.toLowerCase().includes(query));

    const matchesExchange =
      !isExchangeEnabled ||
      (isMyForeignStudent !== null &&
        user.isForeignStudent !== isMyForeignStudent);

    return matchesQuery && matchesExchange;
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

      <label htmlFor="exchange-language">言語交換をする</label>
      <input
        id="exchange-language"
        type="checkbox"
        className="toggle"
        checked={isExchangeEnabled}
        onChange={() => setIsExchangeEnabled((prev) => !prev)}
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
                  <p className="text-sm text-gray-600">
                    Foreign Student: {user.isForeignStudent ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* ページ情報の表示 */}
      {totalUsers > 0 && (
        <div className="text-center my-4">
          <span className="text-gray-700">
            Page {page} of {totalPages}
          </span>
        </div>
      )}

      {/* ページネーションボタン */}
      {page > 1 && (
        <button
          type="button"
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Previous
        </button>
      )}
      {page < totalPages && (
        <button
          type="button"
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Next
        </button>
      )}
    </>
  );
}
