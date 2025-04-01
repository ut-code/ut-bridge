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
        <Header />
        <ToastProvider>
          <ChatNotificationProvider>
            <div className="flex h-full flex-col">
              <main className="flex-1 overflow-y-auto bg-tGray ">{children}</main>
              <Footer />
            </div>
          </ChatNotificationProvider>
        </ToastProvider>
      </UserProvider>
    </AuthProvider>
  );
}
