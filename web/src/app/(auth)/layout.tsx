import Header from "@/components/Header";
import { AuthProvider } from "@/features/auth/providers/AuthProvider";
import { ChatNotificationProvider } from "@/features/chat/NotificationProvider";
import { UserProvider } from "@/features/user/userProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <UserProvider>
        <ChatNotificationProvider>
          <div className="h-full">
            <Header />
            <div className="h-full overflow-y-auto bg-tGray pt-16">{children}</div>
          </div>
        </ChatNotificationProvider>
      </UserProvider>
    </AuthProvider>
  );
}
