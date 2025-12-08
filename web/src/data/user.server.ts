import type { MYDATA, StructuredUser } from "common/zod/schema";
import { client } from "@/client.ts";
import { getIdToken } from "./utils.ts";

export async function getMyData(): Promise<MYDATA> {
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

export async function getUserData(id: string): Promise<StructuredUser> {
  const idToken = await getIdToken();

  const res = await client.users.$get({
    header: {
      Authorization: idToken,
    },
    query: {
      id,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  const data = (await res.json())[0];
  if (!data) throw new Error("User not found");
  return data;
}
