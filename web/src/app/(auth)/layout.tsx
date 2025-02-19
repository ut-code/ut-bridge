import Header from "@/components/Header";
import { AuthBoundary } from "@/features/auth/providers/AuthProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthBoundary>
      <div className="h-full">
        <Header />
        <div className="h-full overflow-y-auto pt-16 bg-tGray">{children}</div>
      </div>
    </AuthBoundary>
  );
}
