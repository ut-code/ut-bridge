"use client";
import { useGoogleLogout } from "@/features/auth/functions/logout.ts";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideNav() {
  const { logout } = useGoogleLogout();
  const pathname = usePathname();

  return (
    <>
      <h1 className="hidden font-bold text-3xl sm:block">設定画面</h1>
      <div className="m-5 flex flex-col gap-0.5 border-gray-300 sm:block sm:gap-0 sm:border-r">
        <Link
          href={"/settings/basic"}
          className={`flex items-center justify-between rounded-t-xl bg-neutral-50 p-4 px-8 text-xl sm:bg-transparent sm:px-4 ${pathname === "/settings/basic" ? "font-bold underline" : ""}`}
        >
          基本情報
          <ChevronRight className="sm:hidden" />
        </Link>
        <Link
          href={"/settings/university"}
          className={`flex items-center justify-between bg-neutral-50 p-4 px-8 text-xl sm:bg-transparent sm:px-4 ${pathname === "/settings/university" ? "font-bold underline" : ""}`}
        >
          大学情報
          <ChevronRight className="sm:hidden" />
        </Link>
        <Link
          href={"/settings/language"}
          className={`flex items-center justify-between bg-neutral-50 p-4 px-8 text-xl sm:bg-transparent sm:px-4 ${pathname === "/settings/language" ? "font-bold underline" : ""}`}
        >
          言語情報
          <ChevronRight className="sm:hidden" />
        </Link>
        <Link
          href={"/settings/topic"}
          className={`flex items-center justify-between bg-neutral-50 p-4 px-8 text-xl sm:bg-transparent sm:px-4 ${pathname === "/settings/topic" ? "font-bold underline" : ""}`}
        >
          トピック
          <ChevronRight className="sm:hidden" />
        </Link>
        <Link
          href={"/settings/favorite"}
          className={`flex items-center justify-between bg-neutral-50 p-4 px-8 text-xl sm:bg-transparent sm:px-4 ${pathname === "/settings/favorite" ? "font-bold underline" : ""}`}
        >
          お気に入り
          <ChevronRight className="sm:hidden" />
        </Link>
        <Link
          href={"/settings/block"}
          className={`flex items-center justify-between bg-neutral-50 p-4 px-8 text-xl sm:bg-transparent sm:px-4 ${pathname === "/settings/block" ? "font-bold underline" : ""}`}
        >
          ブロック
          <ChevronRight className="sm:hidden" />
        </Link>
        <Link
          href={"/settings/other"}
          className={`flex items-center justify-between rounded-b-xl bg-neutral-50 p-4 px-8 text-xl sm:bg-transparent sm:px-4 ${pathname === "/settings/other" ? "font-bold underline" : ""}`}
        >
          その他
          <ChevronRight className="sm:hidden" />
        </Link>
        <button type="button" className="btn btn-outline btn-error my-12 sm:my-3" onClick={logout}>
          ログアウト
        </button>
      </div>
    </>
  );
}
