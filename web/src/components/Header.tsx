"use client";
import { m } from "@/paraglide/messages.js";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppIcon } from "./AppIcon.tsx";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 z-0 flex h-16 w-full items-center bg-tBlue">
      <Link href="/community" passHref className="px-4">
        <AppIcon width={36} height={36} />
      </Link>
      <Link href="/community" className="cursor-pointer px-4 text-2xl text-white">
        UT-Bridge
      </Link>
      <Link
        href="/community"
        className={`h-full cursor-pointer px-4 text-white text-xl transition-colors duration-200 ${
          pathname === "/community" ? "bg-focus" : "hover:bg-focus"
        }`}
      >
        {m.title_community()}
      </Link>
      <Link
        href="/chat"
        className={`h-full cursor-pointer px-4 text-white text-xl transition-colors duration-200 ${
          pathname === "/chat" ? "bg-focus" : "hover:bg-focus"
        }`}
      >
        {m.title_chat()}
      </Link>
      <Link
        href="/settings"
        className={`h-full cursor-pointer px-4 text-white text-xl transition-colors duration-200 ${
          pathname === "/settings" ? "bg-focus" : "hover:bg-focus"
        }`}
      >
        {m.title_settings()}
      </Link>
    </header>
  );
}
