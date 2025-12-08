"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Loading from "@/components/Loading.tsx";
import { useRouter } from "@/i18n/navigation.ts";
import { auth } from "../config.ts";

const AuthContext = createContext<{ idToken: string; guid: string; displayName: string | undefined } | undefined>(
  undefined,
);

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext: please use this within AuthProvider. aborting...");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [idToken, setIDToken] = useState<string | undefined>(undefined);
  const [guid, setGUID] = useState<string | undefined>(undefined);
  const [displayName, setDisplayName] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setGUID(user.uid);
        setDisplayName(user.displayName ?? undefined);
        const token = await user.getIdToken();
        setIDToken(token);
      } else {
        router.push("/");
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [router]);

  if (loading || guid === undefined || idToken === undefined) {
    return <Loading stage="auth" />;
  }

  return <AuthContext.Provider value={{ idToken, guid, displayName }}>{children}</AuthContext.Provider>;
}
