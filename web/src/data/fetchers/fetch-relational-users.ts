import { client } from "@/client.ts";

export async function getBlockedUsers(idToken: string) {
  const blockedRes = await client.community.$get({
    header: {
      Authorization: idToken,
      sessionSeed: "", // we don't care about how users are ordered here
    },
    query: {
      marker: "blocked",
    },
  });
  if (!blockedRes.ok) throw new Error("Failed to fetch blocked users");
  const blockedUsers = await blockedRes.json();
  return blockedUsers;
}

export async function getFavoriteUsers(idToken: string) {
  const favoriteRes = await client.community.$get({
    header: {
      Authorization: idToken,
      sessionSeed: "", // we don't care about how users are ordered here
    },
    query: {
      marker: "favorite",
    },
  });
  if (!favoriteRes.ok) throw new Error("Failed to fetch favorite users");
  const favoriteUsers = await favoriteRes.json();
  return favoriteUsers;
}
