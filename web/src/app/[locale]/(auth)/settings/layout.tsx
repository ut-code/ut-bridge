"use client";

import SideNav from "@/features/setting/SideNav";
import { UserFormProvider } from "@/features/setting/UserFormController.tsx";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UserFormProvider loadPreviousData>
        <div className="flex h-screen flex-none sm:flex-row">
          <div className="hidden w-full sm:block">
            <SideNav />
          </div>
          <div className="w-full">{children}</div>
        </div>
      </UserFormProvider>
    </>
  );
}
