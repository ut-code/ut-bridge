"use client";
import { client } from "@/client";
import type { FullUser } from "common/zod/schema";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const { user } = useAuthContext();
  const [myData, setMyData] = useState<FullUser | null>(null);

  useEffect(() => {
    if (!user) {
      setMyData(null);
      router.push("/login");
      return;
    }
    const fetchUserData = async () => {
      try {
        const res = await client.users.$get({
          query: { guid: user.uid },
        });
        if (!res.ok) throw new Error("User is not found in Database!");
        const data = await res.json();
        setMyData(data[0]);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user, router]);

  return (
    <UserContext.Provider value={{ myData }}>{children}</UserContext.Provider>
  );
}
