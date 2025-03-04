import SideNav from "@/features/setting/SideNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SideNav />
      {children}
    </>
  );
}
