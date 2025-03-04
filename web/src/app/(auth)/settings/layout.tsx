import SideNav from "@/features/setting/SideNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex h-screen flex-row">
        <div className="p-20 w-1/4 center">
          <SideNav />
        </div>
        <div className="p-12">{children}</div>
      </div>
    </>
  );
}
