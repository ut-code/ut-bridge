import { client } from "@/client";
import { formatCardUser } from "@/features/format.ts";
import type { FlatCardUser, MYDATA } from "common/zod/schema";
import { getLocale } from "next-intl/server";
import { getIdToken } from "./_cookie.ts";
import { getBlockedUsers, getFavoriteUsers } from "./fetchers/fetch-relational-users.ts";

export async function getUserData(): Promise<MYDATA> {
  const idToken = await getIdToken();

  const res = await client.users.me.$get({
    header: {
      Authorization: idToken,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  const data = await res.json();
  if (!data) throw new Error("User not found");
  return data;
}

export async function getGlobalData(): Promise<{
  universities: { id: string; jaName: string; enName: string }[];
  languages: { id: string; jaName: string; enName: string }[];
}> {
  const universityRes = await client.university.$get();
  const languageRes = await client.language.$get();

  if (!universityRes.ok || !languageRes.ok) {
    throw new Error(
      `データ取得に失敗しました: {
        university: ${await universityRes.text()}
        language: ${await languageRes.text()}
      }`,
    );
  }

  const universities = await universityRes.json();
  const languages = await languageRes.json();

  return { universities, languages };
}

export async function getPersonalData(): Promise<{
  blockedUsers: FlatCardUser[];
  favoriteUsers: FlatCardUser[];
  savedData: MYDATA | null;
}> {
  const idToken = await getIdToken();
  const locale = await getLocale();

  const [blockedUsers, favoriteUsers, user] = await Promise.all([
    getBlockedUsers(idToken),
    getFavoriteUsers(idToken),
    getUserData(),
  ]);

  return {
    blockedUsers: blockedUsers.users.map((user) => formatCardUser(user, locale)),
    favoriteUsers: favoriteUsers.users.map((user) => formatCardUser(user, locale)),
    savedData: user,
  };
}
