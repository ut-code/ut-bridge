import Header from "@/components/Header";
import { getGlobalData } from "@/data/formData.server";
import { AuthProvider } from "@/features/auth/providers/AuthProvider";
import { UserFormProvider } from "@/features/settings/UserFormController";
import { ToastProvider } from "@/features/toast/ToastProvider";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const globalData = await getGlobalData();

  return (
    <div className="flex h-full flex-col">
      <Header />
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
