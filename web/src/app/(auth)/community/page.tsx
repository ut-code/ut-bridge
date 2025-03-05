"use client";
import Loading from "@/components/Loading.tsx";
import { formatCardUser } from "@/features/format";
import UserCard from "@/features/user/UserCard.tsx";
import { useUserContext } from "@/features/user/userProvider.tsx";
import { type CardUser, type Exchange, ExchangeSchema, MarkerSchema } from "common/zod/schema";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { client } from "../../../client.ts";

function useQuery() {
  const query = useSearchParams();
  const pageQuery = query.get("page");
  const page = Number.parseInt(pageQuery ?? "") || 1; // don't use `??`. it won't filter out NaN (and page won't be 0)

  const exchange = ExchangeSchema.safeParse(query.get("exchange")).data ?? "all";
  const search = query.get("search") ?? "";
  const marker = MarkerSchema.safeParse(query.get("marker")).data ?? undefined;
  return { page, exchange, search, marker };
}

function createQueriedURL(params: {
  exchange?: Exchange | undefined;
  page?: number | undefined;
  search?: string | undefined;
  marker?: "favorite" | "blocked" | "clear" | undefined; // "clear": set to none, undefined: leave untouched
}) {
  const current = new URLSearchParams(window.location.search);
  if (params.exchange) {
    if (params.exchange === "all") {
      current.delete("exchange");
    } else {
      current.set("exchange", params.exchange);
    }
  }
  if (params.page) {
    if (params.page === 1) {
      current.delete("page");
    } else {
      current.set("page", params.page.toString());
    }
  }
  if (params.search != null) {
    if (params.search === "") {
      current.delete("search");
    } else {
      current.set("search", params.search);
    }
  }
  if (params.marker) {
    if (params.marker === "clear") {
      current.delete("marker");
    } else {
      current.set("marker", params.marker);
    }
  }

  const str = current.toString();
  if (str === "") return window.location.pathname;
  // isn't there better way to handle this?
  return `${window.location.pathname}?${str}`;
}

export default function Page() {
  const router = useRouter();
  const query = useQuery();

  // if null it's loading, if [] there's no more users
  const [users, setUsers] = useState<CardUser[] | null>(null);
  const [rawSearchQuery, setRawSearchQuery] = useState("");
  const setDebouncedSearchQuery = useCallback((val: string) => {
    const url = createQueriedURL({ search: val });
    // router.replace(url); // this doesn't work?
    window.history.replaceState(null, "", url);
  }, []);

  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 15;
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
              myId: me.id,
              page: query.page.toString(),
              exchangeQuery: query.exchange,
              searchQuery: query.search,
              marker: query.marker,
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
  }, [query.page, query.exchange, query.marker, query.search, me.id]);

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
      <div className="flex flex-col-reverse items-center sm:flex-row sm:justify-between sm:px-30">
        <div className="mb-5 flex items-center sm:mb-0">
          <div className="filter">
            <input
              className="btn filter-reset"
              type="radio"
              name="metaframeworks"
              aria-label="All"
              onInput={() => {
                router.push(
                  createQueriedURL({
                    marker: "clear",
                  }),
                );
              }}
            />
            {["favorite" as const, "blocked" as const].map((select) => (
              <input
                key={select}
                className="btn mx-4 rounded-xl bg-white"
                type="radio"
                name="metaframeworks"
                aria-label={select === "favorite" ? "お気に入り" : "ブロック"}
                onInput={() => {
                  router.push(
                    createQueriedURL({
                      marker: select,
                    }),
                  );
                }}
              />
            ))}
          </div>
          <div>
            <input
              id="exchange-language"
              type="checkbox"
              className="btn rounded-xl bg-white"
              checked={query.exchange !== "all"}
              aria-label="留学生に限定"
              onChange={(ev) => {
                const filtered = ev.target.checked;
                const amIForeignStudent = me.isForeignStudent;
                const filterQuery = amIForeignStudent ? "japanese" : "exchange";
                router.push(createQueriedURL({ exchange: filtered ? filterQuery : "all" }));
              }}
            />
          </div>
        </div>

        <input
          type="search"
          id="user-search"
          name="q"
          placeholder="検索"
          value={rawSearchQuery}
          onChange={(e) => setRawSearchQuery(e.target.value)}
          className="mb-5 w-full rounded-full border border-gray-400 bg-white p-2 pl-5 sm:mb-0 sm:w-1/4"
        />
      </div>

      {users === null ? (
        <Loading stage="community.users" />
      ) : users.length === 0 ? (
        <div className="flex">
          <span className="mt-10 flex-1 text-center text-gray-400 text-lg">No users found</span>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:m-5 sm:grid-cols-1 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <li key={user.id}>
              <UserCard
                link={`/users?id=${user.id}`}
                user={user}
                on={{
                  async favorite(id) {
                    await client.users.markers.favorite[":targetId"].$put({
                      param: {
                        targetId: id,
                      },
                    });
                  },
                  async unfavorite(id) {
                    await client.users.markers.favorite[":targetId"].$delete({
                      param: {
                        targetId: id,
                      },
                    });
                  },
                }}
              />
            </li>
          ))}
        </ul>
      )}

      <div className="m-6 mb-6 flex items-center justify-between gap-6 px-10 py-8 md:px-20">
        <div className="w-auto">
          {query.page > 1 && (
            <Link
              href={createQueriedURL({
                page: query.page - 1,
              })}
              className="rounded bg-blue-200 px-6 py-3 hover:bg-blue-300"
            >
              前へ
            </Link>
          )}
        </div>

        <span className="text-center text-gray-700 text-lg">
          {totalUsers > 0 && `Page ${query.page} of ${totalPages}`}
        </span>

        <div className="w-auto">
          {query.page < totalPages && (
            <Link
              href={createQueriedURL({
                page: query.page + 1,
              })}
              className="rounded bg-blue-200 px-6 py-3 hover:bg-blue-300"
            >
              次へ
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
