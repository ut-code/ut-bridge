import { Suspense } from "react";
import Loading from "@/components/Loading.tsx";
import { getGlobalData, getPersonalData } from "@/data/formData.server.ts";
import { UserFormProvider } from "@/features/settings/UserFormController.tsx";
import ClientLayout from "./layout.client.tsx";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ClientLayout>
      <Suspense fallback={<Loading stage="settings data" />}>
        <DataLoader>{children}</DataLoader>
      </Suspense>
    </ClientLayout>
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
