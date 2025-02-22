import Header from "@/components/Header";
import { AuthProvider } from "@/features/auth/providers/AuthProvider";
import { ChatProvider } from "@/features/chat/chatProvider";
import { UserProvider } from "@/features/user/userProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <UserProvider>
        <ChatProvider>
          <div className="h-full">
            <Header />
            <div className="h-full overflow-y-auto pt-16 bg-tGray">
              {children}
            </div>
          </div>
        </ChatProvider>
      </UserProvider>
    </AuthProvider>
  );
}
