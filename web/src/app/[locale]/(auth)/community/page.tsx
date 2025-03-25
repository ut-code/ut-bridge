"use client";
import { client } from "@/client";
import Loading from "@/components/Loading.tsx";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { formatCardUser } from "@/features/format";
import UserCard from "@/features/user/UserCard.tsx";
import { useUserContext } from "@/features/user/userProvider.tsx";
import { Link, useRouter } from "@/i18n/navigation.ts";
import { type Exchange, ExchangeSchema, type FlatCardUser, MarkerSchema } from "common/zod/schema";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

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
  const pathname = window.location.pathname.replace(PATHNAME_LANG_PREFIX_PATTERN, "/");
  if (str === "") return pathname;
  // isn't there better way to handle this?
  return `${pathname}?${str}`;
}
const PATHNAME_LANG_PREFIX_PATTERN = /^\/(en|ja)\//;

export default function Page() {
  const router = useRouter();
  const query = useQuery();
  const t = useTranslations("community");
  const locale = useLocale();

  // if null it's loading, if [] there's no more users
  const [users, setUsers] = useState<FlatCardUser[] | null>(null);
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
  const { idToken: Authorization } = useAuthContext();

  useEffect(() => {
    const ctl = new AbortController();
    setUsers(null);
    (async () => {
      try {
        const res = await client.community.$get(
          {
            query: {
              except: me.id,
              page: query.page.toString(),
              exchangeQuery: query.exchange,
              searchQuery: query.search,
              marker: query.marker === "favorite" ? "favorite" : "notBlocked",
            },
            header: { Authorization },
          },
          {
            init: {
              signal: ctl.signal,
            },
          },
        );
        const data = await res.json();
        const formattedUsers = data.users.map((user) => {
          return formatCardUser(user, locale);
        });
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
  }, [query.page, query.exchange, query.marker, query.search, me.id, Authorization, locale]);

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
  const [isFavoriteChecked, setIsFavoriteChecked] = useState(query.marker === "favorite");
  const [isExchangeChecked, setIsExchangeChecked] = useState(query.exchange !== "all");

  return (
    <>
      <div className="flex flex-col-reverse items-center gap-5 sm:flex-row sm:justify-between sm:px-30">
        <div className="mb-5 flex items-center sm:mb-0">
          <div>
            <button
              type="button"
              className={`btn mx-4 rounded-xl ${
                isFavoriteChecked ? " bg-tYellow text-white " : "bg-white text-tYellow"
              }`}
              onClick={() => {
                const newChecked = !isFavoriteChecked;
                setIsFavoriteChecked(newChecked);
                router.push(
                  createQueriedURL({
                    marker: newChecked ? "favorite" : "clear",
                  }),
                );
              }}
            >
              {t("favorite")}
            </button>
          </div>

          <div>
            <button
              type="button"
              className={`btn rounded-xl border ${isExchangeChecked ? " bg-tBlue text-white " : "bg-white text-tBlue"}`}
              onClick={() => {
                const newChecked = !isExchangeChecked;
                setIsExchangeChecked(newChecked);

                const amIForeignStudent = me.isForeignStudent;
                const filterQuery = amIForeignStudent ? "japanese" : "exchange";
                router.push(
                  createQueriedURL({
                    exchange: newChecked ? filterQuery : "all",
                  }),
                );
              }}
            >
              {t("filter")}
            </button>
          </div>
        </div>

        <div className="relative w-90">
          <AiOutlineSearch className="-translate-y-1/2 absolute top-1/2 right-4 text-gray-500" size={20} />
          <input
            type="search"
            id="user-search"
            name="q"
            placeholder={t("search")}
            value={rawSearchQuery}
            onChange={(e) => setRawSearchQuery(e.target.value)}
            className="w-full rounded-full border border-gray-400 bg-white p-2 pr-10 pl-5"
          />
        </div>
      </div>

      {users === null ? (
        <Loading stage="community.users" />
      ) : users.length === 0 ? (
        <div className="flex">
          <span className="mt-10 flex-1 text-center text-gray-400 text-lg">{t("noUser")}</span>
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
                    const resp = await client.users.markers.favorite[":targetId"].$put({
                      param: {
                        targetId: id,
                      },
                      header: { Authorization },
                    });
                    if (!resp.ok) throw new Error(`Bad status: got ${resp.status} with text "${await resp.text()}"`);
                  },
                  async unfavorite(id) {
                    const resp = await client.users.markers.favorite[":targetId"].$delete({
                      param: {
                        targetId: id,
                      },
                      header: { Authorization },
                    });
                    if (!resp.ok) throw new Error(`Bad status: got ${resp.status} with text "${await resp.text()}"`);
                  },
                  async unblock(id) {
                    const resp = await client.users.markers.blocked[":targetId"].$delete({
                      header: { Authorization },
                      param: { targetId: id },
                    });
                    if (!resp.ok) throw new Error(`Bad status: got ${resp.status} with text "${await resp.text()}"`);
                  },
                }}
              />
            </li>
          ))}
        </ul>
      )}

      <div className="mb-6 flex items-center justify-between gap-6 py-8 md:px-20">
        <div className="w-auto text-left">
          {query.page > 1 ? (
            <Link
              href={createQueriedURL({ page: query.page - 1 })}
              className="rounded bg-blue-200 px-6 py-3 hover:bg-blue-300"
            >
              {t("previousButton")}
            </Link>
          ) : (
            <Link
              href={createQueriedURL({ page: query.page - 1 })}
              className="invisible rounded bg-blue-200 px-6 py-3 hover:bg-blue-300"
            >
              {t("previousButton")}
            </Link>
          )}
        </div>

        <span className="text-center text-gray-700 text-lg">{totalUsers > 0 && `${query.page} / ${totalPages}`}</span>

        <div className="w-auto text-right">
          {query.page < totalPages ? (
            <Link
              href={createQueriedURL({ page: query.page + 1 })}
              className="rounded bg-blue-200 px-6 py-3 hover:bg-blue-300"
            >
              {t("nextButton")}
            </Link>
          ) : (
            <Link
              href={createQueriedURL({ page: query.page + 1 })}
              className="invisible rounded bg-blue-200 px-6 py-3 hover:bg-blue-300"
            >
              {t("nextButton")}
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
