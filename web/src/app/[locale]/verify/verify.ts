import { client } from "@/client";

export async function verify(id: string, token: string) {
  const res = await client.email.verify.$put({
    query: {
      id,
      token,
    },
  });
  if (!res.ok) throw new Error(`verification failed with status ${res.status}`);
}
