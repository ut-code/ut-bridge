"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppIcon } from "./AppIcon";

export default function Header() {
  const router = useRouter();
  return (
    <header className="h-16 w-full justify-center bg-primary fixed top-0 m-0 items-center flex">
      <Link
        href="/community"
        passHref
        className="-translate-y-1/2 absolute top-1/2 left-3 transform"
      >
        <AppIcon width={40} height={40} />
      </Link>
      <Link href="/community" className="text-white text-3xl cursor-pointer ">
        UT-Bridge
      </Link>
      <button
        type="button"
        className="text-white text-xl cursor-pointer hover:text-gray-300 hover:opacity-80 transition-colors duration-200"
        onClick={() => {
          router.push("/community");
        }}
      >
        コミュニティ
      </button>
      <button
        type="button"
        className="text-white text-xl cursor-pointer hover:text-gray-300 hover:opacity-80 transition-colors duration-200"
        onClick={() => {
          router.push("/chat");
        }}
      >
        チャット
      </button>
      <button
        type="button"
        className="text-white text-xl cursor-pointer hover:text-gray-300 hover:opacity-80 transition-colors duration-200"
        onClick={() => {
          router.push("/settings");
        }}
      >
        設定
      </button>
    </header>
  );
}
