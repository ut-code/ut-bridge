import Header from "@/components/Header";
import { AuthProvider } from "@/features/auth/providers/AuthProvider";
import { ChatNotificationProvider } from "@/features/chat/NotificationProvider";
import { UserProvider } from "@/features/user/userProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <UserProvider>
        <ChatNotificationProvider>
          <div className="flex h-full flex-col">
            <Header />
            <main className="flex-1 overflow-y-auto bg-tGra">{children}</main>
          </div>
        </ChatNotificationProvider>
      </UserProvider>
    </AuthProvider>
  );
}
