import { client } from "@/client.ts";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { auth, provider } from "../config.ts";

async function login() {
  try {
    const result = await signInWithPopup(auth, provider);
    if (!result.user) throw new Error("Login Failed");

    const idToken = await result.user.getIdToken();
    console.log("your guid is", result.user.uid);
    console.log("got idToken of", idToken);

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
  const [isLoading, setIsLoading] = useState(false);

  const signInWithGoogle = useCallback(async () => {
    setIsLoading(true);
    const response = await login();
    setIsLoading(false);

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

  return { signInWithGoogle, isLoading };
}
