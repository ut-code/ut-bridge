"use client";
import { client } from "@/client";
import Loading from "@/components/Loading.tsx";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { formatUser } from "@/features/format";
import { useUserContext } from "@/features/user/userProvider.tsx";
import type { FlatUser } from "common/zod/schema";
import { useLocale } from "next-intl";
import Image from "next/image";
// import {Link} from "@/i18n/navigation.ts";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [user, setUser] = useState<FlatUser | null>(null);
  const { idToken: Authorization } = useAuthContext();
  const { me } = useUserContext();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const locale = useLocale();

  useEffect(() => {
    async function fetchUser() {
      try {
        if (!id) {
          throw new Error("User Id Not Found!");
        }
        const res = await client.users.$get({
          query: { id: id },
          header: { Authorization },
        });
        const data = await res.json();
        if (data.length >= 2) throw new Error(`got too many users: got ${data.length}`);

        const first = data[0];
        if (!first) {
          throw new Error("User Not Found!");
        }
        setUser(formatUser(first, locale));
      } catch (error) {
        console.error("Failed to fetch user:", error);
        router.push("/community");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [router, Authorization, id, locale]);

  const [markSpinner, setMarkSpinner] = useState(false);
  const [chatButtonState, setChatButtonState] = useState<"idle" | "searching" | "creating" | "created">("idle");

  function MarkerButton(props: {
    if: boolean;
    children: React.ReactNode;
    class: string;
    action: "favorite" | "block" | "unblock" | "unfavorite";
  }) {
    if (!props.if) return <></>;
    if (!user) return;
    return (
      <button
        type="button"
        className={props.class}
        onClick={async () => {
          setMarkSpinner(true);
          const args = {
            param: { targetId: user.id },
            header: { Authorization },
          };
          const resp =
            props.action === "favorite"
              ? await client.users.markers.favorite[":targetId"].$put(args)
              : props.action === "block"
                ? await client.users.markers.blocked[":targetId"].$put(args)
                : props.action === "unfavorite"
                  ? await client.users.markers.favorite[":targetId"].$delete(args)
                  : props.action === "unblock"
                    ? await client.users.markers.blocked[":targetId"].$delete(args)
                    : (props.action satisfies never);
          if (!resp.ok) throw new Error(`Failed to ${props.action} user: ${await resp.text()}`);
          setMarkSpinner(false);
          setUser({
            ...user,
            markedAs: props.action === "favorite" ? "favorite" : props.action === "block" ? "blocked" : undefined,
          });
          console.log(`${props.action}ed user`);
        }}
        disabled={markSpinner}
      >
        {markSpinner ? <span className="loading loading-spinner" /> : props.children}
      </button>
    );
  }

  if (loading) return <Loading stage="users.user" />;
  if (!user) return <div>User not found</div>;

  return (
    <div className="rounded-3xl p-16 sm:m-16 sm:bg-white">
      <div className="mb-10 flex flex-col items-center sm:flex-row sm:justify-around">
        {user.imageUrl ? (
          <Image
            src={user.imageUrl}
            alt={user.name ?? "User"}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full"
          />
        ) : (
          <div className="flex h-100 w-100 items-center justify-center rounded-full bg-gray-300">N/A</div>
        )}
        <div className="w-full sm:w-auto">
          <div className="flex flex-col items-center sm:items-start">
            <p className="mb-4 font-bold text-5xl">{user.name}</p>
            <p className="my-4 text-2xl">{user.gender}</p>
            <p className="my-4 text-2xl">{user.isForeignStudent ? "留学生" : " "}</p>
          </div>
          <div className="flex w-full justify-around sm:w-auto sm:justify-normal sm:gap-10 ">
            <span className="absolute w-15">
              {chatButtonState === "creating" ? (
                <span>
                  <span className="loading loading-spinner absolute" />
                  作成中...
                </span>
              ) : (
                chatButtonState === "searching" && (
                  <span>
                    <span className="loading loading-spinner " />
                    探し中...
                  </span>
                )
              )}
            </span>
            <button
              type="button"
              disabled={chatButtonState !== "idle"}
              onClick={async () => {
                setChatButtonState("searching");
                // find previous room
                const prevs = await (
                  await client.chat.rooms.dmwith[":user"].$get({
                    param: {
                      user: user.id,
                    },
                    header: { Authorization },
                  })
                ).json();
                console.log("previous chat rooms:", prevs);
                const prev = prevs[0];
                if (prev) {
                  router.push(`/chat/${prev.id}`);
                  return;
                }
                setChatButtonState("creating");
                // create new if it doesn't exist
                const res = await client.chat.rooms.$post({
                  json: {
                    members: [me.id, user.id],
                  },
                  header: { Authorization },
                });
                const room = await res.json();
                setChatButtonState("created");
                router.push(`/chat/${room.id}`);
              }}
              className="btn flex h-10 w-30 items-center justify-center bg-blue-500 text-white"
            >
              チャット
            </button>
            <MarkerButton
              if={user.markedAs !== "favorite"}
              class={"btn h-10 w-30 border-yellow-500 text-yellow-500"}
              action="favorite"
            >
              お気に入り
            </MarkerButton>
            <MarkerButton
              if={user.markedAs === "favorite"}
              class={"btn h-10 w-30 w-30 bg-yellow-500 text-white"}
              action="unfavorite"
            >
              お気に入りを解除
            </MarkerButton>
          </div>
        </div>
      </div>
      <div className="sm:mx-24">
        <div className="mt-24 mb-12">
          <h2 className="my-3 font-bold text-3xl underline decoration-2">大学情報</h2>
          <p className="my-3 text-lg">
            <strong>所属キャンパス </strong> {user.campus}
          </p>
          <p className="my-3 text-lg">
            <strong>学部・大学院 </strong> {user.division}
          </p>
          <p className="my-3 text-lg">
            <strong>学年 </strong> {user.grade}
          </p>
        </div>
        <div className="my-12">
          <h2 className="my-3 font-bold text-3xl underline decoration-2">言語 </h2>
          <p className="my-3 text-lg">
            <strong>母国語 </strong> {user.motherLanguage}
          </p>
          <p className="my-3 text-lg">
            <strong>流暢に話すことのできる言語 </strong> <br />
            {user.fluentLanguages.join(", ")}
          </p>
          <p className="my-3 text-lg">
            <strong>学びたい言語 </strong> <br />
            {user.learningLanguages.join(", ")}
          </p>
        </div>
        <div className="my-12">
          <h2 className="my-3 font-bold text-3xl underline decoration-2">トピック</h2>
          <p className="my-3 text-lg">
            <strong>趣味・好きなこと </strong>
            <br />
            {user.hobby}
          </p>
          <p className="my-3 text-lg">
            <strong>自己紹介 </strong>
            <br />
            {user.introduction}
          </p>
        </div>
        <div>
          <MarkerButton if={user.markedAs !== "blocked"} class="btn btn-error" action="block">
            ブロックする
          </MarkerButton>
          <MarkerButton if={user.markedAs === "blocked"} class="btn btn-neutral btn-soft" action="unblock">
            ブロックを解除する
          </MarkerButton>
        </div>
      </div>
    </div>
  );
}
