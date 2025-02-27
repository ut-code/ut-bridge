"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { AppIcon } from "./AppIcon.tsx";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className="z-0 h-16 w-full bg-tBlue fixed top-0 flex items-center">
      <Link href="/community" passHref className="px-4">
        <AppIcon width={36} height={36} />
      </Link>
      <Link href="/community" className="text-white text-2xl cursor-pointer px-4">
        UT-Bridge
      </Link>
      <button
        type="button"
        className={`text-white text-xl px-4 h-full cursor-pointer transition-colors duration-200 ${
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
        className={`text-white text-xl px-4 h-full cursor-pointer transition-colors duration-200 ${
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
        className={`text-white text-xl px-4 h-full cursor-pointer transition-colors duration-200 ${
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
