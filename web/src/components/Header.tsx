"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppIcon } from "./AppIcon";

export default function Header() {
  const router = useRouter();
  return (
    <header className="z-0 h-16 w-full bg-tBlue fixed top-0 flex items-center px-4 space-x-5">
      <Link href="/community" passHref>
        <AppIcon width={35} height={35} />
      </Link>
      <Link href="/community" className="text-white text-2xl cursor-pointer">
        UT-Bridge
      </Link>
      <button
        type="button"
        className="text-white text-xl px-4 py-2 rounded-md cursor-pointer hover:bg-focus transition-colors duration-200"
        onClick={() => {
          router.push("/community");
        }}
      >
        コミュニティ
      </button>
      <button
        type="button"
        className="text-white text-xl px-4 py-2 rounded-md cursor-pointer hover:bg-focus transition-colors duration-200"
        onClick={() => {
          router.push("/chat");
        }}
      >
        チャット
      </button>
      <button
        type="button"
        className="text-white text-xl px-4 py-2 rounded-md cursor-pointer hover:bg-focus transition-colors duration-200"
        onClick={() => {
          router.push("/settings");
        }}
      >
        設定
      </button>
    </header>
  );
}
