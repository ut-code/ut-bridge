import Header from "@/components/Header.tsx";
import { getGlobalData } from "@/data/formData.server.ts";
import { AuthProvider } from "@/features/auth/providers/AuthProvider.tsx";
import { UserFormProvider } from "@/features/settings/UserFormController.tsx";
import { ToastProvider } from "@/features/toast/ToastProvider.tsx";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const globalData = await getGlobalData();

  return (
    <div className="flex h-full flex-col">
      <Header user={null} />
      <AuthProvider>
        <ToastProvider>
          <UserFormProvider globalData={globalData} personalData={null}>
            <main className="flex-1 overflow-y-auto bg-tGray">{children}</main>
          </UserFormProvider>
        </ToastProvider>
      </AuthProvider>
    </div>
  );
}
