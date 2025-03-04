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
      <div className="m-5">
        <Link
          href={"/settings/basic"}
          className={`block ${pathname === "/settings/basic" ? "font-bold underline" : ""}`}
        >
          基本情報
        </Link>
        <Link
          href={"/settings/university"}
          className={`block ${pathname === "/settings/university" ? "font-bold underline" : ""}`}
        >
          大学情報
        </Link>
        <Link
          href={"/settings/language"}
          className={`block ${pathname === "/settings/language" ? "font-bold underline" : ""}`}
        >
          言語情報
        </Link>
        <Link
          href={"/settings/topic"}
          className={`block ${pathname === "/settings/topic" ? "font-bold underline" : ""}`}
        >
          トピック
        </Link>
        <Link
          href={"/settings/favorite"}
          className={`block ${pathname === "/settings/favorite" ? "font-bold underline" : ""}`}
        >
          お気に入り
        </Link>
        <Link
          href={"/settings/block"}
          className={`block ${pathname === "/settings/block" ? "font-bold underline" : ""}`}
        >
          ブロック
        </Link>
        <Link
          href={"/settings/other"}
          className={`block ${pathname === "/settings/other" ? "font-bold underline" : ""}`}
        >
          その他
        </Link>
        <button type="button" className="btn btn-error m-5" onClick={logout}>
          log out
        </button>
      </div>
    </>
  );
}
