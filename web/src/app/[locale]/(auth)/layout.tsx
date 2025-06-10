"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Loading from "@/components/Loading.tsx";
import { AuthProvider } from "@/features/auth/providers/AuthProvider";
import { ChatNotificationProvider } from "@/features/chat/NotificationProvider";
import { ToastProvider } from "@/features/toast/ToastProvider";
import { UserProvider } from "@/features/user/userProvider";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <UserProvider>
        <ChatNotificationProvider>
          <ToastProvider>
            <div className="flex min-h-fit flex-col bg-tGray">
              <div className="flex-grow pb-16">
                <Header />
                <Suspense fallback={<Loading stage="layout" />}>{children}</Suspense>
              </div>
              <Footer />
            </div>
          </ToastProvider>
        </ChatNotificationProvider>
      </UserProvider>
    </AuthProvider>
  );
}
