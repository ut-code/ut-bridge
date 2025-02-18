// import Header from "@/components/Header";

import Header from "@/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full">
      <Header />
      <div className="h-full overflow-y-auto pt-16 bg-tGray">{children}</div>
    </div>
  );
}
