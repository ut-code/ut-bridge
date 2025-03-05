"use client";

import { client } from "@/client";
import UserCard from "@/features/user/UserCard.tsx";
import { useUserFormContext } from "@/features/user/UserFormProvider";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const { favoriteUsers, refetchFavoriteUsers } = useUserFormContext();

  return (
    <>
      <div className="flex items-center justify-between border-gray-300 border-b p-4 text-xl sm:hidden">
        <Link href={"/settings"}>
          <ChevronLeft />
        </Link>
        お気に入り
        <div className="w-6" />
      </div>
      <div className="max-w my-10 p-4">
        <h1 className="mb-8 hidden text-xl sm:block">お気に入りユーザー</h1>
        <ul className="m-5 grid w-full grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
          {favoriteUsers.length === 0 ? (
            <p>お気に入りユーザーはいません。</p>
          ) : (
            favoriteUsers.map((user) => (
              <li key={user.id}>
                <UserCard
                  link={`/users?id=${user.id}`}
                  user={user}
                  on={{
                    async favorite(id) {
                      await client.users.markers.favorite[":targetId"].$put({
                        param: { targetId: id },
                      });
                      refetchFavoriteUsers();
                    },
                    async unfavorite(id) {
                      await client.users.markers.favorite[":targetId"].$delete({
                        param: { targetId: id },
                      });
                      refetchFavoriteUsers();
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
