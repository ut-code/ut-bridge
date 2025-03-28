"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { AuthProvider } from "@/features/auth/providers/AuthProvider";
import { ChatNotificationProvider } from "@/features/chat/NotificationProvider";
import { UserProvider } from "@/features/user/userProvider";
import { useNormalizedPathname } from "@/hooks/useNormalizedPath";
import { useTranslations } from "next-intl";

export default function Layout({ children }: { children: React.ReactNode }) {
  const t = useTranslations();
  const pathname = useNormalizedPathname();

  let headerTitle = "";
  if (pathname.startsWith("/chat")) headerTitle = t("chat.title");
  else if (pathname.startsWith("/settings")) headerTitle = t("settings.title");
  else if (pathname.startsWith("/community") || pathname.startsWith("/users")) headerTitle = t("community.title");
  else {
    console.log("unmatched path:", pathname);
  }

  return (
    <AuthProvider>
      <UserProvider>
        <ChatNotificationProvider>
          <div className="flex h-full flex-col">
            <Header title={headerTitle} />
            <main className="flex-1 overflow-y-auto bg-tGray ">{children}</main>
            <Footer />
          </div>
        </ChatNotificationProvider>
      </UserProvider>
    </AuthProvider>
  );
}
