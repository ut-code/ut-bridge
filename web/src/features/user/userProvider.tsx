"use client";
import { client } from "@/client";
import { ensure } from "@/lib.ts";
import type { FullUser } from "common/zod/schema";
import { useRouter } from "next/navigation";
import { type ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "../auth/providers/AuthProvider.tsx";

const UserContext = createContext<{ me: FullUser } | null>(null);
export function useUserContext(): { me: FullUser } {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUserContext: please use this within UserProvider. aborting...");
  return ctx;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { guid } = useAuthContext();
  const [myData, setMyData] = useState<FullUser | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await client.users.$get({
          query: { guid },
        });
        ensure(res.ok, "User is not found in Database!");
        const data = await res.json();
        const me = data[0];
        if (!me) throw new Error("User is not found in Database!");
        setMyData(me);
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/login");
      }
    };

    fetchUserData();
  }, [router, guid]);

  if (!myData) return <span className="loading loading-xl" />;
  return <UserContext.Provider value={{ me: myData }}>{children}</UserContext.Provider>;
}
