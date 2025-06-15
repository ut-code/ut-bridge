import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { auth } from "../config.ts";
import { removeAuthCookies } from "./cookies.ts";

export function useGoogleLogout() {
  const router = useRouter();

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      removeAuthCookies();
      router.push("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  }, [router]);

  return { logout };
}
