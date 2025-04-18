"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { AuthProvider } from "@/features/auth/providers/AuthProvider";
import { ChatNotificationProvider } from "@/features/chat/NotificationProvider";
import { ToastProvider } from "@/features/toast/ToastProvider";
import { UserProvider } from "@/features/user/userProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <UserProvider>
        <ChatNotificationProvider>
          <div className="flex min-h-fit flex-col bg-tGray">
            <Header />
            <ToastProvider>
              <div className="flex-grow pb-16">{children}</div>
              <Footer />
            </ToastProvider>
          </div>
        </ChatNotificationProvider>
      </UserProvider>
    </AuthProvider>
  );
}
