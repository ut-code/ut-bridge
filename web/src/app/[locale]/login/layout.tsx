import Header from "@/components/Header.tsx";
import { ToastProvider } from "@/features/toast/ToastProvider.tsx";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header user={null} />
      <ToastProvider>{children}</ToastProvider>
    </>
  );
}
