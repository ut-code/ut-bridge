"use client";
import { formatUser } from "@/features/format";
import type { User } from "common/zod/schema";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { client } from "../../../client.ts";

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
    <div>
      <h1>User Page</h1>
      {user.imageUrl ? (
        <Image
          src={user.imageUrl}
          alt={user.name ?? "User"}
          width={48}
          height={48}
          className="w-12 h-12 rounded-full"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">N/A</div>
      )}
      <p>
        <strong>Name:</strong> {user.name || "N/A"}
      </p>
      <p>
        <strong>Gender:</strong> {user.gender || "N/A"}
      </p>
      <p>
        <strong>Is Foreign Student:</strong> {user.isForeignStudent ? "Yes" : "No"}
      </p>
      <p>
        <strong>Display Language:</strong> {user.displayLanguage}
      </p>
      <p>
        <strong>Campus Name:</strong> {user.campus || "N/A"}
      </p>
      <p>
        <strong>Grade:</strong> {user.grade ?? "N/A"}
      </p>
      <p>
        <strong>Division:</strong> {user.division ?? "N/A"}
      </p>
      <p>
        <strong>Mother Language:</strong> {user.motherLanguage ?? "N/A"}
      </p>
      <p>
        <strong>Fluent Languages:</strong> {user.fluentLanguages.length > 0 ? user.fluentLanguages.join(", ") : "N/A"}
      </p>
      <p>
        <strong>Learning Languages:</strong>{" "}
        {user.learningLanguages.length > 0 ? user.learningLanguages.join(", ") : "N/A"}
      </p>
      <p>
        <strong>Hobby:</strong> {user.hobby || "N/A"}
      </p>
      <p>
        <strong>Introduction:</strong> {user.introduction || "N/A"}
      </p>
      <p>
        <MarkerButton class="btn btn-accent" if={user.markedAs === undefined} action="favorite">
          お気に入りにする
        </MarkerButton>
        <MarkerButton class="btn btn-accent" if={user.markedAs === "favorite"} action="unfavorite">
          お気に入りを外す
        </MarkerButton>
        <MarkerButton class="btn btn-error" if={user.markedAs === undefined} action="block">
          ブロックする
        </MarkerButton>
        <MarkerButton class="btn btn-error" if={user.markedAs === "blocked"} action="unblock">
          ブロックを外す
        </MarkerButton>
      </p>
    </div>
  );
}
