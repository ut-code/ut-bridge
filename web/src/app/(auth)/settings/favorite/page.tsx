"use client";

import { useEffect, useState } from "react";
import { client } from "../../../../client.ts";
import type { CardUser } from "common/zod/schema.ts";
import { useUserContext } from "@/features/user/userProvider.tsx";
import { formatCardUser } from "@/features/format.ts";
import UserCard from "@/features/user/UserCard.tsx";

export default function Page() {
  const [users, setUsers] = useState<CardUser[] | null>(null);
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
              marker: "favorite",
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
  }, [me.id]);

  return (
    <>
      <div className="max-w my-10 p-4">
        <h1 className="mb-8 text-xl">お気に入りユーザー</h1>
        <ul className="m-5 grid w-full grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
          {users === null ? (
            <p>Loading...</p>
          ) : users.length === 0 ? (
            <p>お気に入りユーザーはいません。</p>
          ) : (
            users.map((user) => (
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
            ))
          )}
        </ul>
      </div>
    </>
  );
}
