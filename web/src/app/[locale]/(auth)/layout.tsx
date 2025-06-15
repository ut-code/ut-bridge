import Footer from "@/components/Footer";
import HeaderComponent from "@/components/Header";
import Loading from "@/components/Loading.tsx";
import { getMyData } from "@/data/user.server";
import { AuthProvider } from "@/features/auth/providers/AuthProvider";
import { ChatNotificationProvider } from "@/features/chat/NotificationProvider";
import { ToastProvider } from "@/features/toast/ToastProvider";
import { UserProvider } from "@/features/user/userProvider";
import { Suspense } from "react";

async function LazyHeader() {
  const user = await getMyData();
  return <HeaderComponent user={user} />;
}
function Header() {
  return (
    <Suspense fallback={<HeaderComponent user={null} />}>
      <LazyHeader />
    </Suspense>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-fit flex-col bg-tGray">
      <div className="flex-grow pb-16">
        <Header />
        <Suspense fallback={<Loading stage="(auth)/layout" />}>
          <LazyLayout>{children}</LazyLayout>
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}

async function LazyLayout({ children }: { children: React.ReactNode }) {
  const user = await getMyData();

  return (
    <AuthProvider>
      <UserProvider data={user}>
        <ChatNotificationProvider>
          <ToastProvider>{children}</ToastProvider>
        </ChatNotificationProvider>
      </UserProvider>
    </AuthProvider>
  );
}
