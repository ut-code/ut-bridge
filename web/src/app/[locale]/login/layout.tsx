import Header from "@/components/Header";
import { ToastProvider } from "@/features/toast/ToastProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header user={null} />
      <ToastProvider>{children}</ToastProvider>
    </>
  );
}
