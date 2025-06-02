"use client";
import { client } from "@/client";
import Loading from "@/components/Loading.tsx";
import type { MYDATA } from "common/zod/schema";
import { useRouter } from "next/navigation";
import { type ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuthContext } from "../auth/providers/AuthProvider.tsx";

type ContextProps = {
  me: MYDATA;
  updateMyData: (callback: (prev: MYDATA) => MYDATA) => void;
};

const UserContext = createContext<ContextProps | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<MYDATA | null>(null);
  const { idToken: Authorization } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!Authorization) {
      router.push("/login");
      return;
    }
    client.users.me
      .$get({
        header: { Authorization },
      })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(await res.text());
        }
        const data = await res.json();
        setMe(data);
      })
      .catch((err) => {
        console.error(err);
        router.push("/registration");
      });
  }, [Authorization, router]);

  const updateMyData = useCallback((callback: (prev: MYDATA) => MYDATA) => {
    setMe((prev) => (prev ? callback(prev) : prev));
  }, []);

  if (!me) return <Loading stage="user data" />;

  return <UserContext.Provider value={{ me, updateMyData }}>{children}</UserContext.Provider>;
}

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
