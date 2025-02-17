import Clerk from "@/providers/clerk";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Clerk>{children}</Clerk>;
}
