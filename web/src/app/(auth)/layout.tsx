import Header from "@/components/Header";
import { AuthBoundary } from "@/features/auth/providers/AuthProvider";
import { ChatProvider } from "@/features/chat/provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthBoundary>
      <ChatProvider>
        <div className="h-full">
          <Header />
          <div className="h-full overflow-y-auto pt-16 bg-tGray">
            {children}
          </div>
        </div>
      </ChatProvider>
    </AuthBoundary>
  );
}
