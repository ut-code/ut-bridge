import Header from "@/components/Header";
import { AuthProvider } from "@/features/auth/providers/AuthProvider";
import { UserFormProvider } from "@/features/settings/UserFormController";
import { useTranslations } from "next-intl";

export default function Layout({ children }: { children: React.ReactNode }) {
  const t = useTranslations();
  return (
    <div className="flex h-full flex-col">
      <Header title={t("registration.title")} />
      <AuthProvider>
        <UserFormProvider loadPreviousData={false}>
          <main className="flex-1 overflow-y-auto bg-tGray">{children}</main>
        </UserFormProvider>
      </AuthProvider>
    </div>
  );
}
