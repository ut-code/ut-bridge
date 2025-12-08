import { Suspense } from "react";
import Footer from "@/components/Footer.tsx";
import HeaderComponent from "@/components/Header.tsx";
import Loading from "@/components/Loading.tsx";
import { getMyData } from "@/data/user.server.ts";
import { AuthProvider } from "@/features/auth/providers/AuthProvider.tsx";
import { ChatNotificationProvider } from "@/features/chat/NotificationProvider.tsx";
import { ToastProvider } from "@/features/toast/ToastProvider.tsx";
import { UserProvider } from "@/features/user/userProvider.tsx";

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
