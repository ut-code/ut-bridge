"use client";

import { client } from "@/client";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { useUserFormContext } from "@/features/setting/UserFormController.tsx";
import UserCard from "@/features/user/UserCard.tsx";
import { useTranslations } from "next-intl";
import { styles } from "../shared-class.ts";

export default function Page() {
  const { idToken: Authorization } = useAuthContext();
  const { blockedUsers, refetchBlockedUsers } = useUserFormContext();
  const t = useTranslations("setting.block");

  return (
    <>
      <h1 className={styles.usersH1}> {t("subTitle")}</h1>
      <ul className={styles.usersUl}>
        {blockedUsers.length === 0 ? (
          <p>{t("noUser")}</p>
        ) : (
          blockedUsers.map((user) => (
            <li key={user.id}>
              <UserCard
                link={`/users?id=${user.id}`}
                user={user}
                on={{
                  async unblock(id) {
                    await client.users.markers.blocked[":targetId"].$delete({
                      header: { Authorization },
                      param: {
                        targetId: id,
                      },
                    });
                    refetchBlockedUsers();
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
