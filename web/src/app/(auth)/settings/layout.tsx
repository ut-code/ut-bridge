'use client'

import SideNav from "@/features/setting/SideNav";
import { UserFormProvider } from "@/features/user/UserFormProvider";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <UserFormProvider>
        <div className="flex h-screen flex-row">
          <div className={`center w-full sm:block sm:w-1/4 sm:p-20 ${ pathname === "/settings" ? "block" : "hidden"}`}>
            <SideNav />
          </div>
          <div className="sm:w-2/3 sm:p-12">{children}</div>
        </div>
      </UserFormProvider>
    </>
  );
}
