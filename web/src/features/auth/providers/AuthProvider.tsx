"use client";
import type { User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config.ts";

const AuthContext = createContext<{ fbUser: User } | undefined>(undefined);

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error(
      "useAuthContext: please use this within AuthProvider. aborting...",
    );
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [fbUser, setfbUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setfbUser(user);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // ユーザーが取得されるまでローディングを表示
  // TODO: 無限にスタックすることはない？要検証
  if (fbUser === undefined) {
    return <p>loading...</p>;
  }

  return (
    <AuthContext.Provider value={{ fbUser }}>{children}</AuthContext.Provider>
  );
}
