import SideNav from "@/features/setting/SideNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-64 flex-none">
        <SideNav />
      </div>
      <div className="overflow-y-auto p-12">{children}</div>
    </div>
    </>
  );
}
