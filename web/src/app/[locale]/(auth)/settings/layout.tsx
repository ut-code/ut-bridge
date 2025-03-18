import SideNav from "@/features/setting/SideNav";
import { UserFormProvider } from "@/features/setting/UserFormController.tsx";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UserFormProvider>
        <div className="flex h-screen flex-row">
          <div className="center w-1/4 p-20">
            <SideNav />
          </div>
          <div className="w-2/3 p-12">{children}</div>
        </div>
      </UserFormProvider>
    </>
  );
}
