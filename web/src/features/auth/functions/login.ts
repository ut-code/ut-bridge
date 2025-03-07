import { authCookie, client } from "@/client.ts";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { auth, provider } from "../config.ts";

async function login() {
  try {
    const result = await signInWithPopup(auth, provider);
    if (!result.user) throw new Error("Login Failed");
    const idToken = await result.user.getIdToken();
    console.log("got idToken of", idToken);
    document.cookie = authCookie(idToken);

    const res = await client.users.exist.$get({
      query: { guid: result.user.uid },
    });
    const { exists } = await res.json();

    return exists ? { status: "hasData", user: result.user } : { status: "auth-nodata", user: result.user };
  } catch (error) {
    console.error("Login Error:", error);
    return { status: "noAuth", error };
  }
}

export function useGoogleSignIn() {
  const router = useRouter();

  const signInWithGoogle = useCallback(async () => {
    const response = await login();

    switch (response.status) {
      case "hasData":
        router.push("/community");
        break;
      case "auth-nodata":
        router.push("/registration");
        break;
      default:
        router.push("/login");
        break;
    }
  }, [router]);

  return { signInWithGoogle };
}
