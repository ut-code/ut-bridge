import type { CardUser } from "common/zod/schema";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type UserCardEvent = {
  favorite: (id: string) => Promise<void>;
  unfavorite: (id: string) => Promise<void>;
};
const DEV_EXTRA_QUERY_WAIT = 2000;

export default function UserCard({
  user: init,
  on,
  link,
}: {
  user: CardUser;
  on: UserCardEvent;
  link: string;
}) {
  const [user, setUser] = useState(init);
  const [favoriteBtnLoading, setFavoriteBtnLoading] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={`relative flex h-36 w-full items-center rounded-2xl sm:h-62 sm:bg-white ${
        pathname !== "/settings/block" && user.marker === "blocked" && "bg-gray-300"
      }`}
    >
      <div
        className={`absolute top-0 left-0 h-[1px] w-full bg-gray-300 sm:hidden ${pathname === "/community" && user.marker === "blocked" ? "hidden" : ""}`}
      />
      {/* お気に入りボタン（右上に配置） */}
      <div className="absolute top-2 right-2 z-10">
        {favoriteBtnLoading ? (
          <span className="loading loading-ring" />
        ) : user.marker === "favorite" ? (
          <button
            type="button"
            aria-label="marked as favorite"
            className="badge bg-transparent text-xl text-yellow-400"
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
            className="badge bg-transparent text-black-700 text-xl"
            onClick={async () => {
              setFavoriteBtnLoading(true);
              await on.favorite(user.id);
              setUser({
                ...user,
                marker: "favorite",
              });
              setTimeout(() => {
                setFavoriteBtnLoading(false);
              }, DEV_EXTRA_QUERY_WAIT);
            }}
          >
            ★
          </button>
        )}
      </div>

      <Link href={link} className="h-full w-full sm:p-4">
        <div className="flex h-full flex-row items-center">
          <div className="flex w-1/3 items-center justify-center">
            {user.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={user.name ?? "User"}
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="flex h-30 w-30 items-center justify-center rounded-full bg-gray-300">No Image</div>
            )}
          </div>

          <div className="w-2/3 pl-4">
            <h2 className="truncate font-semibold text-lg">{user.name ?? "Unknown"}</h2>
            <p className="text-sm">{user.campus ?? "Unknown"}</p>
            <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm">
              使える言語: {user.fluentLanguages.join(", ") || "None"}
            </p>
            <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm">
              学びたい言語: {user.learningLanguages.join(", ") || "None"}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
