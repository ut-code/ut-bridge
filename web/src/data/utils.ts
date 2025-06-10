import { cookieNames } from "@/consts.ts";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getIdToken() {
  const idToken = (await cookies()).get(cookieNames.idToken)?.value;
  if (!idToken) throw redirect("/login");
  return idToken;
}
