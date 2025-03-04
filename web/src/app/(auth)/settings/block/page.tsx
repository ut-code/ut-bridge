"use client";

import { formatCardUser } from "@/features/format.ts";
import UserCard from "@/features/user/UserCard.tsx";
import { useUserContext } from "@/features/user/userProvider.tsx";
import type { CardUser } from "common/zod/schema.ts";
import { useEffect, useState } from "react";
import { client } from "../../../../client.ts";

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
              marker: "blocked",
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
      <div>
        <h1>ブロックしているユーザー</h1>
      </div>

      <ul>
        {users === null ? (
          <p>Loading...</p>
        ) : users.length === 0 ? (
          <p>ブロックしているユーザーはありません。</p>
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
    </>
  );
}
