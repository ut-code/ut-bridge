"use client";
import Loading from "@/components/Loading.tsx";
import type { MYDATA } from "common/zod/schema";
import { type ReactNode, createContext, useCallback, useContext, useState } from "react";

type ContextProps = {
  me: MYDATA;
  updateMyData: (callback: (prev: MYDATA) => MYDATA) => void;
};

const UserContext = createContext<ContextProps | undefined>(undefined);

export function UserProvider({ children, data }: { children: ReactNode; data: MYDATA }) {
  const [me, setMe] = useState<MYDATA>(data);

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
