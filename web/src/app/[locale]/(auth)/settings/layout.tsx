import { getGlobalData, getPersonalData } from "@/data/formData.server";
import { UserFormProvider } from "@/features/settings/UserFormController.tsx";
import ClientLayout from "./layout.client";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const globalData = await getGlobalData();
  const personalData = await getPersonalData();

  return (
    <>
      <UserFormProvider globalData={globalData} personalData={personalData}>
        <ClientLayout>{children}</ClientLayout>
      </UserFormProvider>
    </>
  );
}
