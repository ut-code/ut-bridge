"use client";
import Link from "next/link";
import { useGoogleLogout } from "@/features/auth/functions/logout.ts";
import { usePathname } from "next/navigation";

export default function SideNav() {
  const { logout } = useGoogleLogout();
  const pathname = usePathname();

  return (
    <>
      <h1 className="font-bold text-3xl">設定画面</h1>
      <div className="m-5 border-gray-300 border-r">
        <Link
          href={"/settings/basic"}
          className={`my-3 block text-xl ${pathname === "/settings/basic" ? "font-bold underline" : ""}`}
        >
          基本情報
        </Link>
        <Link
          href={"/settings/university"}
          className={`my-3 block text-xl ${pathname === "/settings/university" ? "font-bold underline" : ""}`}
        >
          大学情報
        </Link>
        <Link
          href={"/settings/language"}
          className={`my-3 block text-xl ${pathname === "/settings/language" ? "font-bold underline" : ""}`}
        >
          言語情報
        </Link>
        <Link
          href={"/settings/topic"}
          className={`my-3 block text-xl ${pathname === "/settings/topic" ? "font-bold underline" : ""}`}
        >
          トピック
        </Link>
        <Link
          href={"/settings/favorite"}
          className={`my-3 block text-xl ${pathname === "/settings/favorite" ? "font-bold underline" : ""}`}
        >
          お気に入り
        </Link>
        <Link
          href={"/settings/block"}
          className={`my-3 block text-xl ${pathname === "/settings/block" ? "font-bold underline" : ""}`}
        >
          ブロック
        </Link>
        <Link
          href={"/settings/other"}
          className={`my-3 block text-xl ${pathname === "/settings/other" ? "font-bold underline" : ""}`}
        >
          その他
        </Link>
        <button type="button" className="btn btn-error my-3" onClick={logout}>
          ログアウト
        </button>
      </div>
    </>
  );
}
