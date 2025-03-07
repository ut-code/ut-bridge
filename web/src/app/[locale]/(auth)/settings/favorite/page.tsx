"use client";

import { client } from "@/client";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import UserCard from "@/features/user/UserCard.tsx";
import { useUserFormContext } from "@/features/user/UserFormProvider";
import { useTranslations } from "next-intl";

export default function Page() {
  const { idToken: Authorization } = useAuthContext();
  const { favoriteUsers, refetchFavoriteUsers } = useUserFormContext();
  const t = useTranslations("setting.favorite");

  return (
    <>
      <div className="max-w my-10 p-4">
        <h1 className="mb-8 text-xl">{t("subTitle")}</h1>
        <ul className="m-5 grid w-full grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
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
