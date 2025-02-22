import { client } from "@/client.ts";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { auth, provider } from "../config.ts";

async function login() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    if (!user) throw new Error("Login Failed");

    const res = await client.users.exist.$get({
      query: { guid: result.user.uid },
    });
    const isUserExist = await res.json();
    if (isUserExist.exists) return { login: true, isUserExist: true, user };
    return { login: true, isUserExist: false, user };
  } catch (error) {
    console.error("Login Error:", error);
    return { login: false, error };
  }
}

export function useGoogleSignIn() {
  const router = useRouter();

  const signInWithGoogle = useCallback(async () => {
    const response = await login();

    if (!response.login) {
      router.push("/login");
      return;
    }

    if (response.isUserExist) {
      router.push("/community");
    } else {
      router.push("/login");
    }
  }, [router]);

  return { signInWithGoogle };
}
