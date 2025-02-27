"use client";
import { formatCardUser } from "@/features/format";
import { useUserContext } from "@/features/user/userProvider.tsx";
import { type CardUser, type Exchange, ExchangeSchema, MarkerSchema } from "common/zod/schema";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { client } from "../../../client.ts";

function useQuery() {
  const query = useSearchParams();
  // const query = new URLSearchParams(location.href);
  const pageQuery = query.get("page");
  const page = Number.parseInt(pageQuery ?? "") || 1; // don't use `??`. it won't filter out NaN (and page won't be 0)

  const exchange = ExchangeSchema.safeParse(query.get("exchange")).data ?? "all";
  const search = query.get("search") ?? "";
  console.log(query.get("marker"));
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
        checked={query.exchange !== "all"}
        onChange={(ev) => {
          const filtered = ev.target.checked;
          const amIForeignStudent = me.isForeignStudent;
          const filterQuery = amIForeignStudent ? "japanese" : "exchange";
          router.push(createQueriedURL({ exchange: filtered ? filterQuery : "all" }));
        }}
      />

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
            className="btn"
            type="radio"
            name="metaframeworks"
            aria-label={select}
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
          ))
        )}
      </ul>

      <div className="text-center my-4">
        <span className="text-gray-700">
          {totalUsers > 0 ? `Page ${query.page} of ${totalPages}` : "No users found"}
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

type UserCardEvent = {
  favorite: (id: string) => Promise<void>;
  unfavorite: (id: string) => Promise<void>;
};

const DEV_EXTRA_QUERY_WAIT = 2000;
function UserCard({ user: init, on, link }: { user: CardUser; on: UserCardEvent; link: string }) {
  const [user, setUser] = useState(init);
  const [favoriteBtnLoading, setFavoriteBtnLoading] = useState(false);
  return (
    <div className={`flex indicator items-center gap-4 ${user.marker === "blocked" && "bg-gray-300"}`}>
      {favoriteBtnLoading ? (
        <span className="indicator-item loading loading-ring" />
      ) : user.marker === "favorite" ? (
        <button
          type="button"
          aria-label="marked as favorite"
          className="indicator-item badge bg-transparent text-yellow-400 text-xl"
          onClick={async () => {
            setFavoriteBtnLoading(true);
            await on.unfavorite(user.id);
            setUser({
              ...user,
              marker: undefined,
            });
            setTimeout(() => {
              setFavoriteBtnLoading(false);
            }, DEV_EXTRA_QUERY_WAIT);
          }}
        >
          ★
        </button>
      ) : user.marker === "blocked" ? (
        "blocked (todo: make it a button to unblock)"
      ) : (
        <button
          type="button"
          aria-label="mark as favorite"
          className="indicator-item badge bg-transparent text-black-700 text-xl"
          onClick={async () => {
            setFavoriteBtnLoading(true);
            await on.favorite(user.id);
            setUser({
              ...user,
              marker: "favorite",
            });
            // setFavoriteBtnLoading(false);
            setTimeout(() => {
              setFavoriteBtnLoading(false);
            }, DEV_EXTRA_QUERY_WAIT);
          }}
        >
          {/* this doesn't support blocking yet */}★
        </button>
      )}
      {user.imageUrl ? (
        <Image
          src={user.imageUrl}
          alt={user.name ?? "User"}
          width={48}
          height={48}
          className="w-12 h-12 rounded-full"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">No Image</div>
      )}
      <div>
        <h2 className="text-lg font-semibold">{user.name ?? "Unknown"}</h2>
        <p className="text-sm text-gray-600">Gender: {user.gender ?? "Unknown"}</p>
        <p className="text-sm text-gray-600">Campus: {user.campus ?? "Unknown"}</p>
        <p className="text-sm text-gray-600">Mother language: {user.motherLanguage || "Unknown"}</p>
        <p className="text-sm text-gray-600">
          Fluent Languages:
          {user.fluentLanguages.join(", ") || "None"}
        </p>
        <p className="text-sm text-gray-600">
          Learning Languages:
          {user.learningLanguages.join(", ") || "None"}
        </p>
        <p className="text-sm text-gray-600">Foreign Student: {user.isForeignStudent ? "Yes" : "No"}</p>
      </div>
      <Link className="btn btn-primary" href={link}>
        See page
      </Link>
    </div>
  );
}
