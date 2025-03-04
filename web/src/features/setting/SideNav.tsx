"use client";
import Link from "next/link";
import { useGoogleLogout } from "@/features/auth/functions/logout.ts";

export default function SideNav() {
  const { logout } = useGoogleLogout();

  return (
    <>
      <h1 className="font-bold text-3xl">設定画面</h1>
      <div className="m-5">
        <Link href={"/settings/basic"} className="block">
          基本情報
        </Link>
        <Link href={"/settings/university"} className="block">
          大学情報
        </Link>
        <Link href={"/settings/language"} className="block">
          言語情報
        </Link>
        <Link href={"/settings/topic"} className="block">
          トピック
        </Link>
        <Link href={"#"} className="block">
          友達
        </Link>
        <Link href={"#"} className="block">
          その他
        </Link>
        <button type="button" className="btn btn-error m-5" onClick={logout}>
          log out
        </button>
      </div>
    </>
  );
}
