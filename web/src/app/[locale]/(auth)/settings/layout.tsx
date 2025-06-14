import Loading from "@/components/Loading.tsx";
import { getGlobalData, getPersonalData } from "@/data/formData.server";
import { UserFormProvider } from "@/features/settings/UserFormController.tsx";
import { Suspense } from "react";
import ClientLayout from "./layout.client";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ClientLayout>
        <Suspense fallback={<Loading stage="settings data" />}>
          <DataLoader>{children}</DataLoader>
        </Suspense>
      </ClientLayout>
    </>
  );
}

async function DataLoader({ children }: { children: React.ReactNode }) {
  const globalData = await getGlobalData();
  const personalData = await getPersonalData();

  return (
    <UserFormProvider globalData={globalData} personalData={personalData}>
      {children}
    </UserFormProvider>
  );
}
