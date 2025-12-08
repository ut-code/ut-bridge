"use client";
import type { MYDATA } from "common/zod/schema";
import { createContext, type ReactNode, useCallback, useContext, useState } from "react";
import Loading from "@/components/Loading.tsx";

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
