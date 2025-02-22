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

// Contextの型定義
interface UserContextType {
  myData: FullUser | null;
  setMyData: React.Dispatch<React.SetStateAction<FullUser | null>>;
}

// Contextの作成（デフォルト値は null）
const UserContext = createContext<UserContextType | null>(null);

// Providerの作成
export function UserProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthContext();
  if (!user) throw new Error("User is not found in Firebase!");

  const [myData, setMyData] = useState<FullUser | null>(null);

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
  }, [user.uid]); // user.uid に依存

  return (
    <UserContext.Provider value={{ myData, setMyData }}>
      {children}
    </UserContext.Provider>
  );
}

// useUser フックを作成
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
