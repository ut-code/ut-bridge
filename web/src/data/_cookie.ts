import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cookieNames } from "./_consts.ts";

export async function getIdToken() {
  const idToken = (await cookies()).get(cookieNames.idToken)?.value;
  if (!idToken) throw redirect("/login");
  return idToken;
}
