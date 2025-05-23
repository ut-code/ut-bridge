"use client";
import { client } from "@/client";
import Avatar from "@/components/Avatar";
import Loading from "@/components/Loading.tsx";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { formatUser } from "@/features/format";
import { useUserContext } from "@/features/user/userProvider.tsx";
import type { FlatUser } from "common/zod/schema";
import { useLocale, useTranslations } from "next-intl";
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
  const t = useTranslations();

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
        <div className="">
          <Avatar src={user.imageUrl} alt={user.name} size={300} className="h-12 w-12 rounded-full" />
        </div>
        <div className="w-full sm:w-auto">
          <div className="flex flex-col items-center sm:items-start">
            <p className="mb-4 break-all font-bold text-5xl">{user.name}</p>
            <p className="my-4 text-2xl">{t(`users.${user.gender}`)}</p>
            <p className="my-4 text-2xl">{user.isForeignStudent ? t("users.foreignStudent") : " "}</p>
          </div>
          {user.markedAs !== "blocked" && (
            <div className="flex w-full flex-wrap justify-around sm:w-auto sm:justify-normal sm:gap-10 ">
              <button
                type="button"
                disabled={chatButtonState !== "idle"}
                onClick={async () => {
                  setChatButtonState("searching");
                  // find previous room
                  const resp = await client.chat.rooms.dmwith[":user"].$get({
                    param: {
                      user: user.id,
                    },
                    header: { Authorization },
                  });
                  if (!resp.ok) throw new Error("failed to find room");
                  const prevs = await resp.json();
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
                  if (!res.ok) throw new Error(`res is not ok; text: ${await res.text()}`);
                  const room = await res.json();
                  setChatButtonState("created");
                  router.push(`/chat/${room.id}`);
                }}
                className="btn flex h-10 w-30 items-center justify-center bg-tBlue text-white"
              >
                {chatButtonState === "creating" ? (
                  <span>
                    <span className="loading loading-spinner" />
                    {/* 作成中... */}
                  </span>
                ) : chatButtonState === "searching" ? (
                  <span>
                    <span className="loading loading-spinner " />
                    {/* 探し中... */}
                  </span>
                ) : (
                  t("users.chatButton")
                )}
              </button>
              <MarkerButton
                if={user.markedAs !== "favorite"}
                class={"btn h-10 w-30 border-tYellow bg-white text-tYellow"}
                action="favorite"
              >
                {t("users.favoriteButton")}
              </MarkerButton>
              <MarkerButton
                if={user.markedAs === "favorite"}
                class={"btn h-10 w-30 bg-tYellow text-white"}
                action="unfavorite"
              >
                {t("users.removeFavoriteButton")}
              </MarkerButton>
            </div>
          )}
        </div>
      </div>
      <div className="sm:mx-24">
        <div className="mt-24 mb-12">
          <h2 className="my-3 font-bold text-3xl underline decoration-2">{t("users.universityInformation")}</h2>
          <p className="my-3 text-lg">
            <strong>{t("users.campus")} </strong> {user.campus}
          </p>
          <p className="my-3 text-lg">
            <strong>{t("users.divisions")} </strong> {user.division}
          </p>
          <p className="my-3 text-lg">
            <strong>{t("users.grade")} </strong> {user.grade}
          </p>
        </div>
        <div className="my-12">
          <h2 className="my-3 font-bold text-3xl underline decoration-2">{t("users.language")} </h2>
          <p className="my-3 text-lg">
            <strong>{t("users.motherLanguage")} </strong> {user.motherLanguage}
          </p>
          <p className="my-3 text-lg">
            <strong>{t("users.fluentLanguage")} </strong> <br />
            {user.fluentLanguages.join(", ")}
          </p>
          <p className="my-3 text-lg">
            <strong>{t("users.learningLanguage")} </strong> <br />
            {user.learningLanguages.join(", ")}
          </p>
        </div>
        <div className="my-12">
          <h2 className="my-3 font-bold text-3xl underline decoration-2">{t("users.topic")}</h2>
          <p className="my-3 text-lg">
            <strong>{t("users.hobby")} </strong>
            <br />
            {user.hobby}
          </p>
          <p className="my-3 text-lg">
            <strong>{t("users.introduction")} </strong>
            <br />
            {user.introduction}
          </p>
        </div>
        <div>
          <MarkerButton if={user.markedAs !== "blocked"} class="btn btn-error" action="block">
            {t("users.blockButton")}
          </MarkerButton>
          <MarkerButton if={user.markedAs === "blocked"} class="btn btn-neutral btn-soft" action="unblock">
            {t("users.removeBlockButton")}
          </MarkerButton>
        </div>
      </div>
    </div>
  );
}
