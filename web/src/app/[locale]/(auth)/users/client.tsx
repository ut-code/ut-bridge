"use client";

import { client } from "@/client";
import Avatar from "@/components/Avatar";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import type { FlatUser, MYDATA } from "common/zod/schema";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ClientPage({ me, initUser }: { me: MYDATA; initUser: FlatUser }) {
  const router = useRouter();
  const [user, setUser] = useState(initUser);
  const { idToken: Authorization } = useAuthContext();
  const t = useTranslations();

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
