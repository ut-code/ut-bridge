// import Header from "@/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full">
      <header className="h-16 w-full justify-center bg-primary fixed top-0 m-0">
        <button type="button" className="text-white">
          コミュニティ
        </button>
        <button type="button" className="text-white">
          チャット
        </button>
        <button type="button" className="text-white">
          設定
        </button>
      </header>
      <div className="h-full overflow-y-auto pt-16">{children}</div>
    </div>
  );
}
