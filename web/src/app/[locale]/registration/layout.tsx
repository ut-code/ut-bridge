import Header from "@/components/Header";
import { AuthProvider } from "@/features/auth/providers/AuthProvider";
import { UserFormProvider } from "@/features/settings/UserFormController";
import { ToastProvider } from "@/features/toast/ToastProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <Header />
      <AuthProvider>
        <ToastProvider>
          <UserFormProvider loadPreviousData={false}>
            <main className="flex-1 overflow-y-auto bg-tGray">{children}</main>
          </UserFormProvider>
        </ToastProvider>
      </AuthProvider>
    </div>
  );
}
