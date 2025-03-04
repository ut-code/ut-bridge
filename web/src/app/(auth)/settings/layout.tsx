import SideNav from "@/features/setting/SideNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex h-screen flex-row">
        <div className="center w-1/4 p-20">
          <SideNav />
        </div>
        <div className="p-12">{children}</div>
      </div>
    </>
  );
}
