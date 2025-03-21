"use client";

import { client } from "@/client";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { useUserFormContext } from "@/features/setting/UserFormController.tsx";
import UserCard from "@/features/user/UserCard.tsx";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Page() {
  const { idToken: Authorization } = useAuthContext();
  const { favoriteUsers, refetchFavoriteUsers } = useUserFormContext();
  const t = useTranslations("setting.favorite");

  return (
    <>
      <div className="flex items-center justify-between border-gray-300 border-b p-4 text-xl sm:hidden">
        <Link href={"/settings"}>
          <ChevronLeft />
        </Link>
        {t("title")}
        <div className="w-6" />
      </div>
      <div className="max-w my-10 p-4">
        <h1 className="mb-8 hidden text-xl sm:block">{t("subTitle")}</h1>
        <ul className="grid w-full grid-cols-1 sm:m-5 sm:grid-cols-1 sm:gap-6 md:grid-cols-1 lg:grid-cols-2">
          {favoriteUsers.length === 0 ? (
            <p>{t("noUser")}</p>
          ) : (
            favoriteUsers.map((user) => (
              <li key={user.id}>
                <UserCard
                  link={`/users?id=${user.id}`}
                  user={user}
                  on={{
                    async favorite(id) {
                      await client.users.markers.favorite[":targetId"].$put({
                        header: { Authorization },
                        param: { targetId: id },
                      });
                      refetchFavoriteUsers();
                    },
                    async unfavorite(id) {
                      await client.users.markers.favorite[":targetId"].$delete({
                        header: { Authorization },
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
