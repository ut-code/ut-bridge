import { ChatProvider } from "@/features/chat/chatProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ChatProvider>{children}</ChatProvider>
    </>
  );
}
