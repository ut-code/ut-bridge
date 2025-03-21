import Header from "@/components/Header";
import { AuthProvider } from "@/features/auth/providers/AuthProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <Header />
      <AuthProvider>
        <main className="flex-1 overflow-y-auto bg-tGray">{children}</main>
      </AuthProvider>
    </div>
  );
}
