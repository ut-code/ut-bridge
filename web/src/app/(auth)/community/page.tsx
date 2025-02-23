"use client";
import { formatCardUser } from "@/features/format";
import { useUserContext } from "@/features/user/userProvider.tsx";
import type { CardUser } from "common/zod/schema";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { client } from "../../../client.ts";

const exchangeSchema = z.enum(["all", "exchange", "japanese"]);
type Exchange = z.infer<typeof exchangeSchema>;

function useQuery() {
  const query = useSearchParams();
  // const query = new URLSearchParams(location.href);
  const pageQuery = query.get("page");
  const page = Number.parseInt(pageQuery ?? "") || 1; // don't use `??`. it won't filter out NaN (and page won't be 0)

  const exchange = exchangeSchema.safeParse(query.get("exchange"));
  const search = query.get("search") ?? "";
  return { page, exchange: exchange.data ?? "all", search };
}

function createQueriedURL(params: {
  exchange?: Exchange | undefined;
  page?: number | undefined;
  search?: string | undefined;
}) {
  const query = new URLSearchParams(window.location.search);
  if (params.exchange) {
    if (params.exchange === "all") {
      query.delete("exchange");
    } else {
      query.set("exchange", params.exchange);
    }
  }
  if (params.page) {
    if (params.page === 1) {
      query.delete("page");
    } else {
      query.set("page", params.page.toString());
    }
  }
  if (params.search != null) {
    if (params.search === "") {
      query.delete("search");
    } else {
      query.set("search", params.search);
    }
  }

  const str = query.toString();
  if (str === "") return window.location.pathname;
  // isn't there better way to handle this?
  return `${window.location.pathname}?${str}`;
}

export default function Page() {
  const router = useRouter();
  const query = useQuery();

  // if null it's loading, if [] there's no more users
  const [users, setUsers] = useState<CardUser[] | null>(null);
  const exchangeQuery = query.exchange;
  const searchQuery = query.search;
  const [rawSearchQuery, setRawSearchQuery] = useState("");
  const setDebouncedSearchQuery = useCallback((val: string) => {
    const url = createQueriedURL({ search: val });
    console.log("to:", url);
    // router.replace(url); // this doesn't work?
    window.history.replaceState(null, "", url);
  }, []);

  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 9;
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  const { me } = useUserContext();

  useEffect(() => {
    const ctl = new AbortController();
    setUsers(null);
    (async () => {
      try {
        const res = await client.community.$get(
          {
            query: {
              id: me.id,
              page: query.page.toString(),
              exchangeQuery,
              searchQuery,
            },
          },
          {
            init: {
              signal: ctl.signal,
            },
          },
        );
        const data = await res.json();
        const formattedUsers = data.users.map(formatCardUser);
        setUsers(formattedUsers);
        setTotalUsers(data.totalUsers);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Operation Aborted.");
          return;
        }
        console.error("Unknown Error fetching data:", err);
      }
    })();
    return () => {
      ctl.abort();
    };
  }, [query.page, exchangeQuery, searchQuery, me.id]);

  useEffect(() => {
    // 🔹 検索ワードの変更後に 500ms 待ってリクエストを送る（デバウンス処理）
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(rawSearchQuery);
      const url = createQueriedURL({ page: 1 });
      router.push(url); // 言語交換の設定を変更したらページをリセット
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [rawSearchQuery, router, setDebouncedSearchQuery]);

  return (
    <>
      <h1>Community Page</h1>
      <label htmlFor="user-search">Search users:</label>
      <input
        type="search"
        id="user-search"
        name="q"
        placeholder="ユーザー検索..."
        value={rawSearchQuery}
        onChange={(e) => setRawSearchQuery(e.target.value)}
        className="border p-2 rounded-md"
      />

      <label htmlFor="exchange-language">言語交換学生に限定する</label>
      <input
        id="exchange-language"
        type="checkbox"
        className="toggle"
        checked={exchangeQuery !== "all"}
        onChange={(ev) => {
          const filtered = ev.target.checked;
          const amIForeignStudent = me.isForeignStudent;
          const filterQuery = amIForeignStudent ? "japanese" : "exchange";
          router.push(
            createQueriedURL({ exchange: filtered ? filterQuery : "all" }),
          );
        }}
      />

      <ul>
        {users === null ? (
          <span>
            {/* TODO: make a skeleton UI s.t. the layout doesn't shift as much */}
            <span className="loading loading-bars loading-xl" />
            Loading...
          </span>
        ) : (
          users.map((user) => (
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
                      No Image
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
                      Fluent Languages:
                      {user.fluentLanguages.join(", ") || "None"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Learning Languages:
                      {user.learningLanguages.join(", ") || "None"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Foreign Student: {user.isForeignStudent ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>

      <div className="text-center my-4">
        <span className="text-gray-700">
          {totalUsers > 0
            ? `Page ${query.page} of ${totalPages}`
            : "No users found"}
        </span>
      </div>

      <div className="flex justify-between mt-4 mx-20">
        <div className="w-1/2">
          {query.page > 1 && (
            <Link
              href={createQueriedURL({
                page: query.page - 1,
              })}
              className="px-4 py-2 bg-blue-200 rounded hover:bg-blue-300"
            >
              Previous
            </Link>
          )}
        </div>
        <div className="w-1/2 flex justify-end">
          {query.page < totalPages && (
            <Link
              href={createQueriedURL({
                page: query.page + 1,
              })}
              className="px-4 py-2 bg-blue-200 rounded hover:bg-blue-300"
            >
              Next
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
