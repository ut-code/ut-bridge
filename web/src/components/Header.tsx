"use client";
import { Link } from "@/lib/i18n";
import { useRouter } from "@/lib/i18n";
import { usePathname } from "next/navigation";
import { AppIcon } from "./AppIcon.tsx";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className="fixed top-0 z-0 flex h-16 w-full items-center bg-tBlue">
      <Link href="/community" passHref className="px-4">
        <AppIcon width={36} height={36} />
      </Link>
      <Link href="/community" className="cursor-pointer px-4 text-2xl text-white">
        UT-Bridge
      </Link>
      <button
        type="button"
        className={`h-full cursor-pointer px-4 text-white text-xl transition-colors duration-200 ${
          pathname === "/community" ? "bg-focus" : "hover:bg-focus"
        }`}
        onClick={() => {
          router.push("/community");
        }}
      >
        コミュニティ
      </button>
      <button
        type="button"
        className={`h-full cursor-pointer px-4 text-white text-xl transition-colors duration-200 ${
          pathname === "/chat" ? "bg-focus" : "hover:bg-focus"
        }`}
        onClick={() => {
          router.push("/chat");
        }}
      >
        チャット
      </button>
      <button
        type="button"
        className={`h-full cursor-pointer px-4 text-white text-xl transition-colors duration-200 ${
          pathname === "/settings" ? "bg-focus" : "hover:bg-focus"
        }`}
        onClick={() => {
          router.push("/settings");
        }}
      >
        設定
      </button>
    </header>
  );
}
