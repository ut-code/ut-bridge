import { client } from "@/client";
import type { MYDATA } from "common/zod/schema";
import { getIdToken } from "./utils.ts";

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
