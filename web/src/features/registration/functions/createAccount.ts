import { client } from "@/client";

export async function createAccount(guid: string) {
  await client.users.$post;
  throw new Error("Function not implemented.");
}
