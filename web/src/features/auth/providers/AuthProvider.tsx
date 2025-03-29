"use client";
import Loading from "@/components/Loading.tsx";
import { useRouter } from "@/i18n/navigation.ts";
import { createContext, useContext, useEffect, useState } from "react";
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

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setDisplayName(currentUser.displayName ?? undefined);
      setGUID(currentUser.uid);
      currentUser.getIdToken(true).then((id) => {
        setIDToken(id);
      });
    } else {
      router.push("/");
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setGUID(user.uid);
        setDisplayName(user.displayName ?? undefined);
        user.getIdToken().then((idToken) => {
          setIDToken(idToken);
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [router]);

  // ユーザーが取得されるまでローディングを表示
  // TODO: 無限にスタックすることはない？要検証
  if (guid === undefined) return <Loading stage="guid" />;
  if (idToken === undefined) return <Loading stage="idToken" />;

  return <AuthContext.Provider value={{ idToken, guid, displayName }}>{children}</AuthContext.Provider>;
}
