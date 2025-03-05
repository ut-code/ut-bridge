"use client";
import { useGoogleLogout } from "@/features/auth/functions/logout.ts";
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
          className={`block rounded-t-xl bg-neutral-50 p-4 pl-8 text-xl sm:bg-transparent ${pathname === "/settings/basic" ? "font-bold underline" : ""}`}
        >
          基本情報
        </Link>
        <Link
          href={"/settings/university"}
          className={`block bg-neutral-50 p-4 pl-8 text-xl sm:bg-transparent ${pathname === "/settings/university" ? "font-bold underline" : ""}`}
        >
          大学情報
        </Link>
        <Link
          href={"/settings/language"}
          className={`block bg-neutral-50 p-4 pl-8 text-xl sm:bg-transparent ${pathname === "/settings/language" ? "font-bold underline" : ""}`}
        >
          言語情報
        </Link>
        <Link
          href={"/settings/topic"}
          className={`block bg-neutral-50 p-4 pl-8 text-xl sm:bg-transparent ${pathname === "/settings/topic" ? "font-bold underline" : ""}`}
        >
          トピック
        </Link>
        <Link
          href={"/settings/favorite"}
          className={`block bg-neutral-50 p-4 pl-8 text-xl sm:bg-transparent ${pathname === "/settings/favorite" ? "font-bold underline" : ""}`}
        >
          お気に入り
        </Link>
        <Link
          href={"/settings/block"}
          className={`block bg-neutral-50 p-4 pl-8 text-xl sm:bg-transparent ${pathname === "/settings/block" ? "font-bold underline" : ""}`}
        >
          ブロック
        </Link>
        <Link
          href={"/settings/other"}
          className={`block rounded-b-xl bg-neutral-50 p-4 pl-8 text-xl sm:bg-transparent ${pathname === "/settings/other" ? "font-bold underline" : ""}`}
        >
          その他
        </Link>
        <button type="button" className="btn btn-outline btn-error my-12 sm:my-3" onClick={logout}>
          ログアウト
        </button>
      </div>
    </>
  );
}
