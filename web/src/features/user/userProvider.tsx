"use client";
import { client } from "@/client";
import Loading from "@/components/Loading.tsx";
import { ensure } from "@/lib.ts";
import type { StructuredUser } from "common/zod/schema";
import { useRouter } from "next/navigation";
import { type ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "../auth/providers/AuthProvider.tsx";

export type MYDATA = Omit<StructuredUser, "university">;

type ContextProps = {
  me: MYDATA;
  updateMyData: (callback: (prev: MYDATA) => MYDATA) => void;
};
const UserContext = createContext<ContextProps | null>(null);
export function useUserContext() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUserContext: please use this within UserProvider. aborting...");
  return ctx;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { guid } = useAuthContext();
  const [myData, setMyData] = useState<MYDATA | null>(null);
  const { idToken: Authorization } = useAuthContext();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await client.users.$get({
          header: { Authorization },
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
  }, [router, guid, Authorization]);

  if (!myData) return <Loading stage="my info" />;
  return (
    <UserContext.Provider value={{ me: myData, updateMyData: (cb) => setMyData(cb(myData)) }}>
      {children}
    </UserContext.Provider>
  );
}
