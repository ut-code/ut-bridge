"use client";
import { client } from "@/client";
import type { FullUser } from "common/zod/schema";
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuthContext } from "../auth/providers/AuthProvider.tsx";

const UserContext = createContext<{ myData: FullUser | null }>({
  myData: null,
});
export function useUserContext() {
  return useContext(UserContext);
}

// Providerの作成
export function UserProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthContext();
  if (!user) throw new Error("User is not found in Firebase!");

  const [myData, setMyData] = useState<FullUser | null>(null);

  const value = {
    myData,
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await client.users.$get({
          query: { guid: user.uid },
        });
        const data = await res.json();
        if (!data) throw new Error("User is not found in Database!");
        setMyData(data[0]);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user.uid]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
