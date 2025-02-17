import { ClerkProvider } from "@clerk/nextjs";
import { panic } from "server/lib/env";

// Import your Publishable Key
const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ??
  panic("env NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY not found");

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      {children}
    </ClerkProvider>
  );
}
