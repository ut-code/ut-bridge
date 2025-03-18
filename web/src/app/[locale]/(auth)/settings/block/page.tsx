"use client";

import { client } from "@/client";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { useUserFormContext } from "@/features/setting/UserFormController.tsx";
import UserCard from "@/features/user/UserCard.tsx";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Page() {
  const { idToken: Authorization } = useAuthContext();
  const { blockedUsers, refetchBlockedUsers } = useUserFormContext();
  const t = useTranslations("setting.block");

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
        <h1 className="mb-8 hidden text-xl sm:block"> {t("subTitle")}</h1>
        <ul className="grid w-full grid-cols-1 sm:m-5 sm:grid-cols-1 sm:gap-6 md:grid-cols-1 lg:grid-cols-2">
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
