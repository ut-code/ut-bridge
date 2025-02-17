import { AuthBoundary } from "@/features/auth/providers/AuthProvider";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <AuthBoundary>{children}</AuthBoundary>;
}
