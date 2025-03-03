"use client";
import { formatUser } from "@/features/format";
import type { User } from "common/zod/schema";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { client } from "../../../client.ts";
import Link from "next/link";

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    async function fetchUser() {
      try {
        if (!id) {
          throw new Error("User Id Not Found!");
        }
        const res = await client.users.$get({
          query: { id: id },
        });
        const data = await res.json();
        if (data.length >= 2) throw new Error(`got too many users: got ${data.length}`);

        const first = data[0];
        if (!first) {
          throw new Error("User Not Found!");
        }
        setUser(formatUser(first));
      } catch (error) {
        console.error("Failed to fetch user:", error);
        router.push("/community");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [router, id]);
  const [markSpinner, setMarkSpinner] = useState(false);

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
          const args = { param: { targetId: user.id } };
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

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="m-16 rounded-3xl bg-white p-16">
      <div className="mb-10 flex items-center justify-around">
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
        <div>
          <p className="mb-4 font-bold text-5xl">{user.name}</p>
          <p className="my-4 text-2xl">{user.gender}</p>
          <p className="my-4 text-2xl">{user.isForeignStudent ? "留学生" : " "}</p>
          <div className="flex gap-10">
            <Link
              href={`/chat?userId=${user.id}`}
              className="flex h-25 w-25 items-center justify-center rounded-full bg-blue-500 text-white"
            >
              チャット
            </Link>
            <MarkerButton if={true} class={"h-25 w-25 rounded-full bg-yellow-400 text-white"} action="favorite">
              お気に入り
            </MarkerButton>
          </div>
        </div>
      </div>
      <div className="mx-24">
        <div className="mt-24 mb-12">
          <h2 className="my-3 font-bold text-3xl underline decoration-2">大学情報</h2>
          <p className="my-3 text-lg">
            <strong>所属キャンパス：</strong> {user.campus}
          </p>
          <p className="my-3 text-lg">
            <strong>学部・大学院：</strong> {user.division}
          </p>
          <p className="my-3 text-lg">
            <strong>学年：</strong> {user.grade}
          </p>
        </div>
        <div className="my-12">
          <h2 className="my-3 font-bold text-3xl underline decoration-2">言語</h2>
          <p className="my-3 text-lg">
            <strong>母国語：</strong> {user.motherLanguage}
          </p>
          <p className="my-3 text-lg">
            <strong>流暢に話すことのできる言語：</strong> <br />
            {user.fluentLanguages.join(", ")}
          </p>
          <p className="my-3 text-lg">
            <strong>学びたい言語：</strong> <br />
            {user.learningLanguages.join(", ")}
          </p>
        </div>
        <div className="my-12">
          <h2 className="my-3 font-bold text-3xl underline decoration-2">トピック</h2>
          <p className="my-3 text-lg">
            <strong>趣味・好きなこと：</strong>
            <br />
            {user.hobby}
          </p>
          <p className="my-3 text-lg">
            <strong>自己紹介：</strong>
            <br />
            {user.introduction}
          </p>
        </div>
        <div>
          <MarkerButton if={true} class={"rounded bg-red-500 px-6 py-3 text-white"} action={"block"}>
            ブロックする
          </MarkerButton>
        </div>
      </div>
    </div>
  );
}
