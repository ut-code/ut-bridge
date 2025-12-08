"use client";

import { useTranslations } from "next-intl";
import { client } from "@/client.ts";
import { useAuthContext } from "@/features/auth/providers/AuthProvider.tsx";
import { useUserFormContext } from "@/features/settings/UserFormController.tsx";
import UserCard from "@/features/user/UserCard.tsx";
import { styles } from "../shared-class.ts";

export default function Page() {
  const { idToken: Authorization } = useAuthContext();
  const { favoriteUsers, refetchFavoriteUsers } = useUserFormContext();
  const t = useTranslations("settings.favorite");

  return (
    <>
      <h1 className={styles.usersH1}>{t("subTitle")}</h1>
      <ul className={styles.usersUl}>
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
    </>
  );
}
