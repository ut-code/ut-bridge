"use client";

import { client } from "@/client";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { useUserFormContext } from "@/features/setting/UserFormController.tsx";
import UserCard from "@/features/user/UserCard.tsx";
import { useTranslations } from "next-intl";

export default function Page() {
  const { idToken: Authorization } = useAuthContext();
  const { blockedUsers, refetchBlockedUsers } = useUserFormContext();
  const t = useTranslations("setting.block");

  return (
    <>
      <div className="max-w my-10 p-4">
        <h1 className="mb-8 text-xl"> {t("subTitle")}</h1>
        <ul className="m-5 grid w-full grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
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
      </div>
    </>
  );
}
